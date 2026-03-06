# BeerpongScore 2

BeerpongScore 2 is a Next.js 15 application for managing beer pong tournaments.
It supports tournament overviews, automated group/KO matchmaking, live score entry, and Elo ranking updates based on historical games.

## Tech Stack

- Next.js 15 (App Router, React 19, TypeScript)
- Tailwind CSS 4 + shadcn/ui components
- Auth0 (`@auth0/nextjs-auth0`) for authentication/session handling
- PocketBase as the backend data source (currently configured with a hosted instance)

## Features

- Tournament list and tournament-specific dashboards
- Group stage tables with automatic ranking calculation
- Match generation for group phase and KO phase
- Live game entry UI and reactive updates via PocketBase subscriptions
- Elo calculation across tournaments, including history and correction logic
- Admin actions to persist Elo values and Elo history back to PocketBase

## Requirements

- Node.js `>=20 <23` (from `package.json` engines)
- npm, pnpm, yarn, or bun
- Auth0 tenant/application
- PocketBase instance with required collections and relations

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` and set your Auth0 values (do not commit real secrets):

```env
AUTH0_SECRET=your-long-random-secret
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=https://your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://your-tenant.us.auth0.com/api/v2/
AUTH0_SCOPE=openid profile email
```

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Scripts

- `npm run dev` - Start Next.js dev server (Turbopack)
- `npm run build` - Production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## Authentication

- Middleware (`src/middleware.ts`) wraps requests with Auth0 middleware and redirects unauthenticated users into interactive login.
- Home page includes Auth routes (`/auth/login`, `/auth/logout`) and reads the current session.

## Data Source (PocketBase)

PocketBase is initialized in [`src/lib/pocketbase.ts`](src/lib/pocketbase.ts) with a fixed base URL.
If you want to use a different instance, change that file.

Main collections used in the app:

- `players`
- `teams`
- `tournaments`
- `games`

The app expects expanded relations in several queries (for example: `home_team`, `away_team`, tournament groups `groupA`-`groupE`).

## Route Overview

- `/` - Auth test / landing page
- `/turniere` - Tournament cards overview
- `/turniere/[turnierID]` - Tournament dashboard and standings
- `/turniere/[turnierID]/matchmaking` - Match operations (group + KO + Elo preview)
- `/elo` - Elo dashboard for all players/tournaments
- `/dashboard` - UI demo dashboard (not core tournament flow)
- `/anlage` - Utility/export page that writes files into `output/` on render

## Core Domain Logic

- Matchmaking and standings: [`src/lib/beerpong.ts`](src/lib/beerpong.ts)
- Elo system: [`src/lib/elo.ts`](src/lib/elo.ts)
- Batch update actions to persist Elo data: [`src/lib/actions.ts`](src/lib/actions.ts)

## Project Structure

```text
src/
  app/                # App Router pages and route segments
  components/          # UI + feature components
  hooks/               # Shared React hooks
  lib/                 # PocketBase client, auth, Elo + beerpong logic
output/                # Generated helper/export files (utility route)
public/                # Static assets
```

## Notes

- `src/app/page.tsx` still contains starter-template content and Auth links.
- Some navigation entries in the sidebar are placeholders (`#`).
- `/anlage` performs server-side file writes to `output/`; keep that in mind when deploying.

## Security

- Never commit real secrets in `.env.local`.
- Rotate Auth0 credentials if they were ever exposed.
