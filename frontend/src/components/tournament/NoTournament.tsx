"use client"

import Link from "next/link"
import { CalendarOff } from "lucide-react"
import { EmptyState } from "@/components/ui/EmptyState"

/**
 * Shown on every public surface until an admin has actually started a
 * tournament. The app ships with no fixtures at all — inventing eight fake
 * teams would only teach a visitor to distrust what is on screen.
 */
export function NoTournament({
  what = "fixtures",
}: {
  what?: string
}) {
  return (
    <EmptyState
      icon={<CalendarOff className="w-6 h-6" />}
      title="No tournament running yet"
      description={`There are no ${what} to show. Once the organiser sets up the draw and publishes the first round, everything appears here automatically.`}
      action={
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface-raised text-ink text-xs font-semibold hover:bg-ink-faint/10 transition-colors"
        >
          Contact the organisers
        </Link>
      }
    />
  )
}

/** Same idea, for the signed-in team portal. */
export function NotSignedIn() {
  return (
    <EmptyState
      icon={<CalendarOff className="w-6 h-6" />}
      title="You are not signed in"
      description="Sign in with the team code and password the organiser gave you at registration."
      action={
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ludo-flame-solid text-white text-xs font-semibold hover:bg-ludo-flame-solid-hover transition-colors"
        >
          Go to login
        </Link>
      }
    />
  )
}
