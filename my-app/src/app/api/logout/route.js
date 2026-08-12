import { NextResponse } from "next/server";

export async function POST() {
  try {
    // NextAuth handles logout through the signOut function
    // This endpoint is just for additional cleanup if needed
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to logout" },
      { status: 500 }
    );
  }
}