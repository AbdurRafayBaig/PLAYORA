#!/usr/bin/env node
/**
 * PLAYORA end-to-end test runner.
 *
 * Launches headless Chrome, points it at a running build, and executes each
 * suite in turn. No test framework and no browser-automation dependency:
 * Node's built-in WebSocket speaks CDP directly, which keeps `npm install`
 * small and means these run anywhere Chrome exists.
 *
 *   npm run build && npm start &
 *   npm run test:e2e
 *
 * Environment:
 *   PLAYORA_URL              base URL              (default http://localhost:3000)
 *   PLAYORA_CHROME           path to Chrome        (auto-detected on Windows/macOS/Linux)
 *   PLAYORA_ADMIN_EMAIL      admin sign-in email    - required
 *   PLAYORA_ADMIN_PASSWORD   admin sign-in password - required
 *
 * The two admin values are read from `.env.local` automatically when they
 * are not already exported, so a local run needs no setup. They have no
 * default: a fallback in this file would commit a real password.
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/* Read admin credentials out of .env.local before the suites import them.
   That file is gitignored, which is the entire point: no real password
   should exist anywhere in this repository. */
const here = dirname(fileURLToPath(import.meta.url))
const envLocal = join(here, '..', '.env.local')
if (existsSync(envLocal)) {
  for (const line of readFileSync(envLocal, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (!m) continue
    const value = m[2].replace(/^["']|["']$/g, '')
    if (m[1] === 'NEXT_PUBLIC_ADMIN_EMAIL') process.env.PLAYORA_ADMIN_EMAIL ??= value
    if (m[1] === 'NEXT_PUBLIC_ADMIN_PASSWORD') process.env.PLAYORA_ADMIN_PASSWORD ??= value
  }
}

const { connect, makeDriver } = await import('./lib/cdp.mjs')
const tournament = await import('./suites/tournament.mjs')
const adversarial = await import('./suites/adversarial.mjs')
const accessibility = await import('./suites/accessibility.mjs')

const SUITES = [tournament, adversarial, accessibility]
const SITE = (process.env.PLAYORA_URL || 'http://localhost:3000').replace(/\/$/, '')
const PORT = 9222 + Math.floor(Math.random() * 300)

const CHROME_CANDIDATES = [
  process.env.PLAYORA_CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p))
  if (!found) {
    console.error(
      'Could not find Chrome. Set PLAYORA_CHROME to its path.\nLooked in:\n  ' +
        CHROME_CANDIDATES.join('\n  '),
    )
    process.exit(2)
  }
  return found
}

async function waitFor(check, label, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      if (await check()) return true
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  console.error(`Timed out waiting for ${label}`)
  process.exit(2)
}

const profile = mkdtempSync(join(tmpdir(), 'playora-test-'))
const chrome = spawn(
  findChrome(),
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--force-device-scale-factor=1',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const cleanup = () => {
  try { chrome.kill() } catch { /* already gone */ }
  try { rmSync(profile, { recursive: true, force: true }) } catch { /* best effort */ }
}
process.on('exit', cleanup)
process.on('SIGINT', () => { cleanup(); process.exit(130) })

if (!process.env.PLAYORA_ADMIN_EMAIL || !process.env.PLAYORA_ADMIN_PASSWORD) {
  console.error(
    'Admin credentials are not set.\n' +
      'Add NEXT_PUBLIC_ADMIN_EMAIL and NEXT_PUBLIC_ADMIN_PASSWORD to\n' +
      'frontend/.env.local, or export PLAYORA_ADMIN_EMAIL and\n' +
      'PLAYORA_ADMIN_PASSWORD before running the suite.',
  )
  process.exit(2)
}

console.log(`PLAYORA e2e — ${SITE}`)

await waitFor(
  async () => (await fetch(SITE, { redirect: 'manual' })).status < 500,
  `the app at ${SITE} (is it running? try: npm run build && npm start)`,
)
await waitFor(
  async () => (await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok,
  'headless Chrome',
)

const session = await connect(PORT)
const driver = makeDriver(session, SITE)

let totalPasses = 0
const allFailures = []

for (const suite of SUITES) {
  console.log(`\n=== ${suite.name} ===`)
  try {
    const { passes, failures } = await suite.run(driver)
    totalPasses += passes
    allFailures.push(...failures.map((f) => `[${suite.name}] ${f}`))
  } catch (err) {
    allFailures.push(`[${suite.name}] threw: ${err.message}`)
    console.error(`  ERROR ${err.message}`)
  }
}

session.ws.close()

console.log(`\n${'='.repeat(52)}`)
console.log(`${totalPasses} passed, ${allFailures.length} failed`)
if (allFailures.length) {
  console.log('\nFailures:')
  allFailures.forEach((f, i) => console.log(`${i + 1}. ${f}`))
}

cleanup()
process.exit(allFailures.length ? 1 : 0)
