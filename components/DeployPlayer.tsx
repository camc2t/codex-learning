"use client";

import { useState } from "react";
import posthog from "posthog-js";
import type { DeployContent } from "@/lib/types";

export function DeployPlayer({
  deploy,
  stepId
}: {
  deploy: DeployContent;
  stepId: string;
}) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function submit() {
    setStatus("saving");
    const response = await fetch("/api/deploy/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, stepId })
    });
    if (response.ok) {
      posthog.capture("deploy_submitted", { stepId });
    }
    setStatus(response.ok ? "done" : "error");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <h3 className="text-lg font-display">Deployment checklist</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-black/70">
          {deploy.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <label className="text-sm font-semibold">Paste your live URL</label>
        <input
          className="mt-3 w-full rounded-full border border-black/10 px-4 py-2 text-sm"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://your-app.vercel.app"
        />
        <button
          type="button"
          className="mt-4 rounded-full bg-ink px-5 py-2 text-xs uppercase tracking-wide text-white"
          onClick={submit}
          disabled={status === "saving" || url.length < 8}
        >
          {status === "saving" ? "Saving..." : deploy.submitLabel}
        </button>
        {status === "done" && (
          <p className="mt-2 text-xs uppercase tracking-wide text-calm">
            Saved! Step completed.
          </p>
        )}
        {status === "error" && (
          <p className="mt-2 text-xs uppercase tracking-wide text-accent">
            Something went wrong.
          </p>
        )}
      </div>
    </div>
  );
}
