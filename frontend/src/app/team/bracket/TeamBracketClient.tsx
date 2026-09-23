"use client"

import { GitBranch } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { BracketView } from "@/components/tournament/BracketView"
import { EmptyState } from "@/components/ui/EmptyState"
import { useSignedInTeam, useTournament } from "@/lib/tournament/store"

export function TeamBracketClient() {
  const { ready, tournament, teams, matches } = useTournament()
  const team = useSignedInTeam()

  if (!ready) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    )
  }

  // TeamShell gates the whole portal, so `team` is present here. This
  // guard only narrows the type.
  if (!team) return null

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Knockout"
        title="Bracket"
        description="Your route to the final — your team is marked at every stage."
        icon={<GitBranch aria-hidden="true" className="w-5 h-5 text-ludo-orchid-ink" />}
      />

      {!tournament || tournament.rounds.length === 0 ? (
        <EmptyState
          icon={<GitBranch className="w-6 h-6" />}
          title="No bracket yet"
          description="The draw has not been made. Once it is, your path through the rounds shows up here."
        />
      ) : (
        <>
          <BracketView
            rounds={tournament.rounds}
            matches={matches}
            teams={teams}
            currentRound={tournament.currentRound}
            championId={tournament.championId}
            highlightTeamId={team.id}
          />
          <p className="text-[11px] text-ink-faint lg:hidden">
            Swipe sideways to move through the rounds.
          </p>
        </>
      )}
    </div>
  )
}
