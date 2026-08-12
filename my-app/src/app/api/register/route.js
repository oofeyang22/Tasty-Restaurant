import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb.js";
import {User} from "@/lib/models.js";
import { validateUser } from "@/schemas/index.js";

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { fullName, email, password } = body;

    // Validate input using Zod
    const validation = validateUser({ fullName, email, password });
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 } // Conflict
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
    });

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    // Return success response
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userObject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Handle duplicate key error (should be caught by existingUser check, but just in case)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to register user. Please try again." },
      { status: 500 }
    );
  }
}