"use client"

import { Trophy, Printer } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { PrintButton } from "@/components/ui/PrintButton"
import { MatchCard } from "@/components/tournament/MatchCard"
import { NoTournament } from "@/components/tournament/NoTournament"
import { EmptyState } from "@/components/ui/EmptyState"
import { useTournament } from "@/lib/tournament/store"
import { roundLabel } from "@/lib/tournament/engine"
import { pluralise } from "@/lib/utils"

export function ResultsClient() {
  const { ready, tournament, teams, matches } = useTournament()

  if (!ready) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    )
  }

  const done = matches.filter((m) => m.status === "completed")
  const roundName = (i: number) => {
    const r = tournament?.rounds[i]
    return r ? roundLabel(r) : `Round ${i + 1}`
  }

  // Newest round first — the thing people come back to check.
  const byRound = [...new Set(done.map((m) => m.roundIndex))].sort((a, b) => b - a)

  return (
    <>
      <PageHeader
        eyebrow="Completed"
        title="Results"
        description={`${pluralise(done.length, "match", "matches")} played`}
        icon={<Trophy aria-hidden="true" className="w-5 h-5 text-ludo-mango-ink" />}
        actions={
          done.length > 0 ? (
            <PrintButton label="Print results">
              <Printer aria-hidden="true" className="w-3.5 h-3.5" />
              Print
            </PrintButton>
          ) : undefined
        }
      />

      {!tournament ? (
        <NoTournament what="results" />
      ) : done.length === 0 ? (
        <EmptyState
          icon={<Trophy className="w-6 h-6" />}
          title="No results yet"
          description="A match appears here once the referee records which team advanced."
        />
      ) : (
        <div className="space-y-8">
          {byRound.map((index) => (
            <section key={index} aria-labelledby={`res-${index}`}>
              <h2
                id={`res-${index}`}
                className="text-sm font-bold text-ink mb-3 flex items-center gap-2"
              >
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-ludo-mango" />
                {roundName(index)}
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {done
                  .filter((m) => m.roundIndex === index)
                  .map((m) => (
                    <MatchCard key={m.id} match={m} teams={teams} roundName={roundName(index)}
                    venue={tournament?.venue} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
