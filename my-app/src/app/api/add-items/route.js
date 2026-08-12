import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";
import dbConnect from "@/lib/mongodb.js";
import { Food } from "@/lib/models.js";
import { FoodSchema } from "@/schemas/index.js";

export async function POST(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();

    // Validate input using Zod schema
    const validation = FoodSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Check if food item with same title already exists
    const existingFood = await Food.findOne({ 
      title: { $regex: new RegExp(`^${body.title}$`, 'i') } 
    });
    
    if (existingFood) {
      return NextResponse.json(
        { message: "A food item with this title already exists" },
        { status: 409 }
      );
    }

    // Create new food item
    const food = await Food.create({
      title: body.title.trim(),
      category: body.category,
      price: body.price,
      image: body.image,
      short_description: body.short_description.trim(),
      full_description: body.full_description.trim(),
      ingredients: body.ingredients || [],
      nutrition_info: body.nutrition_info || {},
      isAvailable: body.isAvailable !== undefined ? body.isAvailable : true,
      isFeatured: body.isFeatured || false,
      priority: body.priority || "Medium",
      preparationTime: body.preparationTime || 30,
      rating: body.rating || 4.5,
      reviewsCount: 0,
      date: new Date().toLocaleDateString(),
    });

    // Return success response
    return NextResponse.json(
      {
        message: "Food item added successfully",
        food: {
          id: food._id,
          title: food.title,
          category: food.category,
          price: food.price,
          isAvailable: food.isAvailable,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add item error:", error);
    
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to add food item. Please try again." },
      { status: 500 }
    );
  }
}