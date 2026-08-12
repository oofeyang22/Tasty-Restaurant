"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const errorMessages = {
  OAuthSignin: "Error starting the OAuth sign-in process",
  OAuthCallback: "Error during the OAuth callback process",
  OAuthCreateAccount: "Could not create OAuth account",
  EmailCreateAccount: "Could not create email account",
  Callback: "Error during the callback process",
  OAuthAccountNotLinked: "This email is already linked to another account",
  EmailSignin: "Error sending verification email",
  CredentialsSignin: "Invalid credentials",
  SessionRequired: "Please sign in to access this page",
  Default: "An authentication error occurred",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="bg-[#1f2937] p-8 rounded-xl w-full max-w-md shadow-lg text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-white mb-4">
        Authentication Error
      </h2>
      <p className="text-gray-300 mb-6">{errorMessage}</p>
      <div className="space-y-4">
        <Link
          href="/login"
          className="block w-full bg-yellow-400 text-black py-3 rounded-md font-semibold hover:bg-yellow-500 transition"
        >
          Back to Login
        </Link>
        <Link
          href="/"
          className="block w-full bg-gray-700 text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <Suspense fallback={<div className="text-gray-300">Loading...</div>}>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}