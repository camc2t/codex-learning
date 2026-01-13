import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildStepStatusMap } from "@/lib/track";
import { SkipLessonButton } from "@/components/SkipLessonButton";

export const dynamic = "force-dynamic";

interface TrackPageProps {
  params: { trackId: string };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  const track = await prisma.track.findUnique({
    where: { id: params.trackId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          steps: {
            orderBy: { order: "asc" },
            include: {
              progress: { where: { userId: session.user.id } }
            }
          }
        }
      }
    }
  });

  if (!track) {
    redirect("/tracks");
  }

  const orderedSteps = track.modules.flatMap((module) => module.steps);
  const statusMap = buildStepStatusMap(orderedSteps);

  return (
    <div className="min-h-screen bg-paper">
      <div className="container">
        <Nav />
        <main className="py-16">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-calm">Track</p>
              <h1 className="text-3xl font-display">{track.title}</h1>
              <p className="mt-3 max-w-2xl text-sm text-black/70">
                {track.description}
              </p>
            </div>
          </div>
          <div className="mt-12 space-y-8">
            {track.modules.map((module) => (
              <section key={module.id} className="space-y-4">
                <div>
                  <h2 className="text-xl font-display">{module.title}</h2>
                  <p className="text-sm text-black/60">{module.description}</p>
                </div>
                <div className="grid gap-4">
                  {module.steps.map((step) => {
                    const status = statusMap.get(step.id) ?? "locked";

                    return (
                      <div
                        key={step.id}
                        className={`rounded-2xl border p-4 transition ${
                          status === "locked"
                            ? "pointer-events-none border-black/5 bg-black/5 text-black/40"
                            : "border-black/10 bg-white hover:border-black/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <Link
                              href={`/track/${track.id}/step/${step.id}`}
                              className="block"
                            >
                              <p className="text-sm font-semibold">{step.title}</p>
                              <p className="text-xs text-black/60">{step.goal}</p>
                            </Link>
                          </div>
                          <div className="flex items-center gap-3">
                            {step.type === "lesson" && status !== "completed" && (
                              <SkipLessonButton stepId={step.id} />
                            )}
                            <span className="text-xs uppercase tracking-[0.2em] text-calm">
                              {status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
