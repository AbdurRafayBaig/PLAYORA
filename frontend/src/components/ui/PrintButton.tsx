"use client"

import { type ReactNode } from "react"

/**
 * Fixtures and standings get printed and pinned to a wall on tournament day,
 * so the print stylesheet deserves an obvious entry point.
 */
export function PrintButton({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label={label}
      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-surface-raised text-xs font-semibold text-ink-muted hover:text-ink hover:bg-ink-faint/10 transition-colors cursor-pointer"
    >
      {children}
    </button>
  )
}
