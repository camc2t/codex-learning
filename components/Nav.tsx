import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export async function Nav() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex items-center justify-between border-b border-black/10 py-6">
      <Link href="/" className="text-lg font-display">
        Codex Path
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/tracks" className="hover:underline">
          Tracks
        </Link>
        {session?.user ? (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <SignOutButton />
          </>
        ) : (
          <Link
            href="/signin"
            className="rounded-full border border-black px-4 py-2 text-xs uppercase tracking-wide"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
