import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb.js";
import {Review, Food} from "@/lib/models.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const review = await Review.findById(params.id)
      .populate("user", "fullName email")
      .populate("foodItem", "title image price")
      .populate("replies.user", "fullName");

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const review = await Review.findById(params.id);

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Check if user is admin or review owner
    const isAdmin = session.user.role === "admin";
    const isOwner = review.user && review.user.toString() === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const updates = await request.json();
    
    // Admins can update any field, users can only update their own review
    if (!isAdmin) {
      const allowedUpdates = ["comment", "rating"];
      Object.keys(updates).forEach((key) => {
        if (!allowedUpdates.includes(key)) {
          delete updates[key];
        }
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    );

    // Update food rating if rating was changed
    if (updates.rating && review.foodItem) {
      const avgRating = await Review.getAverageRating(review.foodItem);
      await Food.findByIdAndUpdate(review.foodItem, { rating: avgRating });
    }

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Review PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const review = await Review.findByIdAndDelete(params.id);

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Update food rating after deletion
    if (review.foodItem) {
      const avgRating = await Review.getAverageRating(review.foodItem);
      await Food.findByIdAndUpdate(review.foodItem, {
        rating: avgRating,
        $inc: { reviewsCount: -1 },
      });
    }

    return NextResponse.json(
      { message: "Review deleted successfully" }
    );
  } catch (error) {
    console.error("Review DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete review" },
      { status: 500 }
    );
  }
}