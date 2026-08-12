//app/scripts/seed.js
import dbConnect from "../lib/mongodb.js";
import { User, Food, Order, Cart, Contact, Review } from "../lib/models.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sampleFoods = [
  // Igbo Cuisine
  {
    title: "Ofe Onugbu",
    category: "Igbo",
    price: 4500,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    short_description: "Traditional Igbo bitter leaf soup with assorted meat",
    full_description: "A rich and nutritious soup made from bitter leaves, cocoyam, and assorted meats including beef, tripe, and dried fish. Served with fufu or pounded yam.",
    ingredients: ["Bitter leaves", "Cocoyam", "Beef", "Tripe", "Dried fish", "Palm oil", "Seasoning"],
    nutrition_info: { calories: 350, protein: 25, carbs: 30, fat: 15 },
    isFeatured: true,
    priority: "High",
    preparationTime: 60,
  },
  {
    title: "Abacha",
    category: "Igbo",
    price: 3500,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800",
    short_description: "African salad made from cassava flakes",
    full_description: "Also known as African salad, Abacha is made from dried cassava flakes, palm oil, onions, and a variety of vegetables and protein. A refreshing Igbo delicacy.",
    ingredients: ["Cassava flakes", "Palm oil", "Onions", "Ugba", "Stockfish", "Crayfish", "Pepper"],
    nutrition_info: { calories: 280, protein: 18, carbs: 35, fat: 10 },
    isFeatured: true,
    priority: "Medium",
    preparationTime: 45,
  },
  // Yoruba Cuisine
  {
    title: "Amala with Ewedu Soup",
    category: "Yoruba",
    price: 4000,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN2x0ShXzz0N7uH2fu5QzAUEwQ3K5wROtSv8PC4M48fg&s=10",
    short_description: "Classic Yoruba combo of amala and ewedu soup",
    full_description: "Smooth and stretchy amala made from yam flour, served with a delicious ewedu soup made from jute leaves, and assorted meat. A true Yoruba comfort food.",
    ingredients: ["Yam flour", "Jute leaves", "Ponmo", "Beef", "Shaki", "Pepper", "Seasoning"],
    nutrition_info: { calories: 380, protein: 22, carbs: 45, fat: 12 },
    isFeatured: true,
    priority: "High",
    preparationTime: 50,
  },
  {
    title: "Jollof Rice with Chicken",
    category: "Yoruba",
    price: 5500,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvuVzd8WKck8bzaXrrBWBSbCme5sd_RyPbsLY_Jd1vqZAQsnhEcTep5iXK&s=1",
    short_description: "Flavorful jollof rice with grilled chicken",
    full_description: "A vibrant and fragrant jollof rice cooked in tomato and pepper sauce, served with well-spiced grilled chicken. A West African favorite that never disappoints.",
    ingredients: ["Rice", "Tomatoes", "Pepper", "Onions", "Chicken", "Thyme", "Curry", "Bay leaves"],
    nutrition_info: { calories: 420, protein: 30, carbs: 50, fat: 15 },
    isFeatured: true,
    priority: "Medium",
    preparationTime: 40,
  },
  // Rice Dishes
  {
    title: "Fried Rice",
    category: "Rice",
    price: 4800,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST-bg37vEUxq4rtTri09k46mAZe-oLRe_Xy-Txl6pTBiJ3IDKOOuKDbFw&s=10",
    short_description: "Savory fried rice with mixed vegetables and protein",
    full_description: "A colorful and flavorful fried rice with carrots, peas, green beans, and your choice of chicken or shrimp. Perfect for any occasion.",
    ingredients: ["Rice", "Carrots", "Peas", "Green beans", "Chicken", "Shrimp", "Soy sauce", "Seasoning"],
    nutrition_info: { calories: 380, protein: 20, carbs: 45, fat: 14 },
    isFeatured: false,
    priority: "Low",
    preparationTime: 35,
  },
  {
    title: "Coconut Rice",
    category: "Rice",
    price: 4200,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh3iFnfRN-pUOLbwaGIvxxvozh6TntjL_pWT8YYNaQsoPbt-bECk8ZG8UD&s=10",
    short_description: "Creamy coconut rice with a tropical twist",
    full_description: "Rich and creamy rice cooked in coconut milk, with a hint of ginger and garlic. Served with grilled fish or chicken.",
    ingredients: ["Rice", "Coconut milk", "Ginger", "Garlic", "Onions", "Fish", "Pepper"],
    nutrition_info: { calories: 360, protein: 18, carbs: 40, fat: 16 },
    isFeatured: false,
    priority: "Low",
    preparationTime: 30,
  },
  // Intercontinental Dishes
  {
    title: "Pepperoni Pizza",
    category: "Intercontinental dishes",
    price: 6500,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    short_description: "Classic pepperoni pizza with a crispy crust",
    full_description: "A delicious classic pizza with tomato sauce, mozzarella cheese, and generous pepperoni toppings. Baked to perfection in a wood-fired oven.",
    ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Pepperoni", "Olive oil", "Oregano"],
    nutrition_info: { calories: 450, protein: 24, carbs: 48, fat: 20 },
    isFeatured: true,
    priority: "Medium",
    preparationTime: 25,
  },
  {
    title: "Spaghetti Bolognese",
    category: "Intercontinental dishes",
    price: 5800,
    image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800",
    short_description: "Rich and hearty spaghetti with meat sauce",
    full_description: "A classic Italian pasta dish with a rich beef and tomato sauce, simmered with herbs and served on a bed of perfectly cooked spaghetti.",
    ingredients: ["Spaghetti", "Ground beef", "Tomatoes", "Onions", "Garlic", "Basil", "Parmesan"],
    nutrition_info: { calories: 400, protein: 28, carbs: 45, fat: 16 },
    isFeatured: false,
    priority: "Low",
    preparationTime: 30,
  },
  {
    title: "Chicken Alfredo",
    category: "Intercontinental dishes",
    price: 6200,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjbTSx1NS9ZdzdMG55S7M0iWoAGlbYX_rgwGElBnUmuQ&s=10",
    short_description: "Creamy pasta with grilled chicken and parmesan",
    full_description: "A classic American Italian pasta dish with creamy alfredo sauce, grilled chicken breast, and freshly grated parmesan cheese.",
    ingredients: ["Fettuccine", "Chicken breast", "Heavy cream", "Parmesan", "Butter", "Garlic"],
    nutrition_info: { calories: 520, protein: 32, carbs: 42, fat: 28 },
    isFeatured: true,
    priority: "High",
    preparationTime: 35,
  },
];

const sampleUsers = [
  {
    fullName: "Chioma Okonkwo",
    email: "chioma@example.com",
    password: "password123",
    phone: "+234801234567",
    role: "user",
    address: {
      street: "123 Lagos Road",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      zipCode: "100001",
    },
  },
  {
    fullName: "Ayodeji Adeyemi",
    email: "ayodeji@example.com",
    password: "password123",
    phone: "+234802345678",
    role: "user",
    address: {
      street: "456 Ibadan Street",
      city: "Ibadan",
      state: "Oyo",
      country: "Nigeria",
      zipCode: "200001",
    },
  },
  {
    fullName: "Ngozi Anyanwu",
    email: "ngozi@example.com",
    password: "password123",
    phone: "+234803456789",
    role: "user",
    address: {
      street: "789 Enugu Avenue",
      city: "Enugu",
      state: "Enugu",
      country: "Nigeria",
      zipCode: "400001",
    },
  },
  {
    fullName: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    phone: "+234809876543",
    role: "admin",
    address: {
      street: "Admin Plaza",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      zipCode: "100001",
    },
  },
];

const sampleContacts = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "+234701234567",
    subject: "Product Inquiry",
    message: "I would like to know more about your catering services.",
    status: "pending",
    ipAddress: "192.168.1.100",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+234702345678",
    subject: "Delivery Issue",
    message: "My recent order was delayed. Can you help?",
    status: "read",
    ipAddress: "192.168.1.101",
  },
];

async function seedDatabase() {
  try {
    await dbConnect();
    console.log("Connected to database");

    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Food.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
      Review.deleteMany({}),
      Contact.deleteMany({}),
    ]);
    console.log("✓ Cleared all collections");

    // ===== SEED FOODS =====
    const insertedFoods = await Food.insertMany(sampleFoods);
    console.log(`✓ Inserted ${insertedFoods.length} foods`);

    // ===== SEED USERS =====
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`✓ Inserted ${insertedUsers.length} users`);

    // ===== SEED CARTS =====
    const cartData = [
      {
        user: insertedUsers[0]._id,
        items: [
          {
            food: insertedFoods[0]._id, // Ofe Onugbu
            quantity: 2,
            specialInstructions: "Extra meat please",
          },
          {
            food: insertedFoods[7]._id, // Pepperoni Pizza
            quantity: 1,
          },
        ],
      },
      {
        user: insertedUsers[1]._id,
        items: [
          {
            food: insertedFoods[3]._id, // Jollof Rice with Chicken
            quantity: 1,
          },
        ],
      },
    ];

    const insertedCarts = await Cart.insertMany(cartData);
    console.log(`✓ Inserted ${insertedCarts.length} carts`);

    // Update users with cart references
    await User.findByIdAndUpdate(insertedUsers[0]._id, {
      cart: insertedCarts[0]._id,
    });
    await User.findByIdAndUpdate(insertedUsers[1]._id, {
      cart: insertedCarts[1]._id,
    });

    // ===== SEED ORDERS =====
    const orderData = [
      {
        user: insertedUsers[0]._id,
        items: [
          {
            food: insertedFoods[0]._id, // Ofe Onugbu
            quantity: 2,
            price: insertedFoods[0].price,
            specialInstructions: "Extra meat",
          },
          {
            food: insertedFoods[1]._id, // Abacha
            quantity: 1,
            price: insertedFoods[1].price,
          },
        ],
        subtotal: insertedFoods[0].price * 2 + insertedFoods[1].price,
        tax: (insertedFoods[0].price * 2 + insertedFoods[1].price) * 0.075,
        deliveryFee: 500,
        totalAmount:
          insertedFoods[0].price * 2 +
          insertedFoods[1].price +
          (insertedFoods[0].price * 2 + insertedFoods[1].price) * 0.075 +
          500,
        status: "delivered",
        paymentMethod: "stripe",
        paymentStatus: "paid",
        shippingAddress: {
          street: "123 Lagos Road",
          city: "Lagos",
          state: "Lagos",
          country: "Nigeria",
          zipCode: "100001",
        },
        deliveredAt: new Date(),
      },
      {
        user: insertedUsers[1]._id,
        items: [
          {
            food: insertedFoods[3]._id, // Jollof Rice with Chicken
            quantity: 1,
            price: insertedFoods[3].price,
          },
        ],
        subtotal: insertedFoods[3].price,
        tax: insertedFoods[3].price * 0.075,
        deliveryFee: 500,
        totalAmount: insertedFoods[3].price + insertedFoods[3].price * 0.075 + 500,
        status: "preparing",
        paymentMethod: "paypal",
        paymentStatus: "paid",
        shippingAddress: {
          street: "456 Ibadan Street",
          city: "Ibadan",
          state: "Oyo",
          country: "Nigeria",
          zipCode: "200001",
        },
      },
      {
        user: insertedUsers[2]._id,
        items: [
          {
            food: insertedFoods[8]._id, // Chicken Alfredo
            quantity: 2,
            price: insertedFoods[8].price,
          },
        ],
        subtotal: insertedFoods[8].price * 2,
        tax: insertedFoods[8].price * 2 * 0.075,
        deliveryFee: 500,
        totalAmount:
          insertedFoods[8].price * 2 +
          insertedFoods[8].price * 2 * 0.075 +
          500,
        status: "confirmed",
        paymentMethod: "cash",
        paymentStatus: "pending",
        shippingAddress: {
          street: "789 Enugu Avenue",
          city: "Enugu",
          state: "Enugu",
          country: "Nigeria",
          zipCode: "400001",
        },
      },
    ];

    const insertedOrders = await Order.insertMany(orderData);
    console.log(`✓ Inserted ${insertedOrders.length} orders`);

    // Update users with order references
    await User.findByIdAndUpdate(insertedUsers[0]._id, {
      orders: [insertedOrders[0]._id],
    });
    await User.findByIdAndUpdate(insertedUsers[1]._id, {
      orders: [insertedOrders[1]._id],
    });
    await User.findByIdAndUpdate(insertedUsers[2]._id, {
      orders: [insertedOrders[2]._id],
    });

    // ===== SEED REVIEWS =====
    const reviewData = [
      {
        name: "Chioma Okonkwo",
        email: "chioma@example.com",
        comment: "Excellent soup! Very authentic and delicious. Will order again.",
        rating: 5,
        location: "Lagos",
        isApproved: true,
        isFeatured: true,
        user: insertedUsers[0]._id,
        foodItem: insertedFoods[0]._id, // Ofe Onugbu
        orderId: insertedOrders[0]._id,
        likes: 12,
      },
      {
        name: "Ayodeji Adeyemi",
        email: "ayodeji@example.com",
        comment: "Great jollof rice! Perfect spices and well-cooked chicken.",
        rating: 4,
        location: "Ibadan",
        isApproved: true,
        isFeatured: false,
        user: insertedUsers[1]._id,
        foodItem: insertedFoods[3]._id, // Jollof Rice with Chicken
        orderId: insertedOrders[1]._id,
        likes: 8,
      },
      {
        name: "Ngozi Anyanwu",
        email: "ngozi@example.com",
        comment: "The Chicken Alfredo was creamy and delicious!",
        rating: 5,
        location: "Enugu",
        isApproved: true,
        isFeatured: false,
        user: insertedUsers[2]._id,
        foodItem: insertedFoods[8]._id, // Chicken Alfredo
        orderId: insertedOrders[2]._id,
        likes: 5,
      },
      {
        name: "Tunde Bello",
        email: "tunde@example.com",
        comment: "Good quality pizza but delivery was slow.",
        rating: 3,
        location: "Lagos",
        isApproved: true,
        isFeatured: false,
        foodItem: insertedFoods[6]._id, // Pepperoni Pizza
        likes: 2,
      },
    ];

    const insertedReviews = await Review.insertMany(reviewData);
    console.log(`✓ Inserted ${insertedReviews.length} reviews`);

    // ===== SEED CONTACTS =====
    const contactDataWithUserRef = [
      ...sampleContacts,
      {
        name: "Support Team",
        email: "support@example.com",
        phone: "+2348009876543",
        subject: "Partnership Opportunity",
        message: "Interested in partnering with your restaurant.",
        status: "pending",
        ipAddress: "192.168.1.102",
        repliedBy: insertedUsers[3]._id, // Admin user
      },
    ];

    const insertedContacts = await Contact.insertMany(contactDataWithUserRef);
    console.log(`✓ Inserted ${insertedContacts.length} contact messages`);

    // ===== SUMMARY =====
    console.log("\n========== DATABASE SEEDING COMPLETE ==========");
    console.log(`✓ Foods: ${insertedFoods.length}`);
    console.log(`✓ Users: ${insertedUsers.length}`);
    console.log(`✓ Carts: ${insertedCarts.length}`);
    console.log(`✓ Orders: ${insertedOrders.length}`);
    console.log(`✓ Reviews: ${insertedReviews.length}`);
    console.log(`✓ Contacts: ${insertedContacts.length}`);
    console.log("===============================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
}

seedDatabase();