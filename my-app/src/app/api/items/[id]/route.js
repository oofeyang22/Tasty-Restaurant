import dbConnect from "@/lib/mongodb.js";
import { Food } from "@/lib/models.js";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // 1. Await params before using params.id
    const { id } = await params;
    
    const food = await Food.findById(id);
    if (!food) {
      return NextResponse.json(
        { error: "Food not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(food);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch food" },
      { status: 500 }
    );
  }
}