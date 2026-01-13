import Link from "next/link";
import { Nav } from "@/components/Nav";
import { prisma } from "@/lib/db";

export default async function TracksPage() {
  const tracks = await prisma.track.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <div className="min-h-screen bg-paper">
      <div className="container">
        <Nav />
        <main className="py-16">
          <h1 className="text-3xl font-display">Tracks</h1>
          <p className="mt-2 text-black/70">
            Choose a guided path and ship a real app.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {tracks.map((track) => (
              <Link
                key={track.id}
                href={`/track/${track.id}`}
                className="rounded-3xl border border-black/10 bg-white p-6 shadow-lift"
              >
                <h2 className="text-xl font-display">{track.title}</h2>
                <p className="mt-3 text-sm text-black/70">{track.description}</p>
                <div className="mt-6 text-xs uppercase tracking-[0.2em] text-calm">
                  {track.level}
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
