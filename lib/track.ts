import type { Progress, Step } from "@prisma/client";

export function buildStepStatusMap(
  steps: Array<Step & { progress?: Progress[] }>
) {
  const statusMap = new Map<string, string>();

  steps.forEach((step, index) => {
    const currentProgress = step.progress?.[0];
    if (currentProgress?.status === "completed") {
      statusMap.set(step.id, "completed");
      return;
    }
    if (index === 0) {
      statusMap.set(step.id, currentProgress ? "in_progress" : "available");
      return;
    }
    const previousStep = steps[index - 1];
    const previousCompleted = previousStep?.progress?.some(
      (item) => item.status === "completed"
    );
    if (!previousCompleted) {
      statusMap.set(step.id, "locked");
      return;
    }
    statusMap.set(step.id, currentProgress ? "in_progress" : "available");
  });

  return statusMap;
}
