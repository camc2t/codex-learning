import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  const tracks = await prisma.track.findMany({
    orderBy: { order: "asc" },
    include: {
      modules: {
        include: {
          steps: {
            orderBy: { order: "asc" },
            include: {
              progress: {
                where: { userId: session.user.id }
              }
            }
          }
        }
      }
    }
  });

  return (
    <div className="min-h-screen bg-paper">
      <div className="container">
        <Nav />
        <main className="py-16">
          <h1 className="text-3xl font-display">Your dashboard</h1>
          <p className="mt-2 text-black/70">
            Track your progress and keep moving forward.
          </p>
          <div className="mt-10 space-y-8">
            {tracks.map((track) => {
              const totalSteps = track.modules.flatMap((mod) => mod.steps).length;
              const completedSteps = track.modules
                .flatMap((mod) => mod.steps)
                .filter((step) => step.progress.some((item) => item.status === "completed"))
                .length;

              return (
                <div
                  key={track.id}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-display">{track.title}</h2>
                      <p className="text-sm text-black/60">{track.description}</p>
                    </div>
                    <Link
                      href={`/track/${track.id}`}
                      className="rounded-full border border-black/20 px-5 py-2 text-xs uppercase tracking-wide"
                    >
                      Continue
                    </Link>
                  </div>
                  <div className="mt-4 text-sm text-black/70">
                    Progress: {completedSteps} / {totalSteps} steps
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-black/10">
                    <div
                      className="h-2 rounded-full bg-accent"
                      style={{ width: `${(completedSteps / Math.max(totalSteps, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
