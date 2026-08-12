import dbConnect from "@/lib/mongodb.js";
import { Cart } from "@/lib/models.js";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    let cart = await Cart.findOne({ user: session.user.id }).populate("items.food");

    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { foodId, quantity = 1, specialInstructions = "" } = await request.json();

    await dbConnect();
    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.food.toString() === foodId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      if (specialInstructions) {
        existingItem.specialInstructions = specialInstructions;
      }
    } else {
      cart.items.push({
        food: foodId,
        quantity,
        specialInstructions,
      });
    }

    await cart.save();
    await cart.populate("items.food");

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}