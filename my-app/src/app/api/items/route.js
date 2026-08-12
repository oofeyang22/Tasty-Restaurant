import dbConnect from "@/lib/mongodb.js";
import { Food } from "@/lib/models.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const foods = await Food.find({ isAvailable: true });
    return NextResponse.json(foods);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch foods" },
      { status: 500 }
    );
  }
}