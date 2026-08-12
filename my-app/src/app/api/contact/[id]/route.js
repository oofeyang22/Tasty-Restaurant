import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb.js";
import {Contact} from "@/lib/models.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const contact = await Contact.findById(params.id).populate(
      "repliedBy",
      "fullName email"
    );

    if (!contact) {
      return NextResponse.json(
        { message: "Contact message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Contact GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { status, replyMessage } = await request.json();

    const contact = await Contact.findById(params.id);
    if (!contact) {
      return NextResponse.json(
        { message: "Contact message not found" },
        { status: 404 }
      );
    }

    const updates = { status };
    if (replyMessage) {
      updates.replyMessage = replyMessage;
      updates.repliedAt = new Date();
      updates.repliedBy = session.user.id;
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    );

    // Here you could send email notification to the user
    // if (replyMessage) {
    //   await sendEmail({
    //     to: contact.email,
    //     subject: `Re: ${contact.subject}`,
    //     html: `
    //       <h2>Response to your message</h2>
    //       <p><strong>Original Message:</strong> ${contact.message}</p>
    //       <p><strong>Our Response:</strong> ${replyMessage}</p>
    //     `,
    //   });
    // }

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error("Contact PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const contact = await Contact.findByIdAndDelete(params.id);

    if (!contact) {
      return NextResponse.json(
        { message: "Contact message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Message deleted successfully" }
    );
  } catch (error) {
    console.error("Contact DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete message" },
      { status: 500 }
    );
  }
}