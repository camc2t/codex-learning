"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function SignInButton() {
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch {
      window.location.href = "/api/auth/signin/github?callbackUrl=/dashboard";
    }
  }

  return (
    <button
      type="button"
      className="mt-8 w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
      onClick={handleSignIn}
      disabled={loading}
    >
      {loading ? "Redirecting..." : "Continue with GitHub"}
    </button>
  );
}
