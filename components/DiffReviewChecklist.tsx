"use client";

import { useState } from "react";

export function DiffReviewChecklist({
  stepId,
  defaultChecked
}: {
  stepId: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  async function toggle(value: boolean) {
    setChecked(value);
    await fetch("/api/progress/diff-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId, checked: value })
    });
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <h3 className="text-xl font-display">Diff Review Basics</h3>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-black/70">
        <li>Scan for unexpected file edits and missing files.</li>
        <li>Confirm logic matches acceptance criteria.</li>
        <li>Look for error handling and edge cases.</li>
        <li>Check for config changes and secrets.</li>
        <li>Run checks before merging or deploying.</li>
      </ul>
      <label className="mt-4 flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => toggle(event.target.checked)}
          className="h-4 w-4"
        />
        I reviewed the diff with the checklist.
      </label>
    </div>
  );
}
