import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";
import dbConnect from "@/lib/mongodb.js";
import {Order} from "@/lib/models.js";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, subtotal, tax, total, customer, shippingAddress } = body;

    // Validate request
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Initialize Paystack transaction
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      throw new Error("Paystack secret key not configured");
    }

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customer.email,
          amount: total * 100, // Paystack uses kobo (multiply by 100)
          currency: "NGN",
          metadata: {
            userId: session.user.id,
            items: items.map(item => ({
              foodId: item.food,
              quantity: item.quantity,
              price: item.price,
              title: item.title,
            })),
            shippingAddress,
            customerName: customer.fullName,
            customerPhone: customer.phone,
          },
          callback_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
        }),
      }
    );

    const data = await paystackResponse.json();

    if (!data.status) {
      throw new Error(data.message || "Paystack initialization failed");
    }

    // Create order in database with pending status
    await dbConnect();
    
    const orderData = {
      user: session.user.id,
      items: items.map(item => ({
        food: item.food,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: total,
      subtotal: subtotal,
      tax: tax,
      paymentMethod: "paystack",
      paymentStatus: "pending",
      status: "pending",
      shippingAddress,
      paystackReference: data.data.reference,
      stripeSessionId: null,
    };

    const order = await Order.create(orderData);

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to initialize payment" },
      { status: 500 }
    );
  }
}