/* ═══════════════════════════════════════════════
   PLAYORA — Knockout engine
   Pure functions. No storage, no React, no side effects — so the bracket
   maths can be reasoned about (and later ported to Django) on its own.
   ═══════════════════════════════════════════════ */

import type { Match, Round, Team } from './types'

/**
 * Round sizes from an entry count, halving until a champion remains.
 *
 * 48 → 24 → 12 → 6 → 3 → 2 → 1. The 3 → 2 step is the interesting one:
 * an odd round cannot pair everyone, so one team takes a bye. `Math.ceil`
 * is what makes that fall out naturally rather than needing a special case.
 */
export function roundSizes(teamCount: number): number[] {
  if (teamCount < 2) return teamCount === 1 ? [1] : []
  const sizes: number[] = []
  let n = teamCount
  while (n > 1) {
    sizes.push(n)
    n = Math.ceil(n / 2)
  }
  sizes.push(1)
  return sizes
}

/** "Round of 24", "Quarter Final", "Final" — named by what follows. */
export function roundName(size: number, isLast: boolean): string {
  if (isLast || size === 1) return 'Champion'
  if (size === 2) return 'Final'
  if (size === 3) return 'Semi Final'
  if (size === 4) return 'Semi Final'
  if (size === 6) return 'Quarter Final'
  if (size === 8) return 'Quarter Final'
  return `Round of ${size}`
}

export function buildRounds(teamCount: number): Round[] {
  const sizes = roundSizes(teamCount)
  return sizes.slice(0, -1).map((size, i) => ({
    index: i,
    size,
    name: roundName(size, false),
    published: false,
    publishedAt: null,
  }))
}

/** Fisher–Yates, so the draw is not biased toward registration order. */
export function shuffle<T>(input: T[]): T[] {
  const a = [...input]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Pair a list of team ids into matches for one round.
 *
 * With an odd count the last team receives a bye and advances untouched.
 * Byes are real matches with `teamBId: null` so the bracket stays a
 * complete record of what happened rather than silently skipping a team.
 */
export function pairTeams(
  teamIds: string[],
  roundIndex: number,
  idPrefix: string,
): Match[] {
  const matches: Match[] = []
  const list = [...teamIds]

  let slot = 1
  while (list.length >= 2) {
    const a = list.shift()!
    const b = list.shift()!
    matches.push({
      id: `${idPrefix}-R${roundIndex + 1}-M${slot}`,
      roundIndex,
      teamAId: a,
      teamBId: b,
      table: '',
      startsAt: '',
      status: 'unscheduled',
      winnerId: null,
      startedAt: null,
      completedAt: null,
    })
    slot++
  }

  if (list.length === 1) {
    const a = list.shift()!
    matches.push({
      id: `${idPrefix}-R${roundIndex + 1}-BYE`,
      roundIndex,
      teamAId: a,
      teamBId: null,
      table: '—',
      startsAt: '',
      status: 'bye',
      winnerId: a,
      startedAt: null,
      completedAt: new Date().toISOString(),
    })
  }

  return matches
}

/** Winners of a round, in bracket order. */
export function winnersOf(matches: Match[], roundIndex: number): string[] {
  return matches
    .filter((m) => m.roundIndex === roundIndex)
    .map((m) => m.winnerId)
    .filter((id): id is string => Boolean(id))
}

export function isRoundComplete(matches: Match[], roundIndex: number): boolean {
  const inRound = matches.filter((m) => m.roundIndex === roundIndex)
  return inRound.length > 0 && inRound.every((m) => m.winnerId !== null)
}

/** Every real match has a table and a kickoff time. Byes do not need one. */
export function isRoundFullyScheduled(matches: Match[], roundIndex: number): boolean {
  const inRound = matches.filter((m) => m.roundIndex === roundIndex && m.status !== 'bye')
  return inRound.length > 0 && inRound.every((m) => m.table !== '' && m.startsAt !== '')
}

/* ── Credentials ─────────────────────────────────────────────
   Ambiguous glyphs (0/O, 1/I/l) are left out: these get read aloud at a
   registration desk and typed on a phone keyboard.
   ───────────────────────────────────────────────────────────── */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const PASSWORD_ALPHABET = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'

function randomInts(count: number): number[] {
  const out = new Uint32Array(count)
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(out)
    return Array.from(out)
  }
  // Only reachable in a non-browser context; the demo store is client-only.
  return Array.from({ length: count }, () => Math.floor(Math.random() * 2 ** 32))
}

function pick(alphabet: string, length: number): string {
  return randomInts(length)
    .map((n) => alphabet[n % alphabet.length])
    .join('')
}

/** e.g. "TM-7KQ4" — short enough to read out, unique enough to type. */
export function generateTeamCode(existing: Set<string>): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    const code = `TM-${pick(CODE_ALPHABET, 4)}`
    if (!existing.has(code)) return code
  }
  return `TM-${Date.now().toString(36).toUpperCase().slice(-5)}`
}

export function generatePassword(length = 8): string {
  return pick(PASSWORD_ALPHABET, length)
}

/* ── Formatting ───────────────────────────────────────────── */

export function formatKickoff(iso: string): string {
  if (!iso) return 'Not scheduled'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Not scheduled'

  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const isTomorrow = d.toDateString() === tomorrow.toDateString()

  const time = new Intl.DateTimeFormat('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d)

  if (sameDay) return `Today, ${time}`
  if (isTomorrow) return `Tomorrow, ${time}`
  return `${new Intl.DateTimeFormat('en-PK', { day: 'numeric', month: 'short' }).format(d)}, ${time}`
}

/** "12:34" elapsed since a live match started. */
export function elapsedSince(iso: string | null, now: number): string {
  if (!iso) return '0:00'
  const started = new Date(iso).getTime()
  if (Number.isNaN(started)) return '0:00'
  const seconds = Math.max(0, Math.floor((now - started) / 1000))
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function teamName(teams: Team[], id: string | null): string {
  if (!id) return 'Bye'
  return teams.find((t) => t.id === id)?.name ?? 'Unknown team'
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
