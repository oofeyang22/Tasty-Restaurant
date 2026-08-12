import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb.js";
import { User } from "@/lib/models.js";

export const authOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
        };
      },
    }),

    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        await dbConnect();

        // Find user by email and include password field
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Check if password matches
        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error("Invalid email or password");
        }

        // Return user object without password
        const userObject = user.toObject();
        delete userObject.password;

        return {
          id: userObject._id.toString(),
          name: userObject.fullName,
          email: userObject.email,
          role: userObject.role,
          image: userObject.image || null,
        };
      },
    }),
  ],

  callbacks: {
    // JWT callback - Add custom fields to token
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // Handle Google OAuth sign in
      if (account?.provider === "google" && user) {
        await dbConnect();
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // Create new user for Google sign in
          dbUser = await User.create({
            fullName: user.name,
            email: user.email,
            password: await bcrypt.hash(Math.random().toString(36), 10),
            role: "user",
            image: user.image,
          });
        }

        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.email = dbUser.email;
        token.name = dbUser.fullName;
        token.picture = dbUser.image || user.image;
      }

      return token;
    },

    // Session callback - Add custom fields to session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },

    // Sign in callback - Control who can sign in
    async signIn({ user, account, profile }) {
      // Allow all users to sign in
      // You can add additional checks here if needed
      return true;
    },

    // Redirect callback - Custom redirect after sign in/out
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",

  // Additional options
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };