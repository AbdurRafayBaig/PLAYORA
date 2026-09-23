"use client"

import Link from "next/link"
import {
  Radio, Play, Trophy, Grid2x2, Clock, Shuffle, Lock, Undo2, TriangleAlert,
} from "lucide-react"
import { AdminPage } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { useTournament } from "@/lib/tournament/store"
import {
  elapsedSince,
  formatKickoff,
  initials,
  isRoundComplete,
  undoBlockedReason,
} from "@/lib/tournament/engine"
import { cn } from "@/lib/utils"
import { useNow } from "@/lib/useNow"
import type { Match } from "@/lib/tournament/types"

function Elapsed({ startedAt }: { startedAt: string | null }) {
  const now = useNow()
  return (
    <span className="tabular-nums">
      {now === null ? "—" : elapsedSince(startedAt, now)}
    </span>
  )
}

/**
 * Referee control for one match.
 *
 * Sized for one-handed use standing next to a table: every control clears
 * 44px and the two team buttons are the full width of the card, so there is
 * no ambiguity about which team you are declaring the winner.
 */
function ScorerCard({ match }: { match: Match }) {
  const { teams, matches, startMatch, recordWinner, undoResult, tournament } =
    useTournament()
  const nameOf = (id: string | null) =>
    id ? (teams.find((t) => t.id === id)?.name ?? "Unknown") : "Bye"

  const roundName = tournament?.rounds[match.roundIndex]?.name ?? ""
  const isLive = match.status === "live"

  return (
    <div
      className={cn(
        "card-base p-4 space-y-4",
        isLive && "ring-2 ring-ludo-flame/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-ink">{roundName}</p>
          <p className="text-[11px] text-ink-muted flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
            <span className="inline-flex items-center gap-1">
              <Grid2x2 aria-hidden="true" className="w-3 h-3" />
              Table {match.table || "—"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="w-3 h-3" />
              {isLive ? <Elapsed startedAt={match.startedAt} /> : formatKickoff(match.startsAt)}
            </span>
          </p>
        </div>
        <StatusBadge status={match.status} size="md" />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0 text-center">
          <span
            aria-hidden="true"
            className="w-10 h-10 mx-auto mb-1 rounded-xl bg-ludo-flame/10 text-ludo-flame-ink flex items-center justify-center text-xs font-bold"
          >
            {initials(nameOf(match.teamAId))}
          </span>
          <p className="text-xs font-bold text-ink truncate">{nameOf(match.teamAId)}</p>
        </div>
        <span className="text-[10px] font-bold text-ink-faint">VS</span>
        <div className="min-w-0 text-center">
          <span
            aria-hidden="true"
            className="w-10 h-10 mx-auto mb-1 rounded-xl bg-ludo-indigo/10 text-ludo-indigo-ink flex items-center justify-center text-xs font-bold"
          >
            {initials(nameOf(match.teamBId))}
          </span>
          <p className="text-xs font-bold text-ink truncate">{nameOf(match.teamBId)}</p>
        </div>
      </div>

      <div className="pt-1 border-t border-border">
        {match.status === "scheduled" && (
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => startMatch(match.id)}
          >
            <Play aria-hidden="true" className="w-4 h-4" />
            Start match — go live
          </Button>
        )}

        {isLive && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-ink-muted text-center">
              Who won?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                size="md"
                onClick={() => match.teamAId && recordWinner(match.id, match.teamAId)}
              >
                <Trophy aria-hidden="true" className="w-4 h-4" />
                <span className="truncate">{nameOf(match.teamAId)}</span>
              </Button>
              <Button
                size="md"
                onClick={() => match.teamBId && recordWinner(match.id, match.teamBId)}
              >
                <Trophy aria-hidden="true" className="w-4 h-4" />
                <span className="truncate">{nameOf(match.teamBId)}</span>
              </Button>
            </div>
          </div>
        )}

        {match.status === "completed" && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-ludo-lemon-ink text-center flex items-center justify-center gap-1.5">
              <Trophy aria-hidden="true" className="w-4 h-4" />
              {nameOf(match.winnerId)} advanced
            </p>
            {/* Referees mis-tap. Without this the only remedy was wiping the
                tournament, so the escape hatch sits next to the mistake. */}
            {undoBlockedReason(matches, match.id) === null ? (
              <Button
                size="md"
                className="w-full"
                onClick={() => undoResult(match.id)}
              >
                <Undo2 aria-hidden="true" className="w-4 h-4" />
                Undo this result
              </Button>
            ) : (
              <p className="text-[11px] text-ink-faint text-center leading-relaxed">
                {undoBlockedReason(matches, match.id)}
              </p>
            )}
          </div>
        )}

        {match.status === "unscheduled" && (
          <p className="text-[11px] text-ink-muted text-center flex items-center justify-center gap-1.5">
            <Lock aria-hidden="true" className="w-3.5 h-3.5" />
            Assign a table and kickoff time first
          </p>
        )}
      </div>
    </div>
  )
}

export function LiveAdminClient() {
  const { ready, tournament, matches, advanceRound, revertLastAdvance } =
    useTournament()

  if (!ready) {
    return (
      <AdminPage title="Live Control">
        <div className="skeleton h-40 rounded-2xl" />
      </AdminPage>
    )
  }

  if (!tournament || tournament.phase === "setup") {
    return (
      <AdminPage title="Live Control">
        <EmptyState
          icon={<Radio className="w-6 h-6" />}
          title="Nothing to run yet"
          description="Draw the first round from the dashboard, assign tables and times, then publish it. Matches become startable here."
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

  const round = tournament.rounds[tournament.currentRound]
  const inRound = matches.filter(
    (m) => m.roundIndex === tournament.currentRound && m.status !== "bye",
  )
  const roundDone = isRoundComplete(matches, tournament.currentRound)

  return (
    <AdminPage
      eyebrow="Run the tournament"
      title="Live Control"
      description={`${round?.name ?? ""} · ${tournament.venue}`}
      actions={<StatusBadge status={round?.published ? "published" : "draft"} size="md" />}
    >
      {!round?.published && (
        <p className="text-[11px] text-ludo-mango-ink bg-ludo-mango/15 border border-ludo-mango/30 rounded-xl px-3.5 py-2.5 leading-relaxed">
          This round is not published yet. You can still start matches, but the
          teams have not been told when or where they are playing — publish it
          from Fixtures first.
        </p>
      )}

      {roundDone && (
        <div className="card-base border-l-4 border-l-ludo-lemon p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-ink">{round?.name} is finished</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Every result is recorded. Advance to draw the next round from the
              winners.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={advanceRound}>
            <Shuffle aria-hidden="true" className="w-4 h-4" />
            Advance
          </Button>
        </div>
      )}

      {/* Stepping back a whole round is the remedy once a result has already
          been built on. Destructive, so it is separated and explained. */}
      {(tournament.currentRound > 0 || tournament.phase === "complete") && (
        <details className="card-base p-4">
          <summary className="text-xs font-bold text-ink cursor-pointer flex items-center gap-2">
            <TriangleAlert aria-hidden="true" className="w-4 h-4 text-ludo-mango-ink" />
            Something went wrong in an earlier round?
          </summary>
          <p className="text-[11px] text-ink-muted leading-relaxed mt-2 max-w-lg">
            Stepping back deletes{" "}
            {tournament.phase === "complete"
              ? "the champion and reopens the final"
              : `the ${round?.name ?? "current round"} draw and returns to the previous round`}
            , so a result recorded in error can be corrected. Fixtures for the
            deleted round are unpublished and will need reassigning.
          </p>
          <Button variant="danger" className="mt-3" onClick={revertLastAdvance}>
            <Undo2 aria-hidden="true" className="w-3.5 h-3.5" />
            Step back a round
          </Button>
        </details>
      )}

      {inRound.length === 0 ? (
        <EmptyState
          icon={<Radio className="w-6 h-6" />}
          title="No matches in this round"
          description="Every team in this round received a bye."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {inRound.map((m) => (
            <ScorerCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </AdminPage>
  )
}
