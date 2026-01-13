"use client";

import { useMemo, useState } from "react";
import posthog from "posthog-js";

const lintPrompt = (fields: Record<string, string>) => {
  const warnings: string[] = [];
  if (!fields.objective.trim()) {
    warnings.push("Add a clear objective.");
  }
  if (!fields.acceptance.trim()) {
    warnings.push("Define acceptance criteria to avoid vague scope.");
  }
  if (!fields.constraints.trim()) {
    warnings.push("List constraints (stack, files, limits)." );
  }
  if (!fields.verify.trim()) {
    warnings.push("Include verification commands or checks.");
  }
  return warnings;
};

export function PromptBuilder({ stepId }: { stepId: string }) {
  const [fields, setFields] = useState({
    objective: "",
    constraints: "",
    files: "",
    acceptance: "",
    verify: ""
  });
  const [saved, setSaved] = useState(false);

  const prompt = useMemo(() => {
    return [
      `Objective:\n${fields.objective}`,
      `Constraints:\n${fields.constraints}`,
      `Files to touch:\n${fields.files}`,
      `Acceptance criteria:\n${fields.acceptance}`,
      `Commands to run:\n${fields.verify}`
    ].join("\n\n");
  }, [fields]);

  const warnings = lintPrompt(fields);

  async function savePrompt() {
    await fetch("/api/prompt/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId, prompt })
    });
    posthog.capture("prompt_saved", { stepId });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <h3 className="text-xl font-display">Codex Prompt Builder</h3>
      <p className="mt-2 text-sm text-black/70">
        Fill in each field to generate a crisp, verifiable Codex prompt.
      </p>
      <div className="mt-6 grid gap-4">
        {(
          [
            ["objective", "Objective"],
            ["constraints", "Constraints"],
            ["files", "Files to touch"],
            ["acceptance", "Acceptance criteria"],
            ["verify", "Commands to run"]
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm font-semibold">
            {label}
            <textarea
              className="mt-2 w-full rounded-2xl border border-black/10 p-3 text-xs"
              rows={3}
              value={fields[key]}
              onChange={(event) =>
                setFields((prev) => ({ ...prev, [key]: event.target.value }))
              }
            />
          </label>
        ))}
      </div>
      <div className="mt-4">
        {warnings.length > 0 ? (
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-3 text-xs text-accent">
            {warnings.join(" ")}
          </div>
        ) : (
          <div className="rounded-2xl border border-calm/20 bg-calm/5 p-3 text-xs text-calm">
            Prompt quality looks solid.
          </div>
        )}
      </div>
      <div className="mt-4">
        <label className="text-sm font-semibold">Generated prompt</label>
        <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-black/90 p-4 text-xs text-white">
          {prompt}
        </pre>
        <button
          type="button"
          className="mt-4 rounded-full bg-ink px-5 py-2 text-xs uppercase tracking-wide text-white"
          onClick={savePrompt}
        >
          Save prompt
        </button>
        {saved && (
          <span className="ml-3 text-xs uppercase tracking-wide text-calm">
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
