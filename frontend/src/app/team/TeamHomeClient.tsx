"use client"

import Link from "next/link"
import {
  Trophy, Swords, Calendar, GitBranch, ChevronRight, Users, Bell, Crown, Eye,
} from "lucide-react"
import { MatchCard } from "@/components/tournament/MatchCard"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { Panel } from "@/components/ui/Panel"
import { EmptyState } from "@/components/ui/EmptyState"
import { useTournament, useSignedInTeam } from "@/lib/tournament/store"
import { initials } from "@/lib/tournament/engine"

export function TeamHomeClient() {
  const { ready, tournament, teams, matches, notices } = useTournament()
  const team = useSignedInTeam()

  if (!ready) {
    return (
      <div className="p-4 sm:p-6 space-y-4 max-w-4xl mx-auto">
        <div className="skeleton h-28 rounded-2xl" />
        <div className="skeleton h-24 rounded-2xl" />
      </div>
    )
  }

  // TeamShell gates the whole portal, so `team` is present here. This
  // guard only narrows the type.
  if (!team) return null

  const roundName = (i: number) => tournament?.rounds[i]?.name ?? `Round ${i + 1}`
  const published = new Set(
    (tournament?.rounds ?? []).filter((r) => r.published).map((r) => r.index),
  )
  const mine = matches.filter(
    (m) =>
      (m.teamAId === team.id || m.teamBId === team.id) && published.has(m.roundIndex),
  )

  const live = mine.find((m) => m.status === "live")
  const next = mine.find((m) => m.status === "scheduled" || m.status === "bye")
  const last = [...mine].reverse().find((m) => m.status === "completed")
  const unread = notices.filter((n) => n.teamId === team.id).slice(0, 1)

  const won = mine.filter((m) => m.winnerId === team.id).length
  const roundsDeep =
    team.eliminatedInRound !== null
      ? team.eliminatedInRound + 1
      : (tournament?.currentRound ?? 0) + 1

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Identity */}
      <div className="card-base overflow-hidden">
        <div className="relative p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-48 h-48 bg-ludo-orchid/10 rounded-full blur-3xl pointer-events-none"
          />
          <div className="relative flex items-center gap-4">
            <span
              aria-hidden="true"
              className="w-14 h-14 shrink-0 rounded-2xl bg-ludo-orchid/15 text-ludo-orchid-ink flex items-center justify-center text-lg font-extrabold"
            >
              {initials(team.name)}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Welcome back
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight truncate">
                {team.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {team.status === "champion" ? (
                  <StatusBadge status="champion" size="md" />
                ) : (
                  <StatusBadge status={team.status} size="md" />
                )}
                <span className="text-xs text-ink-muted font-mono">{team.code}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* A team can only watch — saying so once removes the question. */}
      <p className="text-[11px] text-ink-muted bg-ludo-indigo/8 border border-ludo-indigo/20 rounded-xl px-3.5 py-2.5 leading-relaxed flex items-start gap-2">
        <Eye aria-hidden="true" className="w-4 h-4 shrink-0 mt-px text-ludo-indigo-ink" />
        This portal is read-only. Fixtures, tables and results are set by the
        organiser — you will see each round here the moment it is published.
      </p>

      {team.status === "champion" && (
        <div className="card-base border-2 border-ludo-mango bg-ludo-mango/15 p-6 text-center">
          <Crown aria-hidden="true" className="w-10 h-10 mx-auto text-ludo-mango-ink" />
          <p className="text-lg font-extrabold text-ink mt-2">You won the tournament</p>
        </div>
      )}

      {/* Stats */}
      <dl className="grid grid-cols-3 gap-3">
        <div className="card-base border-t-4 border-t-ludo-flame p-4 text-center">
          <Swords aria-hidden="true" className="w-5 h-5 mx-auto mb-1.5 text-ludo-flame-ink" />
          <dd className="text-xl font-extrabold text-ink tabular-nums">{mine.length}</dd>
          <dt className="text-[10px] font-medium text-ink-muted">Matches</dt>
        </div>
        <div className="card-base border-t-4 border-t-ludo-lemon p-4 text-center">
          <Trophy aria-hidden="true" className="w-5 h-5 mx-auto mb-1.5 text-ludo-lemon-ink" />
          <dd className="text-xl font-extrabold text-ink tabular-nums">{won}</dd>
          <dt className="text-[10px] font-medium text-ink-muted">Won</dt>
        </div>
        <div className="card-base border-t-4 border-t-ludo-indigo p-4 text-center">
          <GitBranch aria-hidden="true" className="w-5 h-5 mx-auto mb-1.5 text-ludo-indigo-ink" />
          <dd className="text-xl font-extrabold text-ink tabular-nums">{roundsDeep}</dd>
          <dt className="text-[10px] font-medium text-ink-muted">Rounds deep</dt>
        </div>
      </dl>

      {live && (
        <section aria-labelledby="team-live">
          <h2 id="team-live" className="flex items-center gap-2 text-sm font-bold text-ink mb-3">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-flame opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ludo-flame" />
            </span>
            Your match is live
          </h2>
          <MatchCard
            match={live}
            teams={teams}
            roundName={roundName(live.roundIndex)}
            venue={tournament?.venue}
            highlightTeamId={team.id}
          />
        </section>
      )}

      {next && (
        <section aria-labelledby="team-next">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 id="team-next" className="flex items-center gap-2 text-sm font-bold text-ink">
              <Calendar aria-hidden="true" className="w-4 h-4 text-ludo-indigo-ink" />
              Next match
            </h2>
            <Link
              href="/team/matches"
              className="text-[11px] font-semibold text-ludo-indigo-ink hover:underline inline-flex items-center gap-0.5"
            >
              All matches <ChevronRight aria-hidden="true" className="w-3 h-3" />
            </Link>
          </div>
          <MatchCard
            match={next}
            teams={teams}
            roundName={roundName(next.roundIndex)}
            venue={tournament?.venue}
            highlightTeamId={team.id}
          />
        </section>
      )}

      {!live && !next && mine.length === 0 && (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          as="h3"
          title="No fixture published yet"
          description="Your first match appears the moment the organiser publishes the round. You will get a notification too."
        />
      )}

      {last && (
        <section aria-labelledby="team-last">
          <h2 id="team-last" className="flex items-center gap-2 text-sm font-bold text-ink mb-3">
            <Trophy aria-hidden="true" className="w-4 h-4 text-ludo-mango-ink" />
            Latest result
          </h2>
          <MatchCard
            match={last}
            teams={teams}
            roundName={roundName(last.roundIndex)}
            venue={tournament?.venue}
            highlightTeamId={team.id}
          />
        </section>
      )}

      <Panel
        title="Your players"
        icon={<Users aria-hidden="true" className="w-4 h-4 text-ink-muted" />}
        flush
        action={
          <Link href="/team/profile" className="text-[11px] font-semibold text-ludo-orchid-ink hover:underline">
            View
          </Link>
        }
      >
        {team.players.length === 0 ? (
          <p className="px-4 py-4 text-xs text-ink-muted">
            No players recorded. Ask the organiser to add them.
          </p>
        ) : (
          <ul className="divide-y divide-border list-none">
            {team.players.map((p) => (
              <li key={p.name} className="px-4 py-3 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-9 h-9 shrink-0 rounded-full bg-ludo-flame/10 text-ludo-flame-ink flex items-center justify-center text-xs font-bold"
                >
                  {initials(p.name)}
                </span>
                <span className="text-sm font-semibold text-ink truncate">{p.name}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {unread.length > 0 && (
        <div className="card-base p-4 space-y-2 border-l-4 border-l-ludo-indigo">
          <h2 className="flex items-center gap-2 text-xs font-bold text-ink">
            <Bell aria-hidden="true" className="w-4 h-4 text-ludo-indigo-ink" />
            {unread[0].title}
          </h2>
          <p className="text-[11px] text-ink-muted leading-relaxed">{unread[0].body}</p>
          <Link
            href="/team/notifications"
            className="text-[11px] font-semibold text-ludo-indigo-ink hover:underline inline-flex items-center gap-0.5"
          >
            All notifications <ChevronRight aria-hidden="true" className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
