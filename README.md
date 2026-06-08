# MarketPulse AI

MarketPulse AI is a local-first admin dashboard for creating market ideas, turning them into Telegram-ready drafts, scheduling publications, and sending them through Telegram Bot API.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui base components
- Drizzle ORM
- SQLite through `better-sqlite3`
- AI SDK with OpenAI provider
- Telegram Bot API

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

## Environment Variables

`DATABASE_URL` controls the local SQLite database path.

```env
DATABASE_URL=file:./data/marketpulse.db
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

## Notes

- `.env.local` is ignored by git and should contain real secrets only on your machine.
- `data/*.db` is ignored by git because it is a local SQLite database.
- Mock data remains as fallback for screens that do not yet have persisted records.