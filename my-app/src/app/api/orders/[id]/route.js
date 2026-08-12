import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";
import dbConnect from "@/lib/mongodb.js";
import {Order, Food} from "@/lib/models.js";


export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const order = await Order.findById(params.id)
      .populate({
        path: "items.food",
        model: Food,
        select: "title image price category short_description",
      })
      .populate("user", "fullName email phone");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized to view this order" },
        { status: 401 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
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

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Only admin can update order status
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { status, deliveryInstructions } = await request.json();

    const updates = {};
    if (status) updates.status = status;
    if (deliveryInstructions) updates.deliveryInstructions = deliveryInstructions;

    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    ).populate("items.food", "title image price");

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}