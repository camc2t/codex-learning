import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { LessonRenderer } from "@/components/LessonRenderer";
import { ExercisePlayer } from "@/components/ExercisePlayer";
import { CheckpointPlayer } from "@/components/CheckpointPlayer";
import { DeployPlayer } from "@/components/DeployPlayer";
import { PromptBuilder } from "@/components/PromptBuilder";
import { DiffReviewChecklist } from "@/components/DiffReviewChecklist";
import { StepTracker } from "@/components/StepTracker";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loadMdxContent, loadJsonContent } from "@/lib/content";
import type { CheckpointContent, DeployContent, ExerciseContent } from "@/lib/types";

interface StepPageProps {
  params: { trackId: string; stepId: string };
}

export default async function StepPage({ params }: StepPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  const step = await prisma.step.findUnique({
    where: { id: params.stepId },
    include: {
      module: {
        include: { track: true }
      },
      progress: { where: { userId: session.user.id } },
      promptHistory: {
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  });

  if (!step || step.module.trackId !== params.trackId) {
    redirect(`/track/${params.trackId}`);
  }

  const lessonContent = step.type === "lesson" ? await loadMdxContent(step.contentPath) : null;
  const exerciseContent =
    step.type === "exercise"
      ? await loadJsonContent<ExerciseContent>(step.contentPath)
      : null;
  const checkpointContent =
    step.type === "checkpoint"
      ? await loadJsonContent<CheckpointContent>(step.contentPath)
      : null;
  const deployContent =
    step.type === "deploy" ? await loadJsonContent<DeployContent>(step.contentPath) : null;

  return (
    <div className="min-h-screen bg-paper">
      <div className="container">
        <Nav />
        <StepTracker stepId={step.id} />
        <main className="py-16">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <Link href={`/track/${params.trackId}`} className="text-sm hover:underline">
                ← Back to track
              </Link>
              <h1 className="mt-3 text-3xl font-display">{step.title}</h1>
              <p className="mt-2 text-sm text-black/70">{step.goal}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-wide text-calm">
              {step.type}
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-6">
              <div className="rounded-3xl border border-black/10 bg-white p-6">
                <h2 className="text-xl font-display">Context</h2>
                <p className="mt-3 text-sm text-black/70">{step.context}</p>
                <div className="mt-6">
                  <p className="text-sm font-semibold">Do this</p>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-black/70">
                    {step.instructions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                {step.type === "lesson" && (
                  <MarkCompleteButton stepId={step.id} trackId={params.trackId} />
                )}
              </div>

              {step.type === "lesson" && lessonContent && (
                <div className="rounded-3xl border border-black/10 bg-white p-6">
                  <LessonRenderer content={lessonContent.content} />
                </div>
              )}

              {step.type === "exercise" && exerciseContent && (
                <div className="rounded-3xl border border-black/10 bg-white p-6">
                  <h2 className="text-xl font-display">Exercise</h2>
                  <p className="mt-3 text-sm text-black/70">{exerciseContent.prompt}</p>
                  <div className="mt-6">
                    <ExercisePlayer
                      exercise={exerciseContent}
                      stepId={step.id}
                      trackId={params.trackId}
                    />
                  </div>
                </div>
              )}

              {step.type === "checkpoint" && checkpointContent && (
                <div className="rounded-3xl border border-black/10 bg-white p-6">
                  <h2 className="text-xl font-display">Checkpoint</h2>
                  <CheckpointPlayer
                    checkpoint={checkpointContent}
                    stepId={step.id}
                    trackId={params.trackId}
                  />
                </div>
              )}

              {step.type === "deploy" && deployContent && (
                <div className="rounded-3xl border border-black/10 bg-white p-6">
                  <h2 className="text-xl font-display">Deploy</h2>
                  <DeployPlayer deploy={deployContent} stepId={step.id} />
                </div>
              )}
            </section>

            <aside className="space-y-6">
              <PromptBuilder stepId={step.id} />
              <DiffReviewChecklist
                stepId={step.id}
                defaultChecked={step.progress[0]?.diffReviewCompleted ?? false}
              />
              <div className="rounded-3xl border border-black/10 bg-white p-6">
                <h3 className="text-lg font-display">Codex Mode</h3>
                <div className="mt-3 text-sm text-black/70">
                  <p className="font-semibold">Example prompt</p>
                  <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-black/90 p-4 text-xs text-white">
                    {step.codexPrompt}
                  </pre>
                  <p className="mt-4 font-semibold">How to verify</p>
                  <p className="mt-2 text-xs text-black/70">{step.verifyInstructions}</p>
                </div>
              </div>

              {step.promptHistory.length > 0 && (
                <div className="rounded-3xl border border-black/10 bg-white p-6">
                  <h3 className="text-lg font-display">Prompt history</h3>
                  <ul className="mt-3 space-y-3 text-xs text-black/70">
                    {step.promptHistory.map((item) => (
                      <li key={item.id} className="rounded-2xl bg-black/5 p-3">
                        <pre className="whitespace-pre-wrap">{item.prompt}</pre>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
