"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="rounded-full border border-black px-4 py-2 text-xs uppercase tracking-wide"
      onClick={() => signOut()}
      type="button"
    >
      Sign Out
    </button>
  );
}
