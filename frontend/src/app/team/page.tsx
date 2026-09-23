import type { Metadata } from "next"
import Link from "next/link"
import {
  Trophy, Swords, Calendar, BarChart3, ChevronRight, Users, Bell,
} from "lucide-react"
import { MatchCard } from "@/components/cards/MatchCard"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { Panel } from "@/components/ui/Panel"
import {
  getSignedInTeam,
  getPlayersForTeam,
  getMatchesForTeam,
  getStandings,
  NOTIFICATIONS,
} from "@/lib/data"
import { getInitials } from "@/lib/utils"

export const metadata: Metadata = { title: "Home" }

export default function TeamHomePage() {
  const team = getSignedInTeam()
  const players = getPlayersForTeam(team.id)
  const matches = getMatchesForTeam(team.name)
  const rank = getStandings().findIndex((t) => t.id === team.id) + 1

  const nextMatch = matches.find((m) =>
    ["scheduled", "checkin", "ready"].includes(m.status),
  )
  const liveMatch = matches.find((m) => m.status === "live")
  const lastResult = matches.find((m) => m.status === "completed")
  const latest = NOTIFICATIONS[0]

  const stats = [
    { label: "Matches Played", value: team.played, icon: Swords, color: "text-ludo-red-ink", border: "border-t-ludo-red" },
    { label: "Wins", value: team.wins, icon: Trophy, color: "text-ludo-green-ink", border: "border-t-ludo-green" },
    { label: "Points", value: team.points, icon: BarChart3, color: "text-ludo-blue-ink", border: "border-t-ludo-blue" },
    { label: "Current Rank", value: `#${rank}`, icon: Trophy, color: "text-ludo-yellow-ink", border: "border-t-ludo-yellow" },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Welcome */}
      <div className="card-base overflow-hidden">
        <div className="relative p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-48 h-48 bg-ludo-red/5 rounded-full blur-3xl pointer-events-none"
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Welcome back
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
              {team.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <StatusBadge status={team.status} size="md" />
              <span className="text-xs text-ink-muted">Team Code: {team.code}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`card-base border-t-4 ${stat.border} p-4 text-center`}>
              <Icon aria-hidden="true" className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
              <dd className="text-xl font-extrabold text-ink tabular-nums">{stat.value}</dd>
              <dt className="text-[10px] font-medium text-ink-muted">{stat.label}</dt>
            </div>
          )
        })}
      </dl>

      {/* Live now */}
      {liveMatch && (
        <section aria-labelledby="team-live">
          <h2 id="team-live" className="flex items-center gap-2 text-sm font-bold text-ink mb-3">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ludo-red" />
            </span>
            Your match is live
          </h2>
          <MatchCard {...liveMatch} />
        </section>
      )}

      {/* Next match */}
      {nextMatch && (
        <section aria-labelledby="team-next">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 id="team-next" className="flex items-center gap-2 text-sm font-bold text-ink">
              <Calendar aria-hidden="true" className="w-4 h-4 text-ludo-blue-ink" />
              Next Match
            </h2>
            <Link
              href="/team/matches"
              className="text-[11px] font-semibold text-ludo-blue-ink hover:underline inline-flex items-center gap-0.5"
            >
              All matches <ChevronRight aria-hidden="true" className="w-3 h-3" />
            </Link>
          </div>
          <MatchCard {...nextMatch} />
        </section>
      )}

      {/* Last result */}
      {lastResult && (
        <section aria-labelledby="team-recent">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 id="team-recent" className="flex items-center gap-2 text-sm font-bold text-ink">
              <Trophy aria-hidden="true" className="w-4 h-4 text-ludo-green-ink" />
              Latest Result
            </h2>
            <Link
              href="/team/results"
              className="text-[11px] font-semibold text-ludo-green-ink hover:underline inline-flex items-center gap-0.5"
            >
              All results <ChevronRight aria-hidden="true" className="w-3 h-3" />
            </Link>
          </div>
          <MatchCard {...lastResult} />
        </section>
      )}

      {/* Roster */}
      <Panel
        title="Team Members"
        icon={<Users aria-hidden="true" className="w-4 h-4 text-ink-muted" />}
        flush
        action={
          <Link
            href="/team/profile"
            className="text-[11px] font-semibold text-ludo-red-ink hover:underline"
          >
            View profile
          </Link>
        }
      >
        <ul className="divide-y divide-border list-none">
          {players.map((player) => (
            <li key={player.id} className="px-4 py-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="w-9 h-9 shrink-0 rounded-full bg-ludo-red/10 flex items-center justify-center text-xs font-bold text-ludo-red-ink"
              >
                {getInitials(player.name)}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink truncate">
                    {player.name}
                  </span>
                  {player.role === "Captain" && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-ludo-yellow/15 text-ludo-yellow-ink border border-ludo-yellow/30 shrink-0">
                      Captain
                    </span>
                  )}
                </span>
                <span className="block text-[10px] text-ink-muted truncate">
                  {player.email}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* Latest update */}
      {latest && (
        <div className="card-base p-4 space-y-2 border-l-4 border-l-ludo-blue">
          <h2 className="flex items-center gap-2 text-xs font-bold text-ink">
            <Bell aria-hidden="true" className="w-4 h-4 text-ludo-blue-ink" />
            {latest.title}
          </h2>
          <p className="text-[11px] text-ink-muted leading-relaxed">{latest.body}</p>
          <Link
            href="/team/notifications"
            className="text-[11px] font-semibold text-ludo-blue-ink hover:underline inline-flex items-center gap-0.5"
          >
            All notifications <ChevronRight aria-hidden="true" className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
