"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import type { ExerciseContent } from "@/lib/types";

export function ExercisePlayer({
  exercise,
  stepId,
  trackId
}: {
  exercise: ExerciseContent;
  stepId: string;
  trackId: string;
}) {
  const [code, setCode] = useState(exercise.starterCode);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "pass" | "fail">("idle");
  const router = useRouter();

  async function runCheck() {
    setStatus("running");
    const response = await fetch("/api/exercise/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, expectedOutput: exercise.expectedOutput, stepId })
    });
    const payload = await response.json();
    setResult(payload.output);
    setStatus(payload.pass ? "pass" : "fail");
  }

  async function skipExercise() {
    await fetch("/api/progress/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId })
    });
    router.replace(`/track/${trackId}`);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-white">
        <Editor
          height="320px"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="rounded-full bg-ink px-5 py-2 text-xs uppercase tracking-wide text-white"
          onClick={runCheck}
          disabled={status === "running"}
        >
          {status === "running" ? "Running..." : "Run check"}
        </button>
        <button
          type="button"
          className="rounded-full border border-black/20 px-5 py-2 text-xs uppercase tracking-wide"
          onClick={skipExercise}
        >
          Skip exercise
        </button>
        {status !== "idle" && (
          <span
            className={`text-xs uppercase tracking-wide ${
              status === "pass" ? "text-calm" : "text-accent"
            }`}
          >
            {status === "pass" ? "Pass" : "Needs work"}
          </span>
        )}
      </div>
      <div className="rounded-2xl bg-black/5 p-4 text-xs text-black/70">
        <p className="font-semibold">Output</p>
        <pre className="mt-2 whitespace-pre-wrap text-xs text-black/80">
          {result ?? "Run the check to see console output."}
        </pre>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm">
        <p className="font-semibold">Hints</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-black/70">
          {exercise.hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
