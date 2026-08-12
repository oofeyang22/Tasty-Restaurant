import { z } from "zod";

// User Schema
export const UserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
});

export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const UserUpdateSchema = UserSchema.partial();

// Food Schema
export const FoodSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  category: z.enum(["Igbo", "Yoruba", "Rice", "Intercontinental dishes"]),
  price: z.number().min(0, "Price cannot be negative"),
  image: z.string().url("Invalid image URL"),
  short_description: z.string().min(1, "Short description is required").max(200),
  full_description: z.string().min(1, "Full description is required"),
  ingredients: z.array(z.string()).optional(),
  nutrition_info: z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional(),
  }).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  preparationTime: z.number().min(1).optional(),
});

// Order Schema
export const OrderItemSchema = z.object({
  food: z.string(), // MongoDB ObjectId
  quantity: z.number().min(1, "Quantity must be at least 1"),
  specialInstructions: z.string().optional(),
});

export const OrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "Order must contain at least one item"),
  paymentMethod: z.enum(["stripe", "paypal", "cash", "bank_transfer"]),
  shippingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipCode: z.string().min(1, "Zip code is required"),
  }),
  deliveryInstructions: z.string().optional(),
});

// Cart Schema
export const CartItemSchema = z.object({
  food: z.string(), // MongoDB ObjectId
  quantity: z.number().min(1, "Quantity must be at least 1"),
  specialInstructions: z.string().optional(),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
});

// Add to existing schemas/index.js

export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(100),
  message: z.string().min(1, "Message is required").max(1000),
});

export const ReviewSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  email: z.string().email("Invalid email address"),
  comment: z.string().min(1, "Review is required").max(500),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  location: z.string().optional(),
  foodItem: z.string().optional(),
  orderId: z.string().optional(),
});

export const ReviewUpdateSchema = z.object({
  comment: z.string().min(1).max(500).optional(),
  rating: z.number().min(1).max(5).optional(),
  isApproved: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});


// Validation functions
export const validateUser = (data) => UserSchema.safeParse(data);
export const validateUserLogin = (data) => UserLoginSchema.safeParse(data);
export const validateFood = (data) => FoodSchema.safeParse(data);
export const validateOrder = (data) => OrderSchema.safeParse(data);
export const validateCart = (data) => CartSchema.safeParse(data);
export const validateContact = (data) => ContactSchema.safeParse(data);
export const validateReview = (data) => ReviewSchema.safeParse(data);
export const validateReviewUpdate = (data) => ReviewUpdateSchema.safeParse(data);