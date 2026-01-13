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

const normalize = (value: string) => value.toLowerCase();

const enrichInputs = (inputs: {
  task: string;
  context: string;
  acceptance: string;
}) => {
  const taskLower = normalize(inputs.task);
  let task = inputs.task;
  let context = inputs.context;
  let acceptance = inputs.acceptance;

  if (taskLower.includes("grocery") || taskLower.includes("meal")) {
    task = `Create a practical grocery list and meal plan based on this task: ${inputs.task}.`;
    context = [
      inputs.context || "Assume a busy household.",
      "Aim for simple, flavorful meals using common pantry items and produce.",
      "Include enough leftovers for easy lunches."
    ].join(" ");
    acceptance = acceptance || "List meals by day, include a grouped grocery list, and note leftovers.";
  } else if (taskLower.includes("email") || taskLower.includes("message")) {
    task = `Draft the message: ${inputs.task}.`;
    context = [
      inputs.context || "Assume a professional but friendly tone.",
      "Be clear, concise, and action-oriented."
    ].join(" ");
    acceptance = acceptance || "Include a clear subject (if email), a call-to-action, and a polite close.";
  } else if (taskLower.includes("outline") || taskLower.includes("blog") || taskLower.includes("write")) {
    task = `Create a compelling outline or draft for: ${inputs.task}.`;
    context = [
      inputs.context || "Assume a general audience unless specified.",
      "Make it engaging and easy to scan."
    ].join(" ");
    acceptance = acceptance || "Include a strong opener, clear sections, and a brief summary.";
  } else if (taskLower.includes("plan") || taskLower.includes("schedule") || taskLower.includes("itinerary")) {
    task = `Build a practical plan for: ${inputs.task}.`;
    context = [
      inputs.context || "Assume realistic time and energy constraints.",
      "Balance focus time with breaks."
    ].join(" ");
    acceptance = acceptance || "Provide a step-by-step plan with time estimates and priorities.";
  } else if (taskLower.includes("brainstorm") || taskLower.includes("ideas")) {
    task = `Generate creative, high-quality ideas for: ${inputs.task}.`;
    context = [
      inputs.context || "Aim for variety across themes.",
      "Include at least a few unexpected options."
    ].join(" ");
    acceptance = acceptance || "Provide 8-12 ideas with short explanations.";
  } else if (taskLower.includes("summary") || taskLower.includes("summarize")) {
    task = `Summarize this clearly: ${inputs.task}.`;
    context = [
      inputs.context || "Focus on the key points and implications.",
      "Keep the tone neutral."
    ].join(" ");
    acceptance = acceptance || "Provide a short summary plus 3 key bullets.";
  } else {
    task = inputs.task;
    context = inputs.context || "Add any relevant details or constraints.";
    acceptance = inputs.acceptance || "Specify what a good response must include.";
  }

  return { task, context, acceptance };
};

const buildPrompt = (inputs: PromptInputs, style: "structured" | "surgical") => {
  const task = inputs.task.trim() || "Describe the change you want.";
  const context = inputs.context.trim() || "Relevant background and current behavior.";
  const acceptance = inputs.acceptance.trim() || "Define observable outcomes.";
  const enriched = enrichInputs({ task, context, acceptance });

  if (style === "structured") {
    return [
      "You are the implementation agent. Follow instructions exactly.",
      `Objective:\n${enriched.task}`,
      `Context:\n${enriched.context}`,
      `Acceptance criteria:\n${enriched.acceptance}`,
      "Rules:\n- Keep scope tight.\n- Follow existing patterns and style.\n- Do not change unrelated files.\n- If anything is ambiguous, ask a targeted question before coding."
    ].join("\n\n");
  }

  return [
    "Execute this change precisely and return only what is asked.",
    `Task: ${enriched.task}`,
    `Context: ${enriched.context}`,
    `Definition of done: ${enriched.acceptance}`,
    "Output format:\n1) Short plan (2-5 bullets)\n2) Exact code diff only\n3) Verification steps"
  ].join("\n");
};

export function PromptBuilderStandalone() {
  const [inputs, setInputs] = useState<PromptInputs>(emptyInputs);
  const [showPrompts, setShowPrompts] = useState(false);
  const [copied, setCopied] = useState<"structured" | "surgical" | null>(null);
  const [structuredDraft, setStructuredDraft] = useState("");
  const [surgicalDraft, setSurgicalDraft] = useState("");
  const [editing, setEditing] = useState<"structured" | "surgical" | null>(null);

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
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-ink px-5 py-2 text-xs uppercase tracking-wide text-white"
            onClick={() => {
              setStructuredDraft(structuredPrompt);
              setSurgicalDraft(surgicalPrompt);
              setShowPrompts(true);
            }}
          >
            Generate prompts
          </button>
          <button
            type="button"
            className="rounded-full border border-black/20 px-5 py-2 text-xs uppercase tracking-wide"
            onClick={() => {
              setInputs(emptyInputs);
              setShowPrompts(false);
              setStructuredDraft("");
              setSurgicalDraft("");
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {showPrompts ? (
          <>
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-display">Prompt A: Structured spec</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-black/20 px-3 py-1 text-[10px] uppercase tracking-wide"
                    onClick={() =>
                      setEditing(editing === "structured" ? null : "structured")
                    }
                  >
                    {editing === "structured" ? "Done" : "Edit"}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-black/20 px-3 py-1 text-[10px] uppercase tracking-wide"
                    onClick={() => {
                      navigator.clipboard.writeText(structuredDraft || structuredPrompt);
                      setCopied("structured");
                      setTimeout(() => setCopied(null), 1500);
                    }}
                  >
                    {copied === "structured" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              {editing === "structured" ? (
                <textarea
                  className="mt-3 h-56 w-full rounded-2xl bg-black/90 p-4 text-xs text-white"
                  value={structuredDraft || structuredPrompt}
                  onChange={(event) => setStructuredDraft(event.target.value)}
                />
              ) : (
                <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-black/90 p-4 text-xs text-white">
                  {structuredDraft || structuredPrompt}
                </pre>
              )}
            </div>
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-display">Prompt B: Surgical instructions</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-black/20 px-3 py-1 text-[10px] uppercase tracking-wide"
                    onClick={() =>
                      setEditing(editing === "surgical" ? null : "surgical")
                    }
                  >
                    {editing === "surgical" ? "Done" : "Edit"}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-black/20 px-3 py-1 text-[10px] uppercase tracking-wide"
                    onClick={() => {
                      navigator.clipboard.writeText(surgicalDraft || surgicalPrompt);
                      setCopied("surgical");
                      setTimeout(() => setCopied(null), 1500);
                    }}
                  >
                    {copied === "surgical" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              {editing === "surgical" ? (
                <textarea
                  className="mt-3 h-56 w-full rounded-2xl bg-black/90 p-4 text-xs text-white"
                  value={surgicalDraft || surgicalPrompt}
                  onChange={(event) => setSurgicalDraft(event.target.value)}
                />
              ) : (
                <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-black/90 p-4 text-xs text-white">
                  {surgicalDraft || surgicalPrompt}
                </pre>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-black/20 bg-white/70 p-6 text-sm text-black/60">
            Fill in the fields, then click “Generate prompts” to see the results.
          </div>
        )}
      </div>
    </div>
  );
}
