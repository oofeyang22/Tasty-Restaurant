import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb.js";
import {Order, Food} from "@/lib/models.js";
//import useCartStore from "@/stores/useCartStore";

export async function GET(request) {
  try {
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

    // Update food items stock (if you have stock management)
    for (const item of order.items) {
      await Food.findByIdAndUpdate(item.food, {
        // Decrease stock here if you have a stock field
        // $inc: { stock: -item.quantity }
      });
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