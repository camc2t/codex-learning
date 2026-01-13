"use client";

import { useEffect } from "react";

export function StepTracker({ stepId }: { stepId: string }) {
  useEffect(() => {
    fetch("/api/progress/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId })
    });
  }, [stepId]);

  return null;
}
