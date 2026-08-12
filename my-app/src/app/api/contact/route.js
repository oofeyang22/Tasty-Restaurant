import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb.js";
import { Contact } from "@/lib/models.js";
import { z } from "zod";

// Validation schema for contact form
const ContactValidationSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(100),
  message: z.string().min(1, "Message is required").max(1000),
});

export async function POST(request) {
  try {
    // Get IP and user agent for security
    const ipAddress = request.headers.get("x-forwarded-for") || 
                      request.headers.get("x-real-ip") || 
                      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Connect to database
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const validation = ContactValidationSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Check for spam (optional: rate limiting or duplicate checking)
    const recentContact = await Contact.findOne({
      email: body.email,
      createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) }, // Last 5 minutes
    });

    if (recentContact) {
      return NextResponse.json(
        { message: "Please wait before sending another message" },
        { status: 429 }
      );
    }

    // Create contact message
    const contact = await Contact.create({
      ...validation.data,
      ipAddress,
      userAgent,
    });

    // Here you could send email notification to admin
    // await sendEmail({
    //   to: process.env.ADMIN_EMAIL,
    //   subject: `New Contact Message: ${contact.subject}`,
    //   html: `
    //     <h2>New Contact Message</h2>
    //     <p><strong>Name:</strong> ${contact.name}</p>
    //     <p><strong>Email:</strong> ${contact.email}</p>
    //     <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
    //     <p><strong>Subject:</strong> ${contact.subject}</p>
    //     <p><strong>Message:</strong> ${contact.message}</p>
    //   `,
    // });

    return NextResponse.json(
      {
        message: "Message sent successfully",
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { message: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

// GET endpoint for admin to view all contact messages
export async function GET(request) {
  try {
    // Check if user is admin (you'll need to implement authentication check)
    // For now, we'll return pending messages for demonstration
    // You should add proper authentication here

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const query = status === "all" ? {} : { status };

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("repliedBy", "fullName email"),
      Contact.countDocuments(query),
    ]);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Contact GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}