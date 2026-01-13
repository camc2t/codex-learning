"use client";

import { useMemo, useState } from "react";

type PromptInputs = {
  task: string;
  context: string;
  acceptance: string;
};

const emptyInputs: PromptInputs = {
  task: "",
  context: "",
  acceptance: ""
};

const buildPrompt = (inputs: PromptInputs, style: "structured" | "surgical") => {
  const task = inputs.task.trim() || "Describe the change you want.";
  const context = inputs.context.trim() || "Relevant background and current behavior.";
  const acceptance = inputs.acceptance.trim() || "Define observable outcomes.";

  if (style === "structured") {
    return [
      "You are the implementation agent. Follow instructions exactly.",
      `Objective:\n${task}`,
      `Context:\n${context}`,
      `Acceptance criteria:\n${acceptance}`,
      "Rules:\n- Keep scope tight.\n- Follow existing patterns and style.\n- Do not change unrelated files.\n- If anything is ambiguous, ask a targeted question before coding."
    ].join("\n\n");
  }

  return [
    "Execute this change precisely and return only what is asked.",
    `Task: ${task}`,
    `Context: ${context}`,
    `Definition of done: ${acceptance}`,
    "Output format:\n1) Short plan (2-5 bullets)\n2) Exact code diff only\n3) Verification steps"
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
              ["acceptance", "Acceptance criteria", 3]
            ] as const
          ).map(([key, label, rows]) => (
            <label key={key} className="text-sm font-semibold">
              {label}
              {key === "task" && (
                <p className="mt-1 text-xs font-normal text-black/60">
                  In one sentence, what do you want ChatGPT to do?
                </p>
              )}
              {key === "context" && (
                <p className="mt-1 text-xs font-normal text-black/60">
                  What background or details does it need to know?
                </p>
              )}
              {key === "acceptance" && (
                <p className="mt-1 text-xs font-normal text-black/60">
                  What should the response include so you know it’s right?
                </p>
              )}
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
