import { prisma } from "../lib/db";

async function main() {
  await prisma.promptHistory.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.step.deleteMany();
  await prisma.module.deleteMany();
  await prisma.track.deleteMany();

  const track = await prisma.track.create({
    data: {
      title: "Track A: Ship a working web app",
      description:
        "From zero to a deployed CRUD app using a repeatable Codex workflow.",
      level: "Beginner",
      order: 1,
      modules: {
        create: [
          {
            title: "Foundations",
            description: "Learn the Codex loop and validate your setup.",
            order: 1,
            steps: {
              create: [
                {
                  title: "The Codex workflow",
                  goal: "Understand the plan → prompt → review → verify loop.",
                  context:
                    "Codex is most powerful when you guide it with clear objectives and verification. This step sets the mindset.",
                  instructions: [
                    "Read the lesson and summarize the workflow in your own words.",
                    "Use the Prompt Builder to draft your first prompt."
                  ],
                  type: "lesson",
                  contentPath: "lessons/01-codex-workflow.mdx",
                  codexPrompt:
                    "Objective: Summarize the Codex workflow loop in 3 bullet points.\nConstraints: Beginner-friendly, no jargon.\nFiles to touch: none\nAcceptance criteria: Mentions plan, prompt, review, verify, deploy.\nCommands to run: none",
                  verifyInstructions: "Confirm your summary hits every step in the loop.",
                  order: 1
                },
                {
                  title: "Prompt basics exercise",
                  goal: "Practice matching output requirements exactly.",
                  context:
                    "Before prompting Codex, you need to be comfortable verifying outputs. This exercise builds that habit.",
                  instructions: [
                    "Complete the exercise in the editor.",
                    "Run the check until it passes."
                  ],
                  type: "exercise",
                  contentPath: "exercises/02-prompt-basics.json",
                  codexPrompt:
                    "Objective: Write JS that prints 'Codex ready'.\nConstraints: Use console.log once.\nFiles to touch: none\nAcceptance criteria: Output is exactly 'Codex ready'.\nCommands to run: Run the exercise check.",
                  verifyInstructions: "The exercise checker must show Pass.",
                  order: 2
                },
                {
                  title: "Prompt Builder mastery",
                  goal: "Build strong prompts using structured inputs and gold examples.",
                  context:
                    "Use the Prompt Builder to turn goals into precise Codex requests. Compare your prompts to gold standards to learn what good looks like.",
                  instructions: [
                    "Work through the three prompt exercises in the lesson.",
                    "Compare your prompt output to the gold prompt."
                  ],
                  type: "lesson",
                  contentPath: "lessons/02-prompt-builder.mdx",
                  codexPrompt:
                    "Objective: Create a gold-standard prompt for a small UI change.\nConstraints: Include files to touch, acceptance criteria, and verification.\nFiles to touch: none\nAcceptance criteria: Prompt covers objective, constraints, files, acceptance, commands.\nCommands to run: none",
                  verifyInstructions: "Confirm your prompt matches the gold example structure.",
                  order: 3
                },
                {
                  title: "Environment checkpoint",
                  goal: "Confirm your local tooling is installed.",
                  context:
                    "Before building the app, confirm Node.js is available on your machine.",
                  instructions: [
                    "Run the command in your terminal.",
                    "Paste the output in the checkpoint verifier."
                  ],
                  type: "checkpoint",
                  contentPath: "checkpoints/03-environment.json",
                  codexPrompt:
                    "Objective: Verify Node is installed.\nConstraints: Use node -v.\nFiles to touch: none\nAcceptance criteria: Version prints.\nCommands to run: node -v",
                  verifyInstructions: "Your output must include a version string like v20.x.x.",
                  order: 4
                }
              ]
            }
          },
          {
            title: "Build the UI",
            description: "Create your first Next.js pages.",
            order: 2,
            steps: {
              create: [
                {
                  title: "Next.js App Router overview",
                  goal: "Learn how Next.js organizes pages and APIs.",
                  context:
                    "You will use the App Router to build the UI and backend. This lesson shows where everything lives.",
                  instructions: [
                    "Read the lesson and open the app folder structure.",
                    "List two routes you will need for the CRUD app."
                  ],
                  type: "lesson",
                  contentPath: "lessons/04-nextjs-overview.mdx",
                  codexPrompt:
                    "Objective: Explain where to place a new page and an API route in Next.js App Router.\nConstraints: 2 bullets max.\nFiles to touch: none\nAcceptance criteria: Mentions app/ and app/api.\nCommands to run: none",
                  verifyInstructions: "Your answer should mention app/ and app/api paths.",
                  order: 5
                },
                {
                  title: "Render a list exercise",
                  goal: "Practice simple state and output formatting.",
                  context:
                    "This exercise mirrors rendering lists in the UI later.",
                  instructions: [
                    "Complete the exercise in the editor.",
                    "Run the check until it passes."
                  ],
                  type: "exercise",
                  contentPath: "exercises/05-render-list.json",
                  codexPrompt:
                    "Objective: Create an array of lessons and print the count.\nConstraints: Use array length.\nFiles to touch: none\nAcceptance criteria: Output 'Lessons: 3'.\nCommands to run: Run the exercise check.",
                  verifyInstructions: "The checker should show Pass.",
                  order: 6
                },
                {
                  title: "Dev server checkpoint",
                  goal: "Run Next.js locally.",
                  context:
                    "Confirm your dev server runs before you start building pages.",
                  instructions: [
                    "Run the dev server command.",
                    "Paste the ready output into the checkpoint."
                  ],
                  type: "checkpoint",
                  contentPath: "checkpoints/06-dev-server.json",
                  codexPrompt:
                    "Objective: Start the Next.js dev server.\nConstraints: Use npm run dev.\nFiles to touch: none\nAcceptance criteria: Terminal shows Ready.\nCommands to run: npm run dev",
                  verifyInstructions: "Paste the line that includes Ready and localhost.",
                  order: 7
                }
              ]
            }
          },
          {
            title: "Data + Auth",
            description: "Add Prisma models and auth flow.",
            order: 3,
            steps: {
              create: [
                {
                  title: "Prisma + Postgres",
                  goal: "Understand Prisma migrations and data flow.",
                  context:
                    "We will model listings and bookings with Prisma and store progress.",
                  instructions: [
                    "Read the lesson.",
                    "List two models your capstone will need."
                  ],
                  type: "lesson",
                  contentPath: "lessons/07-prisma-basics.mdx",
                  codexPrompt:
                    "Objective: Suggest two Prisma models for a marketplace app.\nConstraints: Include required fields.\nFiles to touch: none\nAcceptance criteria: Mentions Listing and User.\nCommands to run: none",
                  verifyInstructions: "Ensure your models include required fields like title or price.",
                  order: 8
                },
                {
                  title: "CRUD logic exercise",
                  goal: "Practice create/update logic in code.",
                  context:
                    "This mirrors the create listing flow you will build later.",
                  instructions: [
                    "Finish the exercise code.",
                    "Run the check."
                  ],
                  type: "exercise",
                  contentPath: "exercises/08-crud-function.json",
                  codexPrompt:
                    "Objective: Append a listing and print all titles.\nConstraints: Use items.push and join.\nFiles to touch: none\nAcceptance criteria: Output 'Bike, Desk, Lamp'.\nCommands to run: Run the exercise check.",
                  verifyInstructions: "The checker should show Pass.",
                  order: 9
                },
                {
                  title: "Prisma migration checkpoint",
                  goal: "Run the first migration for your capstone.",
                  context:
                    "You will use Prisma migrations to keep schema changes safe.",
                  instructions: [
                    "Create the schema and run the migration command.",
                    "Paste the output that confirms it applied."
                  ],
                  type: "checkpoint",
                  contentPath: "checkpoints/09-prisma-migrate.json",
                  codexPrompt:
                    "Objective: Run the initial Prisma migration.\nConstraints: Use npx prisma migrate dev --name init.\nFiles to touch: prisma/schema.prisma\nAcceptance criteria: Migration applied successfully.\nCommands to run: npx prisma migrate dev --name init",
                  verifyInstructions: "Your output should include Applied or migrations.",
                  order: 10
                }
              ]
            }
          },
          {
            title: "Capstone + Deploy",
            description: "Build and ship a marketplace app.",
            order: 4,
            steps: {
              create: [
                {
                  title: "Capstone build plan",
                  goal: "Plan the marketplace CRUD flow and auth.",
                  context:
                    "Define the pages, API routes, and data models before you build.",
                  instructions: [
                    "Draft a plan for listings CRUD + auth.",
                    "Use the Prompt Builder to ask Codex for the first implementation step."
                  ],
                  type: "lesson",
                  contentPath: "lessons/10-capstone.mdx",
                  codexPrompt:
                    "Objective: Build a marketplace app with listings CRUD and auth.\nConstraints: Next.js App Router, Prisma, NextAuth.\nFiles to touch: app/, prisma/schema.prisma\nAcceptance criteria: Users can sign in, create/edit/delete listings, browse listings.\nCommands to run: npm run dev",
                  verifyInstructions: "Confirm login + CRUD works in the browser.",
                  order: 11
                },
                {
                  title: "Production build checkpoint",
                  goal: "Prove the app builds cleanly.",
                  context:
                    "Before deploying, make sure the build succeeds.",
                  instructions: [
                    "Run the build command.",
                    "Paste the output that confirms compilation."
                  ],
                  type: "checkpoint",
                  contentPath: "checkpoints/11-build.json",
                  codexPrompt:
                    "Objective: Run a production build.\nConstraints: Use npm run build.\nFiles to touch: none\nAcceptance criteria: Build succeeds.\nCommands to run: npm run build",
                  verifyInstructions: "Look for 'Compiled successfully' or a routes table.",
                  order: 12
                },
                {
                  title: "Deploy to Vercel",
                  goal: "Ship a live capstone URL.",
                  context:
                    "Deployment is the final step in the workflow. Add env vars and verify live behavior.",
                  instructions: [
                    "Deploy to Vercel.",
                    "Paste your live URL to finish the track."
                  ],
                  type: "deploy",
                  contentPath: "checkpoints/12-deploy.json",
                  codexPrompt:
                    "Objective: Deploy the app to Vercel.\nConstraints: Set DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET.\nFiles to touch: vercel.json if needed.\nAcceptance criteria: Live URL works and auth succeeds.\nCommands to run: vercel deploy",
                  verifyInstructions: "Open the live URL and verify CRUD and auth.",
                  order: 13
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`Seeded track ${track.title}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
