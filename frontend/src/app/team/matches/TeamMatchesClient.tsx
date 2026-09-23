"use client"

import { Swords, CalendarOff } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { EmptyState } from "@/components/ui/EmptyState"
import { MatchCard } from "@/components/tournament/MatchCard"
import { useSignedInTeam, useTournament } from "@/lib/tournament/store"
import { pluralise } from "@/lib/utils"

export function TeamMatchesClient() {
  const { ready, tournament, teams, matches } = useTournament()
  const team = useSignedInTeam()

  if (!ready) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    )
  }

  // TeamShell gates the whole portal, so `team` is present here. This
  // guard only narrows the type.
  if (!team) return null

  const roundName = (i: number) => tournament?.rounds[i]?.name ?? `Round ${i + 1}`

  // A team only ever sees published rounds — the same rule the public pages
  // follow, so nobody is sent to a table that is still being arranged.
  const published = new Set(
    (tournament?.rounds ?? []).filter((r) => r.published).map((r) => r.index),
  )
  const mine = matches.filter(
    (m) =>
      (m.teamAId === team.id || m.teamBId === team.id) && published.has(m.roundIndex),
  )

  const live = mine.filter((m) => m.status === "live")
  const upcoming = mine.filter((m) => m.status === "scheduled" || m.status === "bye")
  const played = mine.filter((m) => m.status === "completed")

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="My Matches"
        title="Your Fixtures"
        description={`${pluralise(mine.length, "match", "matches")} published for ${team.name}`}
        icon={<Swords aria-hidden="true" className="w-5 h-5 text-ludo-flame-ink" />}
      />

      {mine.length === 0 ? (
        <EmptyState
          icon={<CalendarOff className="w-6 h-6" />}
          title="Nothing published yet"
          description="Your fixtures appear here as soon as the organiser publishes the round — with the table and the kickoff time."
        />
      ) : (
        <>
          {live.length > 0 && (
            <section aria-labelledby="live-h" className="space-y-3">
              <h2 id="live-h" className="flex items-center gap-2 text-sm font-bold text-ink">
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-flame opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ludo-flame" />
                </span>
                Live now
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {live.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    teams={teams}
                    roundName={roundName(m.roundIndex)}
                    venue={tournament?.venue}
                    highlightTeamId={team.id}
                  />
                ))}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section aria-labelledby="up-h" className="space-y-3">
              <h2 id="up-h" className="text-sm font-bold text-ink">
                Upcoming ({upcoming.length})
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {upcoming.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    teams={teams}
                    roundName={roundName(m.roundIndex)}
                    venue={tournament?.venue}
                    highlightTeamId={team.id}
                  />
                ))}
              </div>
              <p className="text-[11px] text-ink-muted bg-ludo-mango/15 border border-ludo-mango/30 rounded-xl px-3.5 py-2.5 leading-relaxed">
                Be at your table a few minutes before kickoff. If the time or
                table changes you will get a notification and this page updates.
              </p>
            </section>
          )}

          {played.length > 0 && (
            <section aria-labelledby="played-h" className="space-y-3">
              <h2 id="played-h" className="text-sm font-bold text-ink">
                Played ({played.length})
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {played.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    teams={teams}
                    roundName={roundName(m.roundIndex)}
                    venue={tournament?.venue}
                    highlightTeamId={team.id}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
