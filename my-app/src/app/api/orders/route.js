import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";
import dbConnect from "@/lib/mongodb.js";
import {Order, Food} from "@/lib/models.js";


// GET user orders
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { user: session.user.id };
    if (status !== "all") {
      query.status = status;
    }

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    // Get orders with populated fields
    const orders = await Order.find(query)
      .populate({
        path: "items.food",
        model: Food,
        select: "title image price category",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Create new order
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();

    const { items, shippingAddress, paymentMethod, deliveryInstructions } = body;

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.food);
      if (!food) {
        return NextResponse.json(
          { message: `Food item not found` },
          { status: 404 }
        );
      }
      if (!food.isAvailable) {
        return NextResponse.json(
          { message: `${food.title} is currently unavailable` },
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

    const tax = Math.round(subtotal * 0.075);
    const deliveryFee = 0;
    const totalAmount = subtotal + tax + deliveryFee;

    // Create order
    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "stripe",
      paymentStatus: "pending",
      status: "pending",
      deliveryInstructions: deliveryInstructions || "",
    });

    // Populate food items
    await order.populate("items.food", "title image price category");

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}