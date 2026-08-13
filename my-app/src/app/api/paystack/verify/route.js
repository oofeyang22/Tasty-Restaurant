import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb.js";
import {Order, Food} from "@/lib/models.js";
//import useCartStore from "@/stores/useCartStore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { message: "Reference is required" },
        { status: 400 }
      );
    }

    // Verify transaction with Paystack
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      throw new Error("Paystack secret key not configured");
    }

    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      }
    );

    const data = await paystackResponse.json();

    if (!data.status) {
      throw new Error(data.message || "Payment verification failed");
    }

    // Check if payment was successful
    if (data.data.status !== "success") {
      // Update order status to failed
      await dbConnect();
      await Order.findOneAndUpdate(
        { paystackReference: reference },
        { paymentStatus: "failed", status: "cancelled" }
      );

      return NextResponse.json({
        success: false,
        message: "Payment was not successful",
        status: data.data.status,
      });
    }

    // Payment successful - update order
    await dbConnect();

    const order = await Order.findOneAndUpdate(
      { paystackReference: reference },
      {
        paymentStatus: "paid",
        status: "confirmed",
        paystackResponse: data.data,
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      order,
      transaction: data.data,
    });
  } catch (error) {
    console.error("Paystack verification error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}