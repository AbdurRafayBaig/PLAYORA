"use client"

import { GitBranch, Users, Crown, Swords } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { BracketView } from "@/components/tournament/BracketView"
import { NoTournament } from "@/components/tournament/NoTournament"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { useTournament } from "@/lib/tournament/store"
import { roundSizes } from "@/lib/tournament/engine"
import { CONTACT } from "@/lib/constants"

export function BracketClient() {
  const { ready, tournament, teams, matches } = useTournament()

  if (!ready) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    )
  }

  if (!tournament || tournament.rounds.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow="Knockout"
          title="Bracket"
          icon={<GitBranch aria-hidden="true" className="w-5 h-5 text-ludo-orchid-ink" />}
        />
        <NoTournament what="bracket rounds" />
      </>
    )
  }

  const stillIn = teams.filter((t) => t.status !== "eliminated").length
  const out = teams.length - stillIn
  const path = roundSizes(teams.length).join(" → ")

  return (
    <>
      <PageHeader
        eyebrow="Knockout"
        title="Bracket"
        description={`${tournament.name} · ${CONTACT.venue}`}
        icon={<GitBranch aria-hidden="true" className="w-5 h-5 text-ludo-orchid-ink" />}
        actions={<StatusBadge status={tournament.phase} size="md" />}
      />

      {/* Why there is no points table, stated once where people look for one. */}
      <div className="card-base p-4 mb-6 flex items-start gap-3 border-l-4 border-l-ludo-indigo">
        <Swords aria-hidden="true" className="w-5 h-5 text-ludo-indigo-ink shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-bold text-ink">Straight knockout — no points table</h2>
          <p className="text-xs text-ink-muted leading-relaxed mt-0.5">
            Lose once and you are out, so there is nothing to rank on points:
            every surviving team has won every match it played. Progress is
            measured by how far through the draw you get.
            {" "}
            <span className="text-ink font-semibold">{path}</span>
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3 mb-6">
        <div className="card-base border-t-4 border-t-ludo-lemon p-4 text-center">
          <Users aria-hidden="true" className="w-5 h-5 mx-auto mb-1.5 text-ludo-lemon-ink" />
          <dd className="text-xl font-extrabold text-ink tabular-nums">{stillIn}</dd>
          <dt className="text-[10px] font-medium text-ink-muted">Still in</dt>
        </div>
        <div className="card-base border-t-4 border-t-ink-faint p-4 text-center">
          <Users aria-hidden="true" className="w-5 h-5 mx-auto mb-1.5 text-ink-muted" />
          <dd className="text-xl font-extrabold text-ink tabular-nums">{out}</dd>
          <dt className="text-[10px] font-medium text-ink-muted">Knocked out</dt>
        </div>
        <div className="card-base border-t-4 border-t-ludo-mango p-4 text-center">
          <Crown aria-hidden="true" className="w-5 h-5 mx-auto mb-1.5 text-ludo-mango-ink" />
          <dd className="text-xl font-extrabold text-ink tabular-nums">
            {tournament.rounds.length}
          </dd>
          <dt className="text-[10px] font-medium text-ink-muted">Rounds to win</dt>
        </div>
      </dl>

      <BracketView
        rounds={tournament.rounds}
        matches={matches}
        teams={teams}
        currentRound={tournament.currentRound}
        championId={tournament.championId}
      />

      <p className="mt-3 text-[11px] text-ink-faint lg:hidden">
        Swipe sideways to move through the rounds.
      </p>
    </>
  )
}
