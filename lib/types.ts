export type ExerciseContent = {
  id: string;
  title: string;
  prompt: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
};

export type CheckpointContent = {
  id: string;
  title: string;
  instructions: string;
  command: string;
  expectedPatterns: string[];
};

export type DeployContent = {
  id: string;
  title: string;
  checklist: string[];
  submitLabel: string;
};
