# PLAYORA end-to-end tests

Three suites that drive the built app in a real Chrome, over the DevTools
Protocol. No test framework and no browser-automation package: Node's
built-in `WebSocket` speaks CDP directly, so this adds nothing to
`package.json` and runs anywhere Chrome is installed.

## Running

```bash
npm run build
npm start &                 # serve the production build on :3000
npm run test:e2e
```

Against a different port or host:

```bash
PLAYORA_URL=http://localhost:3123 npm run test:e2e
```

| Variable | Purpose | Default |
| --- | --- | --- |
| `PLAYORA_URL` | Base URL of a running build | `http://localhost:3000` |
| `PLAYORA_CHROME` | Path to Chrome, if auto-detection fails | platform guess |
| `PLAYORA_ADMIN_EMAIL` | Admin sign-in used by the suites | read from `.env.local` |
| `PLAYORA_ADMIN_PASSWORD` | Admin sign-in password | read from `.env.local` |

The admin values have **no hardcoded default**. The runner reads
`NEXT_PUBLIC_ADMIN_EMAIL` and `NEXT_PUBLIC_ADMIN_PASSWORD` from
`frontend/.env.local` (gitignored), so a local run needs no setup and no
real password ever reaches the repository. In CI, set them as secrets.

The runner exits non-zero on any failure, so it drops straight into CI.

> These tests drive the **production build**, not the dev server. Several of
> the defects they guard against (a missing Tailwind import, a redirect that
> only exists in `next.config.ts`) are invisible in development.

## Suites

**`tournament.mjs`** — plays a full six-team knockout from an empty app to a
crowned champion: create, register, draw, schedule, publish, start, record
results, advance, repeat. Then signs in as the champion and checks the
captain's view. Asserts the two properties most likely to break silently:
every match ends with exactly one winner, and exactly one team is left.

**`adversarial.mjs`** — everything a confused captain, a hurried organiser or
someone editing the URL bar would do. Every check here corresponds to a
defect that was actually shipped at some point, so they are regression
guards rather than speculation: unauthenticated access to both portals,
duplicate and whitespace-only team names, seeded-draw pairing, venue
propagation, editing an already-published fixture, undoing a result, the
retired URLs, read-only enforcement in the team portal, the notification
badge, and session teardown.

**`accessibility.mjs`** — every public and portal route, in **both** themes:
accessible names, alt text, form labels, duplicate ids, heading order,
landmarks and computed contrast against the real resolved background. Then
the same routes at 320px, asserting the page cannot actually be scrolled
sideways.

## Adding a check

Suites export `name` and `async run(driver)`, and return the reporter's
`finish()`. The driver (`lib/cdp.mjs`) gives you `goto`, `evaluate`, `text`,
`path`, `setValue`, `clickText`, `store`, `viewport` and `emulate`.

Two things worth knowing, both learned the hard way:

- `setValue` goes through the native value setter. Assigning `el.value`
  directly does not notify React and the field silently reverts.
- When locating a card by its text, take the **innermost** match.
  `[...document.querySelectorAll('div')].find(el => el.textContent.includes(x))`
  returns a page-level ancestor, whose button list includes the whole
  sidebar — which is how an early version of this suite ended up clicking a
  nav link and reporting an app bug that did not exist.
