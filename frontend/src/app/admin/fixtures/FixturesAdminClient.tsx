"use client"

import Link from "next/link"
import { Calendar, Send, CircleAlert, Lock, CheckCircle2 } from "lucide-react"
import { AdminPage } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { useTournament } from "@/lib/tournament/store"
import { isRoundFullyScheduled, initials } from "@/lib/tournament/engine"
import { cn } from "@/lib/utils"
import type { Match, Round } from "@/lib/tournament/types"

/** Turns an ISO string into the value a datetime-local input wants. */
function toLocalInput(iso: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function MatchAssignRow({ match, round }: { match: Match; round: Round }) {
  const published = round.published
  const { teams, scheduleMatch } = useTournament()
  const nameOf = (id: string | null) =>
    id ? (teams.find((t) => t.id === id)?.name ?? "Unknown") : "Bye"

  if (match.status === "bye") {
    return (
      <li className="px-4 py-3 flex items-center gap-3 bg-ludo-mango/10">
        <span
          aria-hidden="true"
          className="w-8 h-8 shrink-0 rounded-lg bg-ludo-mango/30 text-ludo-mango-ink flex items-center justify-center text-[10px] font-bold"
        >
          {initials(nameOf(match.teamAId))}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-ink truncate">
            {nameOf(match.teamAId)}
          </span>
          <span className="block text-[11px] text-ink-muted">
            Odd round — advances without playing. Nothing to schedule.
          </span>
        </span>
        <StatusBadge status="bye" />
      </li>
    )
  }

  const assigned = match.table !== "" && match.startsAt !== ""
  const editable = match.status === "unscheduled" || match.status === "scheduled"

  return (
    <li className="px-4 py-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-ink min-w-0 flex-1 truncate">
          {nameOf(match.teamAId)}
        </span>
        <span className="text-[10px] font-bold text-ink-faint shrink-0">vs</span>
        <span className="text-sm font-bold text-ink min-w-0 flex-1 truncate text-right">
          {nameOf(match.teamBId)}
        </span>
        <StatusBadge status={match.status} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor={`${match.id}-table`}
            className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted"
          >
            Table
          </label>
          <input
            id={`${match.id}-table`}
            value={match.table}
            disabled={!editable}
            onChange={(e) => scheduleMatch(match.id, { table: e.target.value })}
            placeholder="e.g. T1"
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ludo-flame/40 disabled:opacity-60"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor={`${match.id}-time`}
            className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted"
          >
            Kickoff
          </label>
          <input
            id={`${match.id}-time`}
            type="datetime-local"
            value={toLocalInput(match.startsAt)}
            disabled={!editable}
            onChange={(e) =>
              scheduleMatch(match.id, {
                startsAt: e.target.value ? new Date(e.target.value).toISOString() : "",
              })
            }
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ludo-flame/40 disabled:opacity-60"
          />
        </div>
      </div>

      {!assigned && editable && (
        <p className="text-[11px] text-ludo-flame-ink flex items-center gap-1.5">
          <CircleAlert aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
          Needs both a table and a kickoff time before the round can be published.
        </p>
      )}

      {published && editable && (
        <p className="text-[11px] text-ink-muted flex items-start gap-1.5">
          <CircleAlert aria-hidden="true" className="w-3.5 h-3.5 shrink-0 mt-px" />
          Teams have been told where and when to be. You can change these, and
          both teams are notified — but they cannot be left empty.
        </p>
      )}
      <span className="sr-only">{round.name}</span>
    </li>
  )
}

export function FixturesAdminClient() {
  const { ready, tournament, matches, publishRound } = useTournament()

  if (!ready) {
    return (
      <AdminPage title="Fixtures">
        <div className="skeleton h-40 rounded-2xl" />
      </AdminPage>
    )
  }

  if (!tournament || tournament.rounds.length === 0) {
    return (
      <AdminPage title="Fixtures">
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title="No draw yet"
          description="Register the teams and draw the first round from the dashboard. Fixtures appear here once there is a bracket to schedule."
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

  // Only rounds that have actually been drawn can be scheduled.
  const drawn = tournament.rounds.filter((r) =>
    matches.some((m) => m.roundIndex === r.index),
  )

  return (
    <AdminPage
      eyebrow="Run the tournament"
      title="Fixtures"
      description="Give every match a table and a kickoff time, then publish the round to notify the teams."
    >
      <p className="text-[11px] text-ink-muted bg-ludo-indigo/8 border border-ludo-indigo/20 rounded-xl px-3.5 py-2.5 leading-relaxed">
        Nothing here is visible to teams until you publish. That is deliberate —
        a half-assigned round would send captains to the wrong table.
      </p>

      {drawn.map((round) => {
        const inRound = matches.filter((m) => m.roundIndex === round.index)
        const complete = isRoundFullyScheduled(matches, round.index)

        return (
          <section key={round.index} className="card-base overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                  {round.name}
                  <StatusBadge status={round.published ? "published" : "draft"} />
                </h2>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  {inRound.length} matches · {round.size} teams
                </p>
              </div>

              {round.published ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ludo-lemon-ink">
                  <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" />
                  Teams notified
                </span>
              ) : (
                <Button
                  variant="primary"
                  disabled={!complete}
                  onClick={() => publishRound(round.index)}
                  title={
                    complete
                      ? undefined
                      : "Assign a table and time to every match first"
                  }
                >
                  {complete ? (
                    <Send aria-hidden="true" className="w-3.5 h-3.5" />
                  ) : (
                    <Lock aria-hidden="true" className="w-3.5 h-3.5" />
                  )}
                  Publish &amp; notify
                </Button>
              )}
            </div>

            <ul className={cn("divide-y divide-border list-none")}>
              {inRound.map((m) => (
                <MatchAssignRow key={m.id} match={m} round={round} />
              ))}
            </ul>
          </section>
        )
      })}
    </AdminPage>
  )
}
