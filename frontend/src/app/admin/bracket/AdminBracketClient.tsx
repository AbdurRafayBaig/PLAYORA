"use client"

import Link from "next/link"
import { GitBranch, Shuffle } from "lucide-react"
import { AdminPage } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { BracketView } from "@/components/tournament/BracketView"
import { useTournament } from "@/lib/tournament/store"
import { isRoundComplete, roundSizes } from "@/lib/tournament/engine"

export function AdminBracketClient() {
  const { ready, tournament, teams, matches, advanceRound } = useTournament()

  if (!ready) {
    return (
      <AdminPage title="Bracket">
        <div className="skeleton h-64 rounded-2xl" />
      </AdminPage>
    )
  }

  if (!tournament || tournament.rounds.length === 0) {
    return (
      <AdminPage title="Bracket">
        <EmptyState
          icon={<GitBranch className="w-6 h-6" />}
          title="No bracket yet"
          description="The bracket is built when you draw the first round."
          action={
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ludo-flame-solid text-white text-xs font-semibold hover:bg-ludo-flame-solid-hover transition-colors"
            >
              Go to dashboard
            </Link>
          }
        />
      </AdminPage>
    )
  }

  const canAdvance =
    tournament.phase === "running" &&
    isRoundComplete(matches, tournament.currentRound)

  return (
    <AdminPage
      eyebrow="Run the tournament"
      title="Bracket"
      description={`${teams.length} teams · ${roundSizes(teams.length).join(" → ")}`}
      actions={
        <>
          <StatusBadge status={tournament.phase} size="md" />
          {canAdvance && (
            <Button variant="primary" onClick={advanceRound}>
              <Shuffle aria-hidden="true" className="w-3.5 h-3.5" />
              Advance round
            </Button>
          )}
        </>
      }
    >
      <BracketView
        rounds={tournament.rounds}
        matches={matches}
        teams={teams}
        currentRound={tournament.currentRound}
        championId={tournament.championId}
      />
      <p className="text-[11px] text-ink-faint lg:hidden">
        Swipe sideways to move through the rounds.
      </p>
    </AdminPage>
  )
}
