import Link from "next/link";
import { SignInButton } from "@/components/SignInButton";

export default function SignIn() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="container py-20">
        <Link href="/" className="text-sm hover:underline">
          ← Back
        </Link>
        <div className="mt-12 max-w-lg rounded-3xl border border-black/10 bg-white p-8 shadow-lift">
          <h1 className="text-3xl font-display">Sign in</h1>
          <p className="mt-4 text-sm text-black/60">
            Use GitHub to save your progress and prompts.
          </p>
          <SignInButton />
        </div>
      </div>
    </div>
  );
}
