import type { Metadata } from "next"
import Link from "next/link"
import {
  Users, UserCircle, Trophy, Radio, Calendar,
  Clock, ArrowUpRight, BarChart3, AlertTriangle, Bell,
  ChevronRight,
} from "lucide-react"
import { KPICard } from "@/components/cards/KPICard"
import { MatchCard } from "@/components/cards/MatchCard"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { Panel } from "@/components/ui/Panel"
import { AdminPage } from "@/components/ui/AdminPage"
import { cn } from "@/lib/utils"
import {
  AUDIT_LOG,
  DISPUTES,
  getLiveMatches,
  getStandings,
  getTournamentStats,
  getUpcomingMatches,
  TOURNAMENT,
} from "@/lib/data"

export const metadata: Metadata = { title: "Dashboard" }

const severityColor = {
  info: "text-ludo-blue-ink",
  warning: "text-ludo-yellow-ink",
  critical: "text-ludo-red-ink",
} as const

export default function AdminDashboardPage() {
  const stats = getTournamentStats()
  const liveMatches = getLiveMatches()
  const upcoming = getUpcomingMatches().filter((m) => m.day === "Today").slice(0, 2)
  const leaderboard = getStandings().slice(0, 5)
  const openDisputes = DISPUTES.filter((d) => d.status === "open" || d.status === "reviewing")

  const kpis = [
    { icon: <Users className="w-5 h-5" />, label: "Total Teams", value: stats.teams, change: "+2 today", changeType: "positive" as const, accentColor: "red" as const },
    { icon: <UserCircle className="w-5 h-5" />, label: "Total Players", value: stats.players, accentColor: "yellow" as const },
    { icon: <Trophy className="w-5 h-5" />, label: "Matches Today", value: stats.matchesToday, change: `${stats.upcoming} remaining`, changeType: "neutral" as const, accentColor: "green" as const },
    { icon: <Radio className="w-5 h-5" />, label: "Live Now", value: stats.liveNow, change: "active", changeType: "positive" as const, accentColor: "blue" as const },
  ]

  return (
    <AdminPage
      title="Dashboard"
      description={`${TOURNAMENT.name} · ${TOURNAMENT.stage}`}
      actions={
        <>
          <span className="hidden lg:inline-flex">
            <StatusBadge status={TOURNAMENT.status} size="md" />
          </span>
          <ThemeToggle className="hidden lg:flex" />
          <Link
            href="/admin/announcements"
            className="relative w-11 h-11 flex items-center justify-center rounded-xl border border-border text-ink hover:bg-ink-faint/10 transition-colors"
            aria-label={`Announcements, ${openDisputes.length} items need attention`}
          >
            <Bell aria-hidden="true" className="w-4 h-4 text-ink-muted" />
            <span
              aria-hidden="true"
              className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-ludo-red text-white text-[9px] font-bold flex items-center justify-center"
            >
              {openDisputes.length}
            </span>
          </Link>
        </>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matches */}
        <div className="lg:col-span-2 space-y-6">
          <section aria-labelledby="admin-live">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 id="admin-live" className="flex items-center gap-2 text-sm font-bold text-ink">
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ludo-red" />
                </span>
                Live Matches
              </h2>
              <Link
                href="/admin/live"
                className="text-xs font-semibold text-ludo-red-ink hover:underline inline-flex items-center gap-0.5"
              >
                Manage <ChevronRight aria-hidden="true" className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </section>

          <section aria-labelledby="admin-today">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 id="admin-today" className="flex items-center gap-2 text-sm font-bold text-ink">
                <Calendar aria-hidden="true" className="w-4 h-4 text-ludo-blue-ink" />
                Today&apos;s Fixtures
              </h2>
              <Link
                href="/admin/fixtures"
                className="text-xs font-semibold text-ludo-blue-ink hover:underline inline-flex items-center gap-0.5"
              >
                View all <ChevronRight aria-hidden="true" className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {upcoming.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </section>
        </div>

        {/* Side rail */}
        <div className="space-y-6">
          <Panel
            title="Leaderboard"
            icon={<BarChart3 aria-hidden="true" className="w-4 h-4 text-ludo-green-ink" />}
            flush
            action={
              <Link
                href="/admin/standings"
                className="text-[11px] font-semibold text-ludo-green-ink hover:underline"
              >
                Full view
              </Link>
            }
          >
            <ol className="divide-y divide-border list-none">
              {leaderboard.map((team, i) => (
                <li
                  key={team.id}
                  className="px-4 py-2.5 flex items-center gap-3 transition-colors hover:bg-ink-faint/5"
                >
                  <span
                    className={cn(
                      "w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-extrabold",
                      i === 0
                        ? "bg-ludo-yellow/20 text-ludo-yellow-ink"
                        : i === 1
                          ? "bg-ink-faint/15 text-ink-muted"
                          : i === 2
                            ? "bg-ludo-red/10 text-ludo-red-ink"
                            : "bg-ink-faint/10 text-ink-faint",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-ink truncate">
                      {team.name}
                    </span>
                    <span className="block text-[10px] text-ink-muted">
                      Played {team.played} · Won {team.wins}
                    </span>
                  </span>
                  <span className="text-sm font-extrabold text-ink tabular-nums">
                    {team.points}
                  </span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel
            title="Recent Actions"
            icon={<Clock aria-hidden="true" className="w-4 h-4 text-ink-muted" />}
            flush
            action={
              <Link
                href="/admin/audit"
                className="text-[11px] font-semibold text-ink-muted hover:underline"
              >
                Audit log
              </Link>
            }
          >
            <ul className="divide-y divide-border list-none">
              {AUDIT_LOG.slice(0, 4).map((entry) => (
                <li key={entry.id} className="px-4 py-2.5 space-y-0.5">
                  <p className={cn("text-xs font-semibold", severityColor[entry.severity])}>
                    {entry.action}
                  </p>
                  <p className="text-[10px] text-ink-muted">{entry.target}</p>
                  <p className="text-[10px] text-ink-faint">
                    {entry.actor} · {entry.at}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="card-base p-4 space-y-2 border-l-4 border-l-ludo-yellow">
            <h2 className="flex items-center gap-2 text-xs font-bold text-ink">
              <AlertTriangle aria-hidden="true" className="w-4 h-4 text-ludo-yellow-ink" />
              Attention
            </h2>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              An odd number of teams advances to the next round. Configure the
              bye or advancement rule before generating Semi-Final fixtures.
            </p>
            <Link
              href="/admin/fixtures"
              className="text-[11px] font-semibold text-ludo-yellow-ink hover:underline inline-flex items-center gap-0.5"
            >
              Configure now <ArrowUpRight aria-hidden="true" className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </AdminPage>
  )
}
