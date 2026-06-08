# MarketPulse AI

MarketPulse AI is a local-first admin dashboard for creating market ideas, turning them into Telegram-ready drafts, scheduling publications, and sending them through Telegram Bot API.

The app is prepared for Vercel deployment. Locally it uses SQLite at `data/marketpulse.db`; on Vercel it uses an auto-created SQLite database in `/tmp/marketpulse.db` so the app can boot and run without a writable project filesystem.

Important: Vercel `/tmp` storage is ephemeral. It is suitable for demo mode and smoke testing, not durable production data. For durable production storage, replace the SQLite layer with a managed database such as Vercel Postgres/Neon while keeping the repository API boundaries in `src/lib/*/*-repository.ts`.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui base components
- Drizzle ORM
- SQLite through `better-sqlite3`
- AI SDK with OpenAI provider
- Telegram Bot API
- Vercel deployment config

## Local Setup

Install dependencies:

```powershell
npm install
```

Create local environment file:

```powershell
Copy-Item .env.example .env.local
```

Generate and apply database migrations:

```powershell
npm.cmd run db:generate
npm.cmd run db:migrate
```

Start the development server:

```powershell
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

## Vercel Deployment

The repository includes `vercel.json` and `next.config.ts` settings for Vercel.

Vercel environment variables to add in Project Settings:

```env
DATABASE_URL=file:/tmp/marketpulse.db
MARKETPULSE_AUTO_MIGRATE=true
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHANNEL_ID=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

`DATABASE_URL` can be omitted on Vercel because the app defaults to `file:/tmp/marketpulse.db` when `VERCEL=1` is present. Keep `MARKETPULSE_AUTO_MIGRATE=true` only if you want to force auto-migrations outside Vercel.

After deployment, open:

```text
/settings
/api/system/status
```

These routes show whether SQLite, OpenAI, Telegram, and admin auth are configured.

## Environment Variables

`DATABASE_URL` controls the SQLite database path.

```env
DATABASE_URL=file:./data/marketpulse.db
```

`MARKETPULSE_AUTO_MIGRATE` can force automatic SQL migration execution at runtime. On Vercel, migrations run automatically because `VERCEL=1` is set by the platform.

```env
MARKETPULSE_AUTO_MIGRATE=false
```

OpenAI is optional. If `OPENAI_API_KEY` is missing or set to `replace_me_later`, the app uses mock/rule-based fallback behavior.

```env
OPENAI_API_KEY=replace_me_later
OPENAI_MODEL=gpt-4.1-mini
```

Telegram is optional. If the values are missing or set to `replace_me_later`, publishing is disabled and the API returns a configuration error.

```env
TELEGRAM_BOT_TOKEN=replace_me_later
TELEGRAM_CHANNEL_ID=replace_me_later
```

Admin auth is optional in local development. If both values are configured with real values, admin routes require login through `/login`.

```env
ADMIN_PASSWORD=replace_me_later
ADMIN_SESSION_SECRET=replace_me_later
```

Use a long random value for `ADMIN_SESSION_SECRET` when enabling auth.

## Main Workflow

1. Open `/ideas/new`.
2. Choose an asset and idea settings.
3. Generate the idea with AI or fallback mock data.
4. Run safety review.
5. Save the idea.
6. Open the saved idea and create a draft.
7. Schedule the draft as a publication.
8. Open the publication detail page and publish it to Telegram.

## Useful Routes

- `/dashboard` - overview
- `/assets` - tracked assets
- `/ideas` - market ideas
- `/drafts` - Telegram-ready drafts
- `/calendar` - scheduled publications
- `/publications` - sent and failed publication log
- `/settings` - integration status
- `/api/system/status` - machine-readable system status

## Checks

Run lint:

```powershell
npm.cmd run lint
```

Run production build:

```powershell
npm.cmd run build
```

Run a Vercel-like local build with auto migrations enabled:

```powershell
$env:MARKETPULSE_AUTO_MIGRATE="true"
npm.cmd run build
Remove-Item Env:\MARKETPULSE_AUTO_MIGRATE
```

## Notes

- `.env.local` is ignored by git and should contain real secrets only on your machine.
- `data/*.db` is ignored by git because it is a local SQLite database.
- On Vercel, SQLite data in `/tmp` is not durable between cold starts or deployments.
- Mock data remains as fallback for screens that do not yet have persisted records.