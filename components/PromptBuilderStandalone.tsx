"use client";

import { useMemo, useState } from "react";

type PromptInputs = {
  task: string;
  context: string;
  constraints: string;
  files: string;
  acceptance: string;
  verification: string;
};

const emptyInputs: PromptInputs = {
  task: "",
  context: "",
  constraints: "",
  files: "",
  acceptance: "",
  verification: ""
};

const buildPrompt = (inputs: PromptInputs, style: "structured" | "surgical") => {
  const task = inputs.task.trim() || "Describe the change you want.";
  const context = inputs.context.trim() || "Relevant background and current behavior.";
  const constraints = inputs.constraints.trim() || "Stack, scope limits, do-not-change items.";
  const files = inputs.files.trim() || "List files or directories to edit.";
  const acceptance = inputs.acceptance.trim() || "Define observable outcomes.";
  const verification = inputs.verification.trim() || "Commands or checks to run.";

  if (style === "structured") {
    return [
      `Objective:\n${task}`,
      `Context:\n${context}`,
      `Constraints:\n${constraints}`,
      `Files to touch:\n${files}`,
      `Acceptance criteria:\n${acceptance}`,
      `Commands to run:\n${verification}`
    ].join("\n\n");
  }

  return [
    `You are modifying an existing codebase. Task: ${task}`,
    `Context: ${context}`,
    `Constraints: ${constraints}`,
    `Files: ${files}`,
    `Definition of done: ${acceptance}`,
    `Verification: ${verification}`,
    "Please return a concise plan and the exact code changes only."
  ].join("\n");
};

export function PromptBuilderStandalone() {
  const [inputs, setInputs] = useState<PromptInputs>(emptyInputs);

  const structuredPrompt = useMemo(
    () => buildPrompt(inputs, "structured"),
    [inputs]
  );
  const surgicalPrompt = useMemo(
    () => buildPrompt(inputs, "surgical"),
    [inputs]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-lift">
        <h2 className="text-2xl font-display">Prompt Builder</h2>
        <p className="mt-2 text-sm text-black/70">
          Start with vague inputs and get two clearer prompts you can paste into
          ChatGPT or Codex.
        </p>
        <div className="mt-6 grid gap-4">
          {(
            [
              ["task", "Task (vague is okay)", 3],
              ["context", "Context", 3],
              ["constraints", "Constraints", 3],
              ["files", "Files to touch", 2],
              ["acceptance", "Acceptance criteria", 3],
              ["verification", "Verification", 2]
            ] as const
          ).map(([key, label, rows]) => (
            <label key={key} className="text-sm font-semibold">
              {label}
              <textarea
                className="mt-2 w-full rounded-2xl border border-black/10 p-3 text-xs"
                rows={rows}
                value={inputs[key]}
                onChange={(event) =>
                  setInputs((prev) => ({ ...prev, [key]: event.target.value }))
                }
              />
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <h3 className="text-lg font-display">Prompt A: Structured spec</h3>
          <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-black/90 p-4 text-xs text-white">
            {structuredPrompt}
          </pre>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <h3 className="text-lg font-display">Prompt B: Surgical instructions</h3>
          <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-black/90 p-4 text-xs text-white">
            {surgicalPrompt}
          </pre>
        </div>
      </div>
    </div>
  );
}
