"use client"

import {
  Users, UserCircle, Trophy, Radio, Calendar,
  Clock, ArrowUpRight, BarChart3, AlertTriangle, Bell,
  ChevronRight,
} from "lucide-react"
import { KPICard } from "@/components/cards/KPICard"
import { MatchCard } from "@/components/cards/MatchCard"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { BRAND } from "@/lib/constants"

/* ── Mock Dashboard Data ── */
const KPI_DATA = [
  { icon: <Users className="w-5 h-5" />, label: "Total Teams", value: 24, change: "+2 today", changeType: "positive" as const, accentColor: "red" as const },
  { icon: <UserCircle className="w-5 h-5" />, label: "Total Players", value: 48, accentColor: "yellow" as const },
  { icon: <Trophy className="w-5 h-5" />, label: "Matches Today", value: 6, change: "4 remaining", changeType: "neutral" as const, accentColor: "green" as const },
  { icon: <Radio className="w-5 h-5" />, label: "Live Now", value: 2, change: "active", changeType: "positive" as const, accentColor: "blue" as const },
]

const LIVE_MATCHES = [
  { id: "M001", teamA: "Thunder Hawks", teamB: "Storm Riders", status: "live" as const, venue: "Main Hall", table: "T1", time: "2:30 PM", round: "QF-1" },
  { id: "M002", teamA: "Phoenix Squad", teamB: "Royal Knights", status: "live" as const, venue: "Main Hall", table: "T2", time: "2:30 PM", round: "QF-2" },
]

const TODAY_FIXTURES = [
  { id: "M003", teamA: "Silver Wolves", teamB: "Golden Eagles", status: "scheduled" as const, venue: "Room 201", table: "T3", time: "3:30 PM", round: "QF-3" },
  { id: "M004", teamA: "Iron Titans", teamB: "Blue Dragons", status: "scheduled" as const, venue: "Room 201", table: "T4", time: "4:00 PM", round: "QF-4" },
]

const LEADERBOARD = [
  { rank: 1, team: "Thunder Hawks", played: 4, wins: 4, points: 12 },
  { rank: 2, team: "Phoenix Squad", played: 4, wins: 3, points: 9 },
  { rank: 3, team: "Silver Wolves", played: 4, wins: 3, points: 9 },
  { rank: 4, team: "Royal Knights", played: 4, wins: 2, points: 6 },
  { rank: 5, team: "Golden Eagles", played: 4, wins: 2, points: 6 },
]

const RECENT_ACTIONS = [
  { action: "Result submitted", detail: "Match M-038: Thunder Hawks won", time: "2 min ago", color: "text-ludo-green" },
  { action: "Team imported", detail: "3 new teams via CSV", time: "15 min ago", color: "text-ludo-blue" },
  { action: "Fixture generated", detail: "Quarter Final round created", time: "1 hour ago", color: "text-ludo-yellow" },
  { action: "Override applied", detail: "Match M-034 result corrected", time: "2 hours ago", color: "text-ludo-red" },
]

export default function AdminDashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-ink tracking-tight">Dashboard</h1>
            <StatusBadge status="active" size="md" />
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            {BRAND.name} • Ludo Championship 2026 • Quarter Finals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-ink-faint/10 transition-colors cursor-pointer">
            <Bell className="w-4 h-4 text-ink-muted" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ludo-red text-white text-[9px] font-bold flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPI_DATA.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Matches + Today's Fixtures */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Matches */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ludo-red" />
                </span>
                <h2 className="text-sm font-bold text-ink">Live Matches</h2>
              </div>
              <button className="text-xs font-semibold text-ludo-red hover:underline inline-flex items-center gap-0.5 cursor-pointer">
                Manage <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LIVE_MATCHES.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </div>

          {/* Today's Fixtures */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ludo-blue" />
                <h2 className="text-sm font-bold text-ink">Today&apos;s Fixtures</h2>
              </div>
              <button className="text-xs font-semibold text-ludo-blue hover:underline inline-flex items-center gap-0.5 cursor-pointer">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TODAY_FIXTURES.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Leaderboard + Recent Actions */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="card-base overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-ludo-green" />
                <h3 className="text-sm font-bold text-ink">Leaderboard</h3>
              </div>
              <button className="text-[11px] font-semibold text-ludo-green hover:underline cursor-pointer">
                Full View
              </button>
            </div>
            <div className="divide-y divide-border">
              {LEADERBOARD.map((team) => (
                <div
                  key={team.rank}
                  className="px-4 py-2.5 flex items-center gap-3 hover:bg-ink-faint/5 transition-colors"
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                    team.rank === 1
                      ? "bg-ludo-yellow/20 text-ludo-yellow-dark"
                      : team.rank === 2
                      ? "bg-ink-faint/15 text-ink-muted"
                      : team.rank === 3
                      ? "bg-ludo-red/10 text-ludo-red"
                      : "bg-ink-faint/8 text-ink-faint"
                  }`}>
                    {team.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink truncate">{team.team}</p>
                    <p className="text-[10px] text-ink-muted">
                      P:{team.played} W:{team.wins}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-ink">{team.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Admin Actions */}
          <div className="card-base overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-ink-muted" />
                <h3 className="text-sm font-bold text-ink">Recent Actions</h3>
              </div>
            </div>
            <div className="divide-y divide-border">
              {RECENT_ACTIONS.map((item, i) => (
                <div key={i} className="px-4 py-2.5 space-y-0.5 hover:bg-ink-faint/5 transition-colors">
                  <p className={`text-xs font-semibold ${item.color}`}>{item.action}</p>
                  <p className="text-[10px] text-ink-muted">{item.detail}</p>
                  <p className="text-[10px] text-ink-faint">{item.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Alerts */}
          <div className="card-base p-4 space-y-2 border-l-4 border-l-ludo-yellow">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-ludo-yellow" />
              <h3 className="text-xs font-bold text-ink">Attention</h3>
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              25 teams in next round — odd number detected. Configure bye/advancement before generating Semi-Final fixtures.
            </p>
            <button className="text-[11px] font-semibold text-ludo-yellow hover:underline inline-flex items-center gap-0.5 cursor-pointer">
              Configure Now <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
