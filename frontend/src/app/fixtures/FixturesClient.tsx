"use client"

import { Calendar, Printer, Lock } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { PrintButton } from "@/components/ui/PrintButton"
import { MatchCard } from "@/components/tournament/MatchCard"
import { NoTournament } from "@/components/tournament/NoTournament"
import { EmptyState } from "@/components/ui/EmptyState"
import { useTournament } from "@/lib/tournament/store"
import { CONTACT } from "@/lib/constants"
import { pluralise } from "@/lib/utils"

export function FixturesClient() {
  const { ready, tournament, teams, matches } = useTournament()

  if (!ready) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    )
  }

  // Only published rounds are public. An unpublished round is still being
  // arranged, and half-assigned tables would send teams to the wrong place.
  const openRounds = (tournament?.rounds ?? []).filter((r) => r.published)
  const total = matches.filter((m) =>
    openRounds.some((r) => r.index === m.roundIndex),
  ).length

  return (
    <>
      <PageHeader
        eyebrow="Schedule"
        title="Fixtures"
        description={tournament ? `${tournament.name} · ${CONTACT.venue}` : undefined}
        icon={<Calendar aria-hidden="true" className="w-5 h-5 text-ludo-indigo-ink" />}
        actions={
          total > 0 ? (
            <PrintButton label="Print schedule">
              <Printer aria-hidden="true" className="w-3.5 h-3.5" />
              Print
            </PrintButton>
          ) : undefined
        }
      />

      {!tournament ? (
        <NoTournament />
      ) : openRounds.length === 0 ? (
        <EmptyState
          icon={<Lock className="w-6 h-6" />}
          title="No round published yet"
          description="The organiser publishes each round once every match in it has a table and a kickoff time. Nothing is shown here before then, so you never see a fixture that is about to change."
        />
      ) : (
        <div className="space-y-8">
          {openRounds.map((round) => {
            const inRound = matches.filter((m) => m.roundIndex === round.index)
            return (
              <section key={round.index} aria-labelledby={`fx-${round.index}`}>
                <h2
                  id={`fx-${round.index}`}
                  className="text-sm font-bold text-ink mb-3 flex items-center gap-2"
                >
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-ludo-indigo" />
                  {round.name}
                  <span className="text-[10px] font-medium text-ink-muted">
                    ({pluralise(inRound.length, "match", "matches")})
                  </span>
                </h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {inRound.map((m) => (
                    <MatchCard key={m.id} match={m} teams={teams} roundName={round.name}
                    venue={tournament?.venue} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}
