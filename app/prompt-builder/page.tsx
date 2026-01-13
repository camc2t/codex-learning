import { Nav } from "@/components/Nav";
import { PromptBuilderStandalone } from "@/components/PromptBuilderStandalone";

export default function PromptBuilderPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="container">
        <Nav />
        <main className="py-16">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-calm">
              Prompt Studio
            </p>
            <h1 className="mt-3 text-3xl font-display">
              Turn vague tasks into precise prompts.
            </h1>
            <p className="mt-3 text-sm text-black/70">
              Drop in incomplete notes and get two clean prompts: one structured
              spec and one surgical, step-by-step command.
            </p>
          </div>
          <div className="mt-10">
            <PromptBuilderStandalone />
          </div>
        </main>
      </div>
    </div>
  );
}
