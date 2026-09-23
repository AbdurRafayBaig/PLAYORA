# PLAYORA — frontend

Next.js 16 (App Router) application. See the [repository README](../README.md)
for the product overview, demo logins and deployment steps.

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
├── app/                  # routes
│   ├── (public)          # /, /live, /fixtures, /standings, /results, /about, /contact
│   ├── admin/            # console — layout renders AdminShell
│   ├── team/             # team portal — layout renders TeamShell
│   ├── login/
│   ├── error.tsx  global-error.tsx  not-found.tsx  loading.tsx
│   ├── manifest.ts  robots.ts  sitemap.ts
│   └── globals.css       # design tokens + cascade layers
├── components/
│   ├── cards/            # MatchCard, KPICard, PersonCard, StatusBadge
│   ├── layout/           # PlayoraHeader/Footer, AdminShell, TeamShell, LudoMark
│   ├── matches/          # FilteredMatchList
│   ├── theme/            # ThemeProvider, ThemeToggle
│   └── ui/               # Button, Panel, PageHeader, DataTable, EmptyState, …
└── lib/
    ├── data.ts           # the demo dataset + selectors — swap for the API here
    ├── types.ts          # domain types
    ├── constants.ts      # brand, navigation, contact
    ├── utils.ts          # cn, formatting, contrast-safe status colours
    └── useStoredFlag.ts  # localStorage-backed boolean via useSyncExternalStore
```

## Conventions worth knowing

**Cascade layers.** `globals.css` is written in layers on purpose. Tailwind v4
emits `@layer theme, base, components, utilities`, and *unlayered* author CSS
outranks all of them regardless of specificity. Putting a reset or a component
class outside a layer silently kills the matching utilities — an unlayered
`* { padding: 0 }` once zeroed every `p-*` in the app. Resets go in `base`,
reusable blocks in `components`, helper classes in `utilities`. Only custom
property definitions (the `.dark` token block) stay unlayered.

**Colour tokens.** Three families, and they are not interchangeable:

| Family | Use for | Example |
| --- | --- | --- |
| `ludo-{hue}` | fills, icons, tints, borders | `bg-ludo-red/10`, `border-t-ludo-blue` |
| `ludo-{hue}-ink` | coloured *text* on a light or dark surface | `text-ludo-green-ink` |
| `ludo-{hue}-solid` | backgrounds that carry **white** text | `bg-ludo-red-solid` |

The plain hues lighten in dark mode, which is right for tints and wrong under
white text — `bg-ludo-red text-white` measures 2.79:1 in dark mode. The
`-solid` tokens hold their value across themes for exactly that reason.

**Server by default.** Public pages are server components so each can export
its own `metadata`. Reach for `"use client"` only where there is state — the
header drawer, the round filter, the login form, the theme toggle. A client
page cannot export `metadata`; give the route a `layout.tsx` instead (see
`app/login/layout.tsx`).

**Data access.** Import selectors from `lib/data.ts`, never the raw arrays.
That indirection is what makes swapping in the Django API a local change.

**Animation delays** are `anim-delay-*`, not `delay-*` — the latter is
Tailwind's own transition-delay utility.
