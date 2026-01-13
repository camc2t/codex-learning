# Codex Path MVP

Interactive learning site that takes beginners from zero to a deployed app using a repeatable Codex workflow.

## Tech stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- NextAuth (GitHub provider)
- PostHog (basic events)
- MDX + JSON schemas for content

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy the example file and fill in values:

```bash
cp .env.local.example .env.local
```

Required values:
- `DATABASE_URL` (Postgres connection string)
- `NEXTAUTH_URL` (http://localhost:3000 for local)
- `NEXTAUTH_SECRET` (random string)
- `GITHUB_ID` + `GITHUB_SECRET` (GitHub OAuth app)

Optional:
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

### 3) Set up the database and seed content

```bash
npx prisma migrate dev --name init
npm run seed
```

### 4) Run the app

```bash
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm run start
```

## Deploying on Vercel

The repo includes `vercel.json` to run migrations during build. Ensure these env vars are set in Vercel:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your Vercel URL)
- `NEXTAUTH_SECRET`
- `GITHUB_ID`, `GITHUB_SECRET`

## Adding new tracks later

1. Add MDX lessons in `content/lessons` and JSON exercises/checkpoints in `content/exercises` or `content/checkpoints`.
2. Update `scripts/seed.ts` (or create a new seed script) to insert the track, modules, and steps.
3. Run `npm run seed` to load the new track.

## File tree (high level)

```
app/
  api/
  dashboard/
  track/
  tracks/
  signin/
components/
content/
  lessons/
  exercises/
  checkpoints/
lib/
prisma/
scripts/
styles/
```
