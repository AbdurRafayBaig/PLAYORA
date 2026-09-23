/* ═══════════════════════════════════════════════
   PLAYORA — Utility Functions
   ═══════════════════════════════════════════════ */

import { type ClassValue } from 'clsx';

/**
 * Merge CSS class names, handling conditionals
 * Simplified version without tailwind-merge for now
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter((x): x is string => typeof x === 'string' && x.length > 0)
    .join(' ');
}

/**
 * Format a date string for display
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Format time for display
 */
export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get the Ludo color class based on status type
 */
export function getStatusColor(color: string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    red: {
      bg: 'bg-ludo-red/10',
      text: 'text-ludo-red',
      border: 'border-ludo-red/30',
      dot: 'bg-ludo-red',
    },
    yellow: {
      bg: 'bg-ludo-yellow/10',
      text: 'text-ludo-yellow-dark',
      border: 'border-ludo-yellow/30',
      dot: 'bg-ludo-yellow',
    },
    green: {
      bg: 'bg-ludo-green/10',
      text: 'text-ludo-green',
      border: 'border-ludo-green/30',
      dot: 'bg-ludo-green',
    },
    blue: {
      bg: 'bg-ludo-blue/10',
      text: 'text-ludo-blue',
      border: 'border-ludo-blue/30',
      dot: 'bg-ludo-blue',
    },
    muted: {
      bg: 'bg-ink-faint/10',
      text: 'text-ink-muted',
      border: 'border-ink-faint/30',
      dot: 'bg-ink-faint',
    },
  };
  return colorMap[color] || colorMap.muted;
}
