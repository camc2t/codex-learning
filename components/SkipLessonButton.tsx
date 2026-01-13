"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SkipLessonButton({ stepId }: { stepId: string }) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function skipLesson(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setSaving(true);
    await fetch("/api/progress/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId })
    });
    router.refresh();
  }

  return (
    <button
      type="button"
      className="rounded-full border border-black/20 px-3 py-1 text-[10px] uppercase tracking-wide"
      onClick={skipLesson}
      disabled={saving}
    >
      {saving ? "Skipping..." : "Skip lesson"}
    </button>
  );
}
