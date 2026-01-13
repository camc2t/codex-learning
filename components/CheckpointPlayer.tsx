"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CheckpointContent } from "@/lib/types";

export function CheckpointPlayer({
  checkpoint,
  stepId,
  trackId
}: {
  checkpoint: CheckpointContent;
  stepId: string;
  trackId: string;
}) {
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "pass" | "fail" | "checking">("idle");
  const [details, setDetails] = useState<string | null>(null);
  const router = useRouter();

  async function verify() {
    setStatus("checking");
    const response = await fetch("/api/checkpoint/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ output, expectedPatterns: checkpoint.expectedPatterns, stepId })
    });
    const payload = await response.json();
    setStatus(payload.pass ? "pass" : "fail");
    setDetails(payload.message);
  }

  async function skipCheckpoint() {
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
      <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm">
        <p className="font-semibold">Run this command locally</p>
        <pre className="mt-2 text-xs">{checkpoint.command}</pre>
        <p className="mt-4 text-black/70">{checkpoint.instructions}</p>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <label className="text-sm font-semibold">Paste your output</label>
        <textarea
          className="mt-3 w-full rounded-2xl border border-black/10 p-3 text-xs"
          rows={6}
          value={output}
          onChange={(event) => setOutput(event.target.value)}
        />
        <button
          type="button"
          className="mt-4 rounded-full bg-ink px-5 py-2 text-xs uppercase tracking-wide text-white"
          onClick={verify}
          disabled={status === "checking"}
        >
          {status === "checking" ? "Checking..." : "Verify checkpoint"}
        </button>
        <button
          type="button"
          className="mt-3 rounded-full border border-black/20 px-5 py-2 text-xs uppercase tracking-wide"
          onClick={skipCheckpoint}
        >
          Skip checkpoint
        </button>
        {status !== "idle" && (
          <p
            className={`mt-3 text-xs uppercase tracking-wide ${
              status === "pass" ? "text-calm" : "text-accent"
            }`}
          >
            {status === "pass" ? "Passed" : "Failed"}
          </p>
        )}
        {details && <p className="mt-2 text-xs text-black/70">{details}</p>}
      </div>
    </div>
  );
}
