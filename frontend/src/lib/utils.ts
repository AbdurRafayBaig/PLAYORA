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
      bg: 'bg-ludo-red/10',
      text: 'text-ludo-red-ink',
      border: 'border-ludo-red/30',
      dot: 'bg-ludo-red',
    },
    yellow: {
      bg: 'bg-ludo-yellow/15',
      text: 'text-ludo-yellow-ink',
      border: 'border-ludo-yellow/30',
      dot: 'bg-ludo-yellow',
    },
    green: {
      bg: 'bg-ludo-green/10',
      text: 'text-ludo-green-ink',
      border: 'border-ludo-green/30',
      dot: 'bg-ludo-green',
    },
    blue: {
      bg: 'bg-ludo-blue/10',
      text: 'text-ludo-blue-ink',
      border: 'border-ludo-blue/30',
      dot: 'bg-ludo-blue',
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
