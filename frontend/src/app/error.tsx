"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RotateCcw, Home, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Wire this to Sentry/LogRocket when one is added; for now the console
    // keeps the digest reachable from a user's bug report.
    console.error("PLAYORA route error:", error)
  }, [error])

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="w-full max-w-md space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-ludo-red/10 flex items-center justify-center">
          <AlertTriangle aria-hidden="true" className="w-7 h-7 text-ludo-red-ink" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            We hit an unexpected error loading this page. Trying again usually
            clears it — the tournament data itself is safe.
          </p>
          {error.digest && (
            <p className="text-[11px] text-ink-faint font-mono pt-1">
              Reference: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-ludo-red-solid text-white font-bold text-sm shadow-lg hover:bg-ludo-red-solid-hover transition-colors cursor-pointer"
          >
            <RotateCcw aria-hidden="true" className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-border bg-surface-raised text-ink font-bold text-sm hover:bg-ink-faint/10 transition-colors"
          >
            <Home aria-hidden="true" className="w-4 h-4" />
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
