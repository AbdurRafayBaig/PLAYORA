/* ═══════════════════════════════════════════════
   PLAYORA — Utility Functions
   ═══════════════════════════════════════════════ */

import clsx, { type ClassValue } from 'clsx'

/**
 * Merge class names, honouring conditionals and objects.
 *
 * The previous hand-rolled version filtered everything that was not already
 * a string, which silently dropped `cn({ 'is-active': true })` and nested
 * arrays. `clsx` is already a dependency, so just use it.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/** e.g. "14 Feb 2026" */
export function formatDate(date: string | Date): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return '—'
  return new Intl.DateTimeFormat('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

/** e.g. "02:30 PM" */
export function formatTime(date: string | Date): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return '—'
  return new Intl.DateTimeFormat('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(parsed)
}

/**
 * Two-letter initials for avatars.
 * Skips empty segments so "Ali  Khan" and " Ali Khan" behave.
 */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Tailwind classes for a status colour.
 *
 * Text uses the `-ink` variants: the brand hues are tuned for fills and do
 * not clear 4.5:1 as small text on a white card.
 */
export function getStatusColor(color: string): {
  bg: string
  text: string
  border: string
  dot: string
} {
  const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    red: {
      bg: 'bg-ludo-flame/10',
      text: 'text-ludo-flame-ink',
      border: 'border-ludo-flame/30',
      dot: 'bg-ludo-flame',
    },
    yellow: {
      bg: 'bg-ludo-mango/15',
      text: 'text-ludo-mango-ink',
      border: 'border-ludo-mango/30',
      dot: 'bg-ludo-mango',
    },
    green: {
      bg: 'bg-ludo-lemon/10',
      text: 'text-ludo-lemon-ink',
      border: 'border-ludo-lemon/30',
      dot: 'bg-ludo-lemon',
    },
    blue: {
      bg: 'bg-ludo-indigo/10',
      text: 'text-ludo-indigo-ink',
      border: 'border-ludo-indigo/30',
      dot: 'bg-ludo-indigo',
    },
    muted: {
      bg: 'bg-ink-faint/10',
      text: 'text-ink-muted',
      border: 'border-ink-faint/30',
      dot: 'bg-ink-faint',
    },
  }
  return colorMap[color] ?? colorMap.muted
}

/** "1 match" / "2 matches" — no stray "1 matches" in the UI. */
export function pluralise(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : plural ?? `${singular}es`}`
}

/** Win rate as a rounded percentage; 0 played reads as 0, not NaN. */
export function winRate(wins: number, played: number): number {
  if (played <= 0) return 0
  return Math.round((wins / played) * 100)
}
