import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb.js";
import {Review, Food} from "@/lib/models.js";
import { z } from "zod";

// Validation schema for reviews
const ReviewValidationSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  email: z.string().email("Invalid email address"),
  comment: z.string().min(1, "Review is required").max(500),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  location: z.string().optional(),
  foodItem: z.string().optional(),
  orderId: z.string().optional(),
});

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const foodId = searchParams.get("foodId");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const isApproved = searchParams.get("isApproved") !== "false";

    // Build query
    const query = { isApproved };
    if (foodId) {
      query.foodItem = foodId;
    }

    // Get random reviews or by date
    const reviews = await Review.aggregate([
      { $match: query },
      { $sample: { size: limit } },
      {
        $lookup: {
          from: "foods",
          localField: "foodItem",
          foreignField: "_id",
          as: "food",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          comment: 1,
          rating: 1,
          image: 1,
          location: 1,
          createdAt: 1,
          foodTitle: { $arrayElemAt: ["$food.title", 0] },
        },
      },
    ]);

    // If no random reviews found, get latest approved reviews
    if (reviews.length === 0) {
      const latestReviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("foodItem", "title");

      return NextResponse.json(latestReviews);
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Get IP and user agent for security
    const ipAddress = request.headers.get("x-forwarded-for") || 
                      request.headers.get("x-real-ip") || 
                      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const validation = ReviewValidationSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Check for duplicate reviews (limit to one per email per day)
    const existingReview = await Review.findOne({
      email: body.email,
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "You have already submitted a review today" },
        { status: 429 }
      );
    }

    // If foodItem is provided, verify it exists
    if (body.foodItem) {
      const food = await Food.findById(body.foodItem);
      if (!food) {
        return NextResponse.json(
          { message: "Food item not found" },
          { status: 404 }
        );
      }
    }

    // Create review
    const review = await Review.create({
      ...validation.data,
      isApproved: true, // Set to false if you want manual approval
      ipAddress,
      userAgent,
    });

    // Update food rating if foodItem is provided
    if (body.foodItem) {
      const avgRating = await Review.getAverageRating(body.foodItem);
      await Food.findByIdAndUpdate(body.foodItem, {
        rating: avgRating,
        $inc: { reviewsCount: 1 },
      });
    }

    return NextResponse.json(
      {
        message: "Review submitted successfully",
        review: {
          id: review._id,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json(
      { message: "Failed to submit review. Please try again." },
      { status: 500 }
    );
  }
}