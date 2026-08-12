import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";
import dbConnect from "@/lib/mongodb.js";
import { Food } from "@/lib/models.js";
import { FoodSchema } from "@/schemas/index.js";

export async function PUT(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = params;
    const body = await request.json();

    // Find the food item
    const existingFood = await Food.findById(id);
    if (!existingFood) {
      return NextResponse.json(
        { message: "Food item not found" },
        { status: 404 }
      );
    }

    // Validate input (partial validation for updates)
    const validation = FoodSchema.partial().safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Check for duplicate title if title is being changed
    if (body.title && body.title !== existingFood.title) {
      const duplicate = await Food.findOne({
        title: { $regex: new RegExp(`^${body.title}$`, 'i') },
        _id: { $ne: id },
      });
      
      if (duplicate) {
        return NextResponse.json(
          { message: "A food item with this title already exists" },
          { status: 409 }
        );
      }
    }

    // Update food item
    const updatedFood = await Food.findByIdAndUpdate(
      id,
      {
        ...(body.title && { title: body.title.trim() }),
        ...(body.category && { category: body.category }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.image && { image: body.image }),
        ...(body.short_description && { short_description: body.short_description.trim() }),
        ...(body.full_description && { full_description: body.full_description.trim() }),
        ...(body.ingredients && { ingredients: body.ingredients }),
        ...(body.nutrition_info && { nutrition_info: body.nutrition_info }),
        ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
        ...(body.priority && { priority: body.priority }),
        ...(body.preparationTime && { preparationTime: body.preparationTime }),
        ...(body.rating !== undefined && { rating: body.rating }),
      },
      { 
        new: true,
        runValidators: true 
      }
    );

    return NextResponse.json({
      message: "Food item updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    console.error("Update item error:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update food item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = params;

    // Find and delete the food item
    const deletedFood = await Food.findByIdAndDelete(id);
    
    if (!deletedFood) {
      return NextResponse.json(
        { message: "Food item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Food item deleted successfully",
      food: {
        id: deletedFood._id,
        title: deletedFood.title,
      },
    });
  } catch (error) {
    console.error("Delete item error:", error);
    return NextResponse.json(
      { message: "Failed to delete food item" },
      { status: 500 }
    );
  }
}