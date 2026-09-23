"use client"

import { BarChart3, Trophy, ChevronUp, ChevronDown, Minus } from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { StatusBadge } from "@/components/cards/StatusBadge"

const STANDINGS = [
  { rank: 1, team: "Thunder Hawks", code: "TH", played: 4, wins: 4, losses: 0, points: 12, status: "qualified", trend: "up" },
  { rank: 2, team: "Phoenix Squad", code: "PS", played: 4, wins: 3, losses: 1, points: 9, status: "qualified", trend: "up" },
  { rank: 3, team: "Silver Wolves", code: "SW", played: 4, wins: 3, losses: 1, points: 9, status: "qualified", trend: "same" },
  { rank: 4, team: "Royal Knights", code: "RK", played: 4, wins: 2, losses: 2, points: 6, status: "qualified", trend: "down" },
  { rank: 5, team: "Golden Eagles", code: "GE", played: 4, wins: 2, losses: 2, points: 6, status: "active", trend: "up" },
  { rank: 6, team: "Iron Titans", code: "IT", played: 4, wins: 2, losses: 2, points: 6, status: "active", trend: "same" },
  { rank: 7, team: "Blue Dragons", code: "BD", played: 4, wins: 1, losses: 3, points: 3, status: "eliminated", trend: "down" },
  { rank: 8, team: "Storm Riders", code: "SR", played: 4, wins: 1, losses: 3, points: 3, status: "eliminated", trend: "down" },
]

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <ChevronUp className="w-4 h-4 text-ludo-green" />
  if (trend === "down") return <ChevronDown className="w-4 h-4 text-ludo-red" />
  return <Minus className="w-4 h-4 text-ink-faint" />
}

export default function StandingsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PlayoraHeader />

      <div className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-ludo-green" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Rankings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Standings</h1>
          <p className="text-xs text-ink-muted mt-1">Ludo Championship 2026 • Quarter Final Stage</p>
        </div>

        {/* Standings Table */}
        <div className="card-base overflow-hidden">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-[60px_1fr_60px_60px_60px_80px_80px_50px] gap-2 px-4 py-3 border-b border-border bg-ink-faint/5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            <span>Rank</span>
            <span>Team</span>
            <span className="text-center">P</span>
            <span className="text-center">W</span>
            <span className="text-center">L</span>
            <span className="text-center">Points</span>
            <span className="text-center">Status</span>
            <span className="text-center">Trend</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border">
            {STANDINGS.map((team) => (
              <div
                key={team.rank}
                className={`grid grid-cols-[60px_1fr_60px_60px_60px_80px_80px_50px] gap-2 px-4 py-3 items-center hover:bg-ink-faint/5 transition-colors ${
                  team.rank <= 3 ? "bg-ludo-green/3" : ""
                }`}
              >
                {/* Rank */}
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${
                  team.rank === 1
                    ? "bg-ludo-yellow/20 text-ludo-yellow-dark"
                    : team.rank === 2
                    ? "bg-ink-faint/15 text-ink-muted"
                    : team.rank === 3
                    ? "bg-ludo-red/10 text-ludo-red"
                    : "text-ink-faint"
                }`}>
                  {team.rank}
                </span>

                {/* Team */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-ludo-red/10 flex items-center justify-center text-[10px] font-bold text-ludo-red flex-shrink-0">
                    {team.code}
                  </div>
                  <span className="text-sm font-bold text-ink truncate">{team.team}</span>
                </div>

                {/* Stats */}
                <span className="text-center text-sm font-semibold text-ink-muted">{team.played}</span>
                <span className="text-center text-sm font-semibold text-ludo-green">{team.wins}</span>
                <span className="text-center text-sm font-semibold text-ludo-red">{team.losses}</span>
                <span className="text-center text-lg font-extrabold text-ink">{team.points}</span>

                {/* Status */}
                <div className="flex justify-center">
                  <StatusBadge status={team.status} />
                </div>

                {/* Trend */}
                <div className="flex justify-center">
                  <TrendIcon trend={team.trend} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-ink-muted">
          <span>P = Played</span>
          <span>W = Wins</span>
          <span>L = Losses</span>
          <span className="flex items-center gap-1"><ChevronUp className="w-3 h-3 text-ludo-green" /> Moving Up</span>
          <span className="flex items-center gap-1"><ChevronDown className="w-3 h-3 text-ludo-red" /> Moving Down</span>
        </div>
      </div>

      <PlayoraFooter />
    </main>
  )
}
