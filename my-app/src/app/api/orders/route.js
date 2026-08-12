import dbConnect from "@/lib/mongodb.js";
import {Order, Cart} from "@/lib/models.js";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, paymentMethod, shippingAddress, deliveryInstructions } = await request.json();

    await dbConnect();

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.food);
      if (!food || !food.isAvailable) {
        return NextResponse.json(
          { error: `Food ${item.food} not available` },
          { status: 400 }
        );
      }
      const price = food.price;
      subtotal += price * item.quantity;
      orderItems.push({
        food: item.food,
        quantity: item.quantity,
        price,
        specialInstructions: item.specialInstructions || "",
      });
    }

    const tax = subtotal * 0.075; // 7.5% tax
    const deliveryFee = 500; // Fixed delivery fee
    const totalAmount = subtotal + tax + deliveryFee;

    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      totalAmount,
      subtotal,
      tax,
      deliveryFee,
      paymentMethod,
      shippingAddress,
      deliveryInstructions,
      status: "pending",
      paymentStatus: "pending",
    });

    // Clear user's cart
    await Cart.findOneAndDelete({ user: session.user.id });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find({ user: session.user.id })
      .populate("items.food")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}