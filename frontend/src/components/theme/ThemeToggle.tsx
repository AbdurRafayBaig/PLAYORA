"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

/**
 * Light/dark switch.
 *
 * Two deliberate choices here:
 *
 * 1. `resolvedTheme`, not `theme`. With `defaultTheme="system"` the latter is
 *    the literal string "system", so comparing it to "dark" made the first
 *    click a no-op for anyone on a dark device.
 *
 * 2. Nothing in the render depends on the theme, so there is no `mounted`
 *    state and no hydration gap. The icon swap is pure CSS via the `.dark`
 *    class that next-themes sets in a blocking script before first paint,
 *    and the theme is only read inside the click handler.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`relative w-11 h-11 flex items-center justify-center rounded-xl border border-border bg-surface-raised text-ink hover:bg-ink-faint/10 transition-colors duration-200 cursor-pointer ${className}`}
      title="Switch between light and dark theme"
    >
      <Sun
        aria-hidden="true"
        className="w-4 h-4 text-ludo-mango-ink rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0"
      />
      <Moon
        aria-hidden="true"
        className="absolute w-4 h-4 text-ludo-indigo-ink rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100"
      />
      {/* The accessible name tracks the current theme, swapped by the same
          CSS rather than by React state. */}
      <span className="dark:hidden">
        <span className="sr-only">Switch to dark theme</span>
      </span>
      <span className="hidden dark:block">
        <span className="sr-only">Switch to light theme</span>
      </span>
    </button>
  )
}
