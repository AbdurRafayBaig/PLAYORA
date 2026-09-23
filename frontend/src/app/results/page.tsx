"use client"

import { Trophy, Filter, ChevronDown } from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { MatchCard } from "@/components/cards/MatchCard"

const RESULTS = [
  { id: "R2-1", teamA: "Thunder Hawks", teamB: "Golden Eagles", status: "completed" as const, winner: "A" as const, venue: "Main Hall", table: "T1", time: "Today, 1:00 PM", round: "Round 2" },
  { id: "R2-2", teamA: "Phoenix Squad", teamB: "Blue Dragons", status: "completed" as const, winner: "A" as const, venue: "Main Hall", table: "T2", time: "Today, 1:00 PM", round: "Round 2" },
  { id: "R2-3", teamA: "Silver Wolves", teamB: "Storm Riders", status: "completed" as const, winner: "A" as const, venue: "Room 201", table: "T3", time: "Today, 11:00 AM", round: "Round 2" },
  { id: "R2-4", teamA: "Iron Titans", teamB: "Royal Knights", status: "completed" as const, winner: "B" as const, venue: "Room 201", table: "T4", time: "Today, 11:00 AM", round: "Round 2" },
  { id: "R1-1", teamA: "Thunder Hawks", teamB: "Blue Dragons", status: "completed" as const, winner: "A" as const, venue: "Main Hall", table: "T1", time: "Yesterday, 2:00 PM", round: "Round 1" },
  { id: "R1-2", teamA: "Golden Eagles", teamB: "Phoenix Squad", status: "completed" as const, winner: "B" as const, venue: "Main Hall", table: "T2", time: "Yesterday, 2:00 PM", round: "Round 1" },
]

export default function ResultsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PlayoraHeader />

      <div className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-ludo-green" />
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Completed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Results</h1>
            <p className="text-xs text-ink-muted mt-1">{RESULTS.length} completed matches</p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface-raised text-xs font-medium text-ink-muted hover:text-ink hover:bg-ink-faint/10 transition-colors cursor-pointer">
            <Filter className="w-3.5 h-3.5" /> Filter Round
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESULTS.map((match) => (
            <MatchCard key={match.id} {...match} />
          ))}
        </div>
      </div>

      <PlayoraFooter />
    </main>
  )
}
