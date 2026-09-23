# PLAYORA — frontend

Next.js 16 (App Router) application. See the [repository README](../README.md)
for the product overview and deployment steps.

## Commands

```bash
npm run dev        # dev server on :3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run check      # all three, in the order CI would run them
```

## Layout

```
src/
├── app/
│   ├── page.tsx + HomeClient.tsx        # public landing
│   ├── live/ fixtures/ bracket/ results/# public hub (server shell + client view)
│   ├── login/                           # DiceStage (animation) + LoginForm
│   ├── admin/                           # console — AdminShell in layout.tsx
│   ├── team/                            # read-only portal — TeamShell in layout.tsx
│   ├── error.tsx  global-error.tsx  not-found.tsx  loading.tsx
│   ├── manifest.ts  robots.ts  sitemap.ts
│   └── globals.css                      # design tokens + cascade layers
├── components/
│   ├── cards/        StatusBadge, KPICard, PersonCard
│   ├── layout/       PlayoraHeader/Footer, AdminShell, TeamShell, LudoMark
│   ├── tournament/   MatchCard, BracketView, NoTournament
│   ├── theme/        ThemeProvider, ThemeToggle
│   └── ui/           Button, Panel, PageHeader, DataTable, EmptyState, …
└── lib/
    ├── tournament/
    │   ├── types.ts    domain types
    │   ├── engine.ts   pure knockout maths — round sizes, pairing, byes,
    │   │               credential generation, time formatting
    │   └── store.tsx   localStorage-backed state via useSyncExternalStore
    ├── constants.ts    brand, navigation, contact, admin env credentials
    ├── utils.ts        cn, formatting
    ├── useNow.ts       one shared 1s ticker for every live clock
    └── useStoredFlag.ts
```

## Architecture

**The app ships empty.** There is no seed data. An organiser creates the
tournament, registers teams, draws the bracket, assigns tables and times, and
publishes each round. Until they do, every public page shows an honest empty
state rather than invented fixtures.

**Single elimination, no points table.** `engine.ts` derives round sizes by
halving with `Math.ceil` — 48 → 24 → 12 → 6 → 3 → 2 → 1 — so an odd round
falls out naturally as a bye rather than needing a special case. A league
table would be meaningless here: every surviving team has won every match it
played, so they would all be level. Progress is depth in the bracket.

**Publishing is the gate.** A round is invisible to teams and to the public
until every match in it has a table *and* a kickoff time, and the organiser
presses publish. That single action is also what notifies the teams.

**Teams are read-only.** The portal has no writable control anywhere. All
tournament state is set by the organiser.

## Where state lives

`lib/tournament/store.tsx` keeps everything in this browser's localStorage,
read through `useSyncExternalStore`. Two limits this cannot fix, both
surfaced in the UI rather than hidden:

- A team login created on the organiser's laptop does not exist on a
  captain's phone. Cross-device access needs the Django backend.
- The team password is compared in the browser, so it is readable from the
  JS bundle. It is a demo gate, not authentication.

The store's exported actions map one-to-one onto REST endpoints, and the
bracket maths in `engine.ts` is already pure, so porting is a change of
transport rather than a rewrite.

## Conventions worth knowing

**Cascade layers.** `globals.css` is written in layers on purpose. Tailwind v4
emits `@layer theme, base, components, utilities`, and *unlayered* author CSS
outranks all of them regardless of specificity. Putting a reset or a component
class outside a layer silently kills the matching utilities — an unlayered
`* { padding: 0 }` once zeroed every `p-*` in the app. Resets go in `base`,
reusable blocks in `components`, helper classes in `utilities`. Only the
`.dark` custom-property block stays unlayered.

**Colour tokens.** Three families, and they are not interchangeable:

| Family | Use for | Example |
| --- | --- | --- |
| `ludo-{hue}` | fills, icons, tints, borders | `bg-ludo-flame/15`, `border-t-ludo-indigo` |
| `ludo-{hue}-ink` | coloured *text* | `text-ludo-lemon-ink` |
| `ludo-{hue}-solid` | backgrounds carrying **white** text | `bg-ludo-flame-solid` |

The board hues are bright — `text-ludo-lemon` on white is about 1.4:1, and
`bg-ludo-flame` under white text is 3.04:1. The `-ink` and `-solid` variants
exist so neither mistake is possible. Bright fills (lemon, mango) pair with
`text-on-bright`.

**Server by default.** Public pages are server components exporting their own
`metadata`, each rendering a `*Client.tsx` that reads the store. A client page
cannot export `metadata` — give the route a server `page.tsx` instead.

**Animation delays** are `anim-delay-*`, not `delay-*` — the latter is
Tailwind's own transition-delay utility.

**Clocks** use `useNow()`, never a local `setInterval` + `setState`. One
interval serves every live card, and the server snapshot is `null` so there
is no hydration mismatch.
