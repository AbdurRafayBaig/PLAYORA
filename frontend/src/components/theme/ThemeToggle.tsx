"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

/**
 * Light/dark switch.
 *
 * Reads `resolvedTheme`, not `theme` — with `defaultTheme="system"` the
 * latter is the literal string "system", so comparing it to "dark" would
 * make the first click a no-op for anyone on a dark device.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  // The server cannot know the device theme, so render a same-sized
  // placeholder until mount to keep the header from shifting.
  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-border ${className}`}
        aria-hidden="true"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-surface-raised text-ink hover:bg-ink-faint/10 transition-colors duration-200 cursor-pointer ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Sun
        aria-hidden="true"
        className="w-4 h-4 text-ludo-yellow-ink rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0"
      />
      <Moon
        aria-hidden="true"
        className="absolute w-4 h-4 text-ludo-blue rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100"
      />
    </button>
  )
}
