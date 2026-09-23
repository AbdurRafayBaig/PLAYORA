# PLAYORA — Database implementation plan

Written for: whoever builds the backend (Abdur Rafay / Ammar Ahmad).

---

## 1. The decision

**Database: PostgreSQL, hosted on [Neon](https://neon.tech).**

Postgres is what `03_System_Architecture` and `04_Database_and_SQL` already
specify, so nothing in the spec changes. Neon is the host because its free
tier suits a tournament that runs in bursts: 0.5 GB storage, no credit card,
and it auto-suspends when idle but wakes on the next connection in roughly
300 ms — you will not notice it. Supabase's free tier *pauses a project
after a week of inactivity* and needs a manual resume, which is exactly the
wrong failure mode the morning of an event.

**Where the API lives: Next.js Route Handlers, in this same repo.**

This is the one place the plan departs from `03_System_Architecture`, which
says Django REST. The reason is deployment, not preference:

| | Next.js Route Handlers | Separate Django service |
| --- | --- | --- |
| Deployments to keep alive | 1 | 2 |
| Free hosting for the API | Vercel, no cold start | Render free tier sleeps after 15 min, ~50 s to wake |
| CORS / auth cookie config | none needed, same origin | must be configured and kept in sync |
| Reuse of `engine.ts` | direct import, already pure | rewrite the bracket maths in Python |

That last row matters more than it looks. All the knockout logic —
round sizes, seeded pairing, byes, advancement — already lives in
`frontend/src/lib/tournament/engine.ts` as pure functions with no storage
and no React. On the Next.js path the server imports that file unchanged, so
there is exactly one implementation of the rules and no risk of the API and
the UI disagreeing about who advanced. On the Django path it gets
reimplemented in Python and the two must be kept in step by hand.

> **Before you start, settle this:** if Django is a *course requirement*,
> ignore the table and take the Django path — section 9 lists what changes.
> If it was just the original plan, Next.js Route Handlers will get a working
> cross-device app live sooner and with less to maintain.

**ORM: Prisma.** Typed client generated from the schema, and its migration
tool is the least painful way to keep a hosted database in step with the
repo.

---

## 2. What the database has to fix

Today everything lives in one browser's `localStorage`. Two consequences,
and they are the whole reason for this work:

1. **A team login created on the organiser's laptop does not exist on a
   captain's phone.** Nothing about the app works across devices.
2. **Passwords are compared in the browser**, so they are readable in
   devtools. There is no real authentication.

A third thing to decide now, because it changes a feature:

> **Passwords will be hashed and never readable again.** That is correct and
> non-negotiable, but it breaks "print the credential sheet" as it stands,
> which today prints every password. After the change, a password is visible
> exactly once — at the moment it is generated. Either print the sheet during
> registration, or make the sheet print team IDs only and reissue a password
> for any captain who loses theirs. Decide which before building the UI.

---

## 3. Schema

Mirrors `frontend/src/lib/tournament/types.ts` so the port is mechanical.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")   // Neon: unpooled, for migrations
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model Tournament {
  id           String   @id @default(cuid())
  name         String
  venue        String
  phase        Phase    @default(SETUP)
  drawMode     DrawMode @default(RANDOM)
  pairingMode  Pairing  @default(AUTO)
  currentRound Int      @default(0)
  championId   String?
  createdAt    DateTime @default(now())

  teams  Team[]
  rounds Round[]
}

model Team {
  id                String     @id @default(cuid())
  tournamentId      String
  tournament        Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  code              String
  passwordHash      String
  name              String
  status            TeamStatus @default(ACTIVE)
  eliminatedInRound Int?
  joinedInRound     Int        @default(0)
  registeredAt      DateTime   @default(now())

  players   Player[]
  notices   Notice[]
  entrantIn RoundEntrant[]
  asTeamA   Match[]  @relation("TeamA")
  asTeamB   Match[]  @relation("TeamB")
  wins      Match[]  @relation("Winner")

  // Two teams in one tournament cannot share a code or a name.
  @@unique([tournamentId, code])
  @@unique([tournamentId, name])
}

model Player {
  id     String @id @default(cuid())
  teamId String
  team   Team   @relation(fields: [teamId], references: [id], onDelete: Cascade)
  name   String
  phone  String @default("")
}

model Round {
  id           String     @id @default(cuid())
  tournamentId String
  tournament   Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  index        Int
  published    Boolean    @default(false)
  publishedAt  DateTime?

  entrants RoundEntrant[]
  matches  Match[]

  @@unique([tournamentId, index])
}

// The field for a round, as an ordered list. `position` preserves seeding
// order, which is what makes a seeded redraw reproducible.
model RoundEntrant {
  roundId  String
  round    Round  @relation(fields: [roundId], references: [id], onDelete: Cascade)
  teamId   String
  team     Team   @relation(fields: [teamId], references: [id], onDelete: Cascade)
  position Int

  @@id([roundId, teamId])
  @@index([roundId, position])
}

model Match {
  id          String      @id @default(cuid())
  roundId     String
  round       Round       @relation(fields: [roundId], references: [id], onDelete: Cascade)
  teamAId     String
  teamA       Team        @relation("TeamA", fields: [teamAId], references: [id])
  teamBId     String?     // null = bye
  teamB       Team?       @relation("TeamB", fields: [teamBId], references: [id])
  tableLabel  String      @default("")
  startsAt    DateTime?
  status      MatchStatus @default(UNSCHEDULED)
  winnerId    String?
  winner      Team?       @relation("Winner", fields: [winnerId], references: [id])
  startedAt   DateTime?
  completedAt DateTime?

  @@index([roundId])
}

model Notice {
  id        String     @id @default(cuid())
  teamId    String?    // null = broadcast to every team
  team      Team?      @relation(fields: [teamId], references: [id], onDelete: Cascade)
  title     String
  body      String
  tone      NoticeTone @default(INFO)
  read      Boolean    @default(false)
  createdAt DateTime   @default(now())

  @@index([teamId, read])
}

enum Phase       { SETUP RUNNING COMPLETE }
enum DrawMode    { RANDOM SEEDED MANUAL }
enum Pairing     { AUTO MANUAL }
enum TeamStatus  { ACTIVE ELIMINATED CHAMPION }
enum MatchStatus { UNSCHEDULED SCHEDULED LIVE COMPLETED BYE }
enum NoticeTone  { INFO SUCCESS WARNING }
```

### Constraints Prisma cannot express

Add these as raw SQL in a migration. They are the rules that keep the
bracket honest when two requests arrive at once:

```sql
-- A winner must actually be in the match.
ALTER TABLE "Match" ADD CONSTRAINT match_winner_is_a_participant
  CHECK ("winnerId" IS NULL
         OR "winnerId" = "teamAId"
         OR "winnerId" = "teamBId");

-- A bye has no opponent and is won on creation.
ALTER TABLE "Match" ADD CONSTRAINT match_bye_shape
  CHECK (status <> 'BYE' OR ("teamBId" IS NULL AND "winnerId" = "teamAId"));

-- A team plays at most once per round. Two partial indexes, because a team
-- can sit in either slot.
CREATE UNIQUE INDEX match_one_slot_a_per_round ON "Match" ("roundId", "teamAId");
CREATE UNIQUE INDEX match_one_slot_b_per_round ON "Match" ("roundId", "teamBId")
  WHERE "teamBId" IS NOT NULL;

-- At most one bye per round.
CREATE UNIQUE INDEX match_one_bye_per_round ON "Match" ("roundId")
  WHERE status = 'BYE';
```

---

## 4. Endpoints

Every one maps to a function that already exists in
`frontend/src/lib/tournament/store.tsx`, so the UI calls change from a local
mutation to a `fetch` with the same name and arguments.

| Store action today | Method and path |
| --- | --- |
| — | `POST /api/auth/admin/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| `signInTeam` | `POST /api/auth/team/login` |
| `createTournament` | `POST /api/tournaments` |
| — (read everything) | `GET /api/tournaments/current` |
| `addTeam` | `POST /api/tournaments/:id/teams` |
| `removeTeam` | `DELETE /api/teams/:id` |
| `regeneratePassword` | `POST /api/teams/:id/password` |
| `drawFirstRound` | `POST /api/tournaments/:id/draw` |
| `advanceRound` | `POST /api/tournaments/:id/advance` |
| `revertLastAdvance` | `POST /api/tournaments/:id/revert` |
| `setPairingMode` | `PATCH /api/tournaments/:id` |
| `redrawCurrentRound` | `POST /api/rounds/:id/redraw` |
| `unpairAll` | `DELETE /api/rounds/:id/matches` |
| `publishRound` | `POST /api/rounds/:id/publish` |
| `createMatch` | `POST /api/rounds/:id/matches` |
| `setBye` | `PUT /api/rounds/:id/bye` |
| `unpairMatch` | `DELETE /api/matches/:id` |
| `scheduleMatch` | `PATCH /api/matches/:id` |
| `startMatch` | `POST /api/matches/:id/start` |
| `recordWinner` | `POST /api/matches/:id/result` |
| `undoResult` | `DELETE /api/matches/:id/result` |
| `markNoticesRead` | `POST /api/notices/read` |

**Authorisation, enforced server-side, not in the UI:**

- Everything under `/api/tournaments/*`, `/api/rounds/*`, `/api/matches/*`
  and `/api/teams/*` requires an **admin** session.
- A **team** session may call only `GET /api/tournaments/current`,
  `GET /api/me/team`, `GET /api/me/matches`, `GET /api/me/notices` and
  `POST /api/notices/read`. Nothing else. The read-only team portal stops
  being a UI convention and becomes a server rule.
- Unauthenticated callers get published rounds only — never an unpublished
  fixture, never a password hash, never a team's contact details.

---

## 5. Build order

Each step leaves the app working. Do not skip ahead; step 5 is where it
starts paying off.

### Step 1 — Provision the database (15 min)

1. Sign up at neon.tech, create a project in the region nearest you
   (Singapore or Frankfurt from Pakistan).
2. Copy both connection strings — the **pooled** one and the **direct** one.
3. In `frontend/.env.local` (gitignored):
   ```
   DATABASE_URL="postgresql://...-pooler.../neondb?sslmode=require"
   DIRECT_URL="postgresql://.../neondb?sslmode=require"
   SESSION_SECRET="<openssl rand -base64 32>"
   ```
4. Add the same three to `.env.example` with placeholder values.

### Step 2 — Prisma (30 min)

```bash
cd frontend
npm i -D prisma
npm i @prisma/client
npx prisma init --datasource-provider postgresql
# paste the schema from section 3 into prisma/schema.prisma
npx prisma migrate dev --name init
npx prisma studio      # confirm the tables exist
```

Then add the raw-SQL constraints: create an empty migration with
`npx prisma migrate dev --create-only --name constraints`, paste the SQL
from section 3 into it, and apply it.

### Step 3 — Server-side sessions (2–3 h)

```bash
npm i bcryptjs jose
npm i -D @types/bcryptjs
```

- `lib/server/session.ts` — sign a JWT holding `{ kind: 'admin' | 'team', id }`
  with `jose`, set it as an **httpOnly, Secure, SameSite=Lax** cookie.
- `lib/server/auth.ts` — `requireAdmin()` and `requireTeam()` helpers that
  read the cookie and throw a 401. Every mutating handler calls one of them
  as its first line.
- Seed the admin: a one-off script that writes an `AdminUser` with
  `bcrypt.hash(password, 12)`. Delete `NEXT_PUBLIC_ADMIN_EMAIL` and
  `NEXT_PUBLIC_ADMIN_PASSWORD` from every env file the moment this works —
  a `NEXT_PUBLIC_*` value is compiled into the browser bundle.

### Step 4 — Route Handlers (1 day)

One file per resource under `src/app/api/`. Each handler:

1. authorises (`requireAdmin()` / `requireTeam()`),
2. validates the body with Zod,
3. runs the mutation **inside `prisma.$transaction`**,
4. returns the updated tournament snapshot.

Reuse `lib/tournament/engine.ts` directly — `pairTeams`, `roundSizes`,
`winnersOf`, `isRoundComplete`, `generateTeamCode`, `generatePassword` all
run unchanged on the server. Do not reimplement them.

Two things that must be inside the transaction, or the bracket can corrupt
under a double-click:

- `advance` — read winners, create the round, create its matches.
- `result` — set the winner, eliminate the loser, write both notices.

### Step 5 — Swap the store's backend (half a day)

`lib/tournament/store.tsx` keeps its exact public shape — `useTournament()`
and every action name stay the same — so **no page or component changes**.
Inside:

- Replace `getSnapshot`/`persist` with a fetched snapshot plus a cache.
- Each action becomes `await fetch(...)` then refresh the snapshot.
- Keep `useSyncExternalStore`; only the source changes.

Ship this step and cross-device works. Everything after it is polish.

### Step 6 — Live updates (2 h)

Start with polling: re-fetch `GET /api/tournaments/current` every 5 s while
a match is live, every 30 s otherwise. It is unglamorous and completely
adequate for a venue with a handful of tables.

Only if that proves insufficient, add Server-Sent Events at
`GET /api/stream` — still one deployment, no extra service.

### Step 7 — Deploy (30 min)

1. In Vercel → Settings → Environment Variables add `DATABASE_URL`,
   `DIRECT_URL`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`.
2. Set the build command to `prisma generate && next build` (Vercel caches
   `node_modules`, so `generate` must run every build).
3. Run migrations against production once: `npx prisma migrate deploy` with
   the production `DIRECT_URL` exported locally.
4. Redeploy and sign in.

### Step 8 — Point the tests at the API (2 h)

`frontend/tests/` needs almost nothing changed — it drives the real UI, so
it does not care where the data lives. Two edits:

- The suites currently clear state with `localStorage.clear()`. Replace with
  a `POST /api/test/reset` handler that truncates the tables and is
  **refused unless `ALLOW_TEST_RESET=1`**, so it can never fire in
  production.
- `d.store()` reads `localStorage`; point it at `GET /api/tournaments/current`.

Then `npm run test:e2e` is your regression net for the whole migration —
118 assertions that already know what correct behaviour looks like.

---

## 6. Effort

| Step | Time |
| --- | --- |
| 1–2 Database and Prisma | ~1 hour |
| 3 Sessions and hashing | 2–3 hours |
| 4 Route Handlers | ~1 day |
| 5 Store swap | ~half a day |
| 6 Live updates | ~2 hours |
| 7 Deploy | ~30 min |
| 8 Tests | ~2 hours |

**Roughly two focused days.** Step 4 is the bulk; steps 1–3 are mostly
configuration.

---

## 7. Order of work if time is short

If the tournament is close and you cannot finish everything, this order
gives a usable system earliest:

1. Steps 1–3 (database, Prisma, sessions)
2. Only these endpoints: admin login, team login, `GET current`, create
   tournament, add team, draw, publish, start, result, advance
3. Step 5 (store swap)

That is cross-device access with real authentication. Undo, revert, manual
pairing and notices can keep running against the server later — the UI for
them already exists.

---

## 8. What not to do

- **Do not put the database URL in a `NEXT_PUBLIC_*` variable.** Anything
  with that prefix is compiled into the browser bundle.
- **Do not trust `phase` or `status` sent from the client.** Read the
  current state from the database inside the transaction and decide there.
- **Do not skip the transaction on `advance` and `result`.** A referee
  double-tapping "Advance" on a slow connection is a realistic way to draw
  a round twice.
- **Do not store passwords in plain text** to keep the printable credential
  sheet working. Resolve that trade-off as described in section 2 instead.

---

## 9. If Django is required

The schema in section 3 translates directly to Django models; the
constraints go in `Meta.constraints` as `CheckConstraint` and
`UniqueConstraint(condition=Q(...))`. What changes:

- **Host:** Render's free web service sleeps after 15 minutes idle and takes
  ~50 s to wake. Budget for a paid instance on tournament day, or use a
  keep-alive ping. The database stays on Neon either way.
- **The engine is rewritten in Python.** `engine.ts` is ~200 lines of pure
  functions with no dependencies — port them to `tournament/engine.py` and
  port the ladder tests with them, because the front end still contains its
  own copy for optimistic rendering and the two must agree.
- **CORS and cookies:** the API is on a different origin, so sessions need
  `SameSite=None; Secure` and an explicit `CORS_ALLOWED_ORIGINS`.
- **Deploys double.** Two pipelines, two sets of environment variables, and
  a version-skew window whenever only one of them ships.

Everything else — the endpoint list, the build order, the authorisation
rules — is unchanged.
