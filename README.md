# 🎯 PLAYORA — Sports Tournament Management Portal

A tournament operations platform for running Ludo championships end to end:
live match tracking, fixtures, standings, results, an admin console, and a
team portal — built with **Next.js 16 (App Router)**, **TypeScript** and
**Tailwind CSS v4**.

![PLAYORA](frontend/public/og-image.png)

---

## 🌟 What it does

PLAYORA covers three audiences from one codebase:

| Surface | Who it is for | What they get |
| --- | --- | --- |
| **Public hub** | Spectators, players | Live matches, fixtures, standings, results, rules and contact |
| **Admin console** | Organisers, referees | Teams, players, fixtures, a scorer view, venues, disputes, announcements, reports, roles and an audit log |
| **Team portal** | Team captains | Their matches, results, standing, roster and notifications |

The visual language borrows from a Ludo board — **red**, **yellow**, **green**
and **blue** — over a token-driven design system with full light and dark
themes.

---

## ✨ Highlights

- **Mobile first, verified.** No page scrolls horizontally at 320px. The
  admin console is a drawer on phones, the team portal has a bottom nav that
  respects safe-area insets, and the standings table pins rank and team while
  the stats scroll.
- **Accessible by default.** Skip link, visible focus rings, `aria-current`,
  Escape-to-close and focus return on drawers, semantic tables and landmarks,
  `prefers-reduced-motion` support, and WCAG AA contrast in both themes
  (verified by an automated sweep — see [Quality checks](#-quality-checks)).
- **Installable.** Web manifest, maskable icons and shortcuts, so a referee
  can add it to their home screen for the day.
- **SEO ready.** Per-page titles, descriptions, canonicals and Open Graph
  cards; `robots.txt` and `sitemap.xml` generated from the route list.
- **One source of truth.** Every surface reads the same dataset, so the
  landing page, standings, admin console and team portal never disagree.

---

## 🏗️ Project layout

```
Ludo_System/
├── frontend/                  # Next.js 16 · React 19 · TypeScript · Tailwind v4
│   ├── src/
│   │   ├── app/               # App Router routes (public, /admin, /team)
│   │   ├── components/        # cards, layout shells, matches, ui primitives
│   │   └── lib/               # data, types, constants, utils
│   ├── public/                # icons, OG image, team photos
│   └── .env.example
└── docs/                      # PRD, UI system, architecture, DB, API reference
```

### Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with CSS-variable design tokens |
| Icons | lucide-react |
| Theming | next-themes (class strategy, follows the device by default) |
| Backend | Django REST + PostgreSQL + WebSockets *(specified in `docs/`, not yet wired)* |

---

## 🚀 Running locally

**Requirements:** Node.js 20+ and npm.

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:3000>.

### Demo logins

There is no backend yet, so `/login` validates against demo credentials and
routes you to the right portal:

| Portal | Identifier | Password |
| --- | --- | --- |
| Team | `T001` | `playora` |
| Admin | `admin@playora.app` | `playora` |

The login page has a **Fill demo credentials** button.

---

## 🌍 Deploying for free

The app is fully static — every route prerenders — so any static-friendly
host works. **Vercel** is the shortest path.

### Vercel

1. Push to GitHub (this repo is already set up).
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import
   `AbdurRafayBaig/PLAYORA`.
3. **Set Root Directory to `frontend`.** This is the one setting that matters
   — the Next app is not at the repo root, and the build fails without it.
4. Framework preset resolves to Next.js automatically; leave the build and
   output settings alone.
5. Add one environment variable:

   | Key | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` |

   This drives canonical URLs, `sitemap.xml`, `robots.txt` and the Open Graph
   image URL. Without it they point at the placeholder domain and search
   engines index the wrong host.
6. Deploy. Later pushes to `main` redeploy automatically.

### Netlify / Cloudflare Pages

Same idea: base directory `frontend`, build command `npm run build`, and the
same `NEXT_PUBLIC_SITE_URL` variable. Netlify needs
`@netlify/plugin-nextjs`; Cloudflare Pages needs the Next.js preset.

---

## ✅ Quality checks

```bash
cd frontend
npm run check      # eslint + tsc --noEmit + next build
```

Each release of this branch was verified with:

- `next build` — all 33 routes prerender, no type errors
- `eslint` — clean, including the React 19 hooks rules
- every route returning 200, and the 404 page rendering for unknown paths
- an automated pass at 320px and 390px confirming no horizontal overflow
- a contrast and semantics sweep over 14 routes in **both** themes reporting
  zero issues (accessible names, alt text, form labels, duplicate ids,
  heading order, landmarks, computed contrast)

---

## 🔌 Connecting the real backend

The UI reads from `frontend/src/lib/data.ts`, which exports selectors
(`getStandings()`, `getLiveMatches()`, `getMatchesForTeam()` …) rather than
raw arrays. Pages never touch the arrays directly, so swapping in the API is
a matter of turning those selectors into fetches — the component tree does
not change. Types live in `frontend/src/lib/types.ts`; the endpoint contract
is in [`docs/06_API_Reference.md`](docs/06_API_Reference.md).

Admin screens that write data show a short notice explaining they are
read-only until the API is connected, rather than presenting buttons that
silently do nothing.

---

## 📄 Credits

Built by the PLAYORA team under **Tynovate**:

- **Abdur Rafay Baig** — Founder & Lead Architect ([LinkedIn](https://www.linkedin.com/in/irafaybaig/))
- **Hassaan Ahmad** — CEO & Founder
- **Zoraiz** — Product & Operations Lead

Repository: <https://github.com/AbdurRafayBaig/PLAYORA>
