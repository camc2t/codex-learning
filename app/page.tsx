import Link from "next/link";
import { Nav } from "@/components/Nav";

export default async function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="container">
        <Nav />
        <main className="grid gap-16 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-calm">
              Guided Codex workflow
            </p>
            <h1 className="text-4xl font-display leading-tight md:text-5xl">
              Ship your first app with a repeatable Codex workflow.
            </h1>
            <p className="text-lg text-black/70">
              Codex Path turns beginners into builders. Follow a step-by-step track,
              generate strong prompts, review diffs like a pro, and deploy a real app
              to Vercel.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/tracks"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lift"
              >
                Start Track A
              </Link>
              <Link
                href="/tracks"
                className="rounded-full border border-black/20 px-6 py-3 text-sm"
              >
                Preview Curriculum
              </Link>
            </div>
          </section>
          <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-lift">
            <h2 className="text-2xl font-display">Your outcome</h2>
            <ul className="mt-6 space-y-4 text-sm text-black/70">
              <li>✔ Deploy a full-stack CRUD app with auth</li>
              <li>✔ Learn a repeatable Codex workflow</li>
              <li>✔ Get objective checkpoints and verification</li>
              <li>✔ Build prompt-writing and diff review skills</li>
            </ul>
            <div className="mt-8 rounded-2xl bg-black/5 p-4 text-sm">
              <p className="font-semibold">Workflow loop</p>
              <p className="text-black/70">
                Plan → Prompt → Review Diff → Run Checks → Fix → Deploy
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
