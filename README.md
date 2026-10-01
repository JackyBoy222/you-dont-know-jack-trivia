# You Don’t Know Jack Trivia — Phase 1

A mobile-first progressive web app for Jacky Boy’s recurring live trivia show at LeCabaret in New Orleans. Phase 1 provides a public event hub, recaps, team statistics, competitive and participation leaderboards, achievements, and a development-ready host dashboard.

All bundled records are clearly marked demo data. They make every screen testable but are not asserted as verified show history.

## Features

- Homepage with the next regular trivia date, live countdown, venue, theme, JackPot, announcement, recent winner, and ranking preview
- Automatically generated first and second Wednesdays plus support for special, skipped, canceled, postponed, and replacement events
- Upcoming event calendar links and status labels
- Past-event recaps with scores, bonuses, awards, attendance, funniest answers, and JackPot outcome
- Winners history, championship counts, awards, and JackPot winners
- Competitive leaderboards separated from participation statistics
- Team profiles with players, results, achievements, bonus accuracy, and JackPot history
- Protected development host dashboard with event, team, score, and recap workflows
- Fast score entry with automatic totals, bonus values, Double Score, perks, adjustments, and JackPot qualification
- PWA manifest and installable icon
- PostgreSQL/Supabase schema with row-level security foundations and Phase 2-ready live-game tables
- Loading-safe server data service and mock-data fallback architecture

## Technology

Next.js 16, React 19, strict TypeScript, Tailwind CSS, Supabase client libraries, PostgreSQL-compatible SQL, Zod, date-fns, Lucide icons, and Vitest.

## Required software

- Node.js 22.23.1
- npm 10.9.8
- Optional: a Supabase project and Supabase CLI

## Install and run locally

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The app runs with demo data when Supabase variables are blank. Starting the dev server automatically clears generated Next.js and TypeScript caches, preventing stale outputs after a move, branch switch, or dependency reset.

## Environment variables

`.env.example` documents all variables. Never commit `.env.local`.

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: server-only administrative key; never expose this in browser code
- `NEXT_PUBLIC_USE_DEMO_DATA=true`: explicitly selects the local mock service
- `NEXT_PUBLIC_USE_DEMO_DATA=false`: loads the saved host-console state from Supabase, with a safe demo-data fallback until state has been saved

The app uses the mock service by default. With Supabase credentials configured and `NEXT_PUBLIC_USE_DEMO_DATA=false`, public pages load the persisted host-console state from `app_settings`.

## Host login

With `NEXT_PUBLIC_USE_DEMO_DATA=true`, `/admin` runs locally without authentication and keeps edits in the browser session. With `NEXT_PUBLIC_USE_DEMO_DATA=false`, `/admin` uses Supabase email/password authentication and only permits users whose Auth UUID appears in `admin_users`.

## Supabase setup and migration

1. Create a Supabase project.
2. Copy the project URL and anon key into `.env.local`.
3. Install and authenticate the Supabase CLI.
4. Link the project and apply the migration:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

The ordered migrations in `supabase/migrations` create the core trivia schema, booking/contact inquiries, persisted host-console state, venues, admin authorization, and row-level security. Supabase Auth is referenced by `admin_users`.

Before using the production host console, create the host in Supabase Auth and insert that user’s UUID into `admin_users`. Keep the service-role key server-only.

## Quality commands

```bash
npm run verify
```

`npm run verify` runs type checking, linting, tests, and a production build. It is also enforced in CI, followed by a health check at `/api/health`.

Tests cover the first and second Wednesday, event status, totals, Double Score, bonus values, Panty Points, bribe limits, JackPot qualification, leaderboard ordering, team statistics, achievements, form validation, and demo loading.

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import it at Vercel and accept the detected Next.js settings.
3. Add the environment variables from `.env.example` in Project Settings → Environment Variables.
4. Use `NEXT_PUBLIC_USE_DEMO_DATA=false` after the migrations are applied and the host console has saved its initial state.
5. Deploy, then verify `/api/health`, `/book-jack`, `/contact`, and authenticated `/admin` access.

The same result can be created with `npx vercel` after authenticating the Vercel CLI.

## Troubleshooting

- **Blank or failed data:** verify `NEXT_PUBLIC_USE_DEMO_DATA=true`; restart the dev server after environment changes.
- **Port 3000 busy:** run `npm run dev -- --port 3001`.
- **Supabase migration fails at `auth.users`:** run the SQL inside a Supabase project, not plain PostgreSQL, or remove the `admin_users` foreign key for standalone PostgreSQL.
- **PWA install is unavailable:** use HTTPS or localhost, then refresh after the first successful load.
- **Stale generated output:** run `npm run clean`, then start again with `npm run dev`.

## Phase 2 (postponed)

Phase 2 will implement audience gameplay: game codes, live sessions, question delivery, answer submission, synchronized timers, automatic grading, host review, real-time leaderboards, Supabase Auth persistence, image upload/storage, and production admin authorization. The database already includes `game_sessions`, `questions`, and `answer_submissions`, so those features can be added without rebuilding the core model.
