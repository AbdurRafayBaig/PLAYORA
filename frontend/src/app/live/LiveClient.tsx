"use client"

import Link from "next/link"
import { Radio, Calendar } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { EmptyState } from "@/components/ui/EmptyState"
import { MatchCard } from "@/components/tournament/MatchCard"
import { NoTournament } from "@/components/tournament/NoTournament"
import { useTournament, usePublishedMatches } from "@/lib/tournament/store"
import { CONTACT } from "@/lib/constants"
import { pluralise } from "@/lib/utils"

export function LiveClient() {
  const { ready, tournament, teams } = useTournament()
  const published = usePublishedMatches()

  const live = published.filter((m) => m.status === "live")
  const next = published.filter((m) => m.status === "scheduled").slice(0, 4)
  const roundName = (i: number) => tournament?.rounds[i]?.name ?? `Round ${i + 1}`

  if (!ready) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Live now"
        title="Live Matches"
        description={tournament ? `${tournament.name} · ${CONTACT.venue}` : undefined}
        icon={
          <span className="relative flex h-3 w-3" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-flame opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-ludo-flame" />
          </span>
        }
      />

      {/* Announced so a screen reader hears the count change without the
          user having to go hunting for it. */}
      <p className="sr-only" role="status">
        {live.length === 0
          ? "No matches are currently in progress."
          : `${pluralise(live.length, "match", "matches")} in progress.`}
      </p>

      {!tournament ? (
        <NoTournament what="live matches" />
      ) : live.length > 0 ? (
        <>
          <p className="text-xs text-ink-muted mb-4">
            {pluralise(live.length, "match", "matches")} in progress — the clock
            on each card is time since the referee started it.
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {live.map((m) => (
              <MatchCard key={m.id} match={m} teams={teams} roundName={roundName(m.roundIndex)}
                    venue={tournament?.venue} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Radio className="w-6 h-6" />}
          title="No match in play"
          description="Nothing has been started yet. A match appears here the moment the referee starts it, with a running clock."
          action={
            <Link
              href="/fixtures"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ludo-indigo-solid text-white text-xs font-semibold hover:bg-ludo-indigo-solid-hover transition-colors"
            >
              <Calendar aria-hidden="true" className="w-4 h-4" />
              View fixtures
            </Link>
          }
        />
      )}

      {next.length > 0 && (
        <section className="mt-10" aria-labelledby="next-up">
          <h2 id="next-up" className="text-sm font-bold text-ink flex items-center gap-2 mb-3">
            <Calendar aria-hidden="true" className="w-4 h-4 text-ludo-indigo-ink" />
            Up next
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {next.map((m) => (
              <MatchCard key={m.id} match={m} teams={teams} roundName={roundName(m.roundIndex)}
                    venue={tournament?.venue} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
