"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarkCompleteButton({
  stepId,
  trackId
}: {
  stepId: string;
  trackId: string;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const router = useRouter();

  async function markComplete() {
    setStatus("saving");
    await fetch("/api/progress/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId })
    });
    setStatus("done");
  }

  return (
    <div className="mt-6 flex items-center gap-3">
      <button
        type="button"
        className="rounded-full bg-ink px-5 py-2 text-xs uppercase tracking-wide text-white"
        onClick={markComplete}
        disabled={status !== "idle"}
      >
        {status === "saving" ? "Saving..." : "Mark lesson complete"}
      </button>
      {status === "done" && (
        <>
          <span className="text-xs uppercase tracking-wide text-calm">Completed</span>
          <button
            type="button"
            className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-wide"
            onClick={() => {
              router.replace(`/track/${trackId}`);
              router.refresh();
            }}
          >
            Back to track
          </button>
        </>
      )}
    </div>
  );
}
