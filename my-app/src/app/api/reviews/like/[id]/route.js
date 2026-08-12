import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb.js";
import {Review} from "@/lib/models.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";

export async function POST(request, { params }) {
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

    // Check if user already liked the review
    const alreadyLiked = review.likedBy.includes(session.user.id);

    let update;
    if (alreadyLiked) {
      // Unlike
      update = {
        $pull: { likedBy: session.user.id },
        $inc: { likes: -1 },
      };
    } else {
      // Like
      update = {
        $addToSet: { likedBy: session.user.id },
        $inc: { likes: 1 },
      };
    }

    const updatedReview = await Review.findByIdAndUpdate(
      params.id,
      update,
      { new: true }
    );

    return NextResponse.json({
      likes: updatedReview.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Review like error:", error);
    return NextResponse.json(
      { message: "Failed to update like" },
      { status: 500 }
    );
  }
}