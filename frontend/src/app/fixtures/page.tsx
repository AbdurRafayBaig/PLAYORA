"use client"

import { Calendar, Filter, ChevronDown } from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { MatchCard } from "@/components/cards/MatchCard"

const FIXTURES = [
  { round: "Quarter Final", matches: [
    { id: "QF1", teamA: "Thunder Hawks", teamB: "Storm Riders", status: "live" as const, venue: "Main Hall", table: "T1", time: "2:30 PM", round: "QF-1" },
    { id: "QF2", teamA: "Phoenix Squad", teamB: "Royal Knights", status: "live" as const, venue: "Main Hall", table: "T2", time: "2:30 PM", round: "QF-2" },
    { id: "QF3", teamA: "Silver Wolves", teamB: "Golden Eagles", status: "scheduled" as const, venue: "Room 201", table: "T3", time: "3:30 PM", round: "QF-3" },
    { id: "QF4", teamA: "Iron Titans", teamB: "Blue Dragons", status: "scheduled" as const, venue: "Room 201", table: "T4", time: "4:00 PM", round: "QF-4" },
  ]},
  { round: "Round 2 (Completed)", matches: [
    { id: "R2-1", teamA: "Thunder Hawks", teamB: "Golden Eagles", status: "completed" as const, winner: "A" as const, venue: "Main Hall", table: "T1", time: "11:00 AM", round: "R2-1" },
    { id: "R2-2", teamA: "Phoenix Squad", teamB: "Blue Dragons", status: "completed" as const, winner: "A" as const, venue: "Main Hall", table: "T2", time: "11:00 AM", round: "R2-2" },
  ]},
]

export default function FixturesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PlayoraHeader />

      <div className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-ludo-blue" />
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Fixtures</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface-raised text-xs font-medium text-ink-muted hover:text-ink hover:bg-ink-faint/10 transition-colors cursor-pointer">
              <Filter className="w-3.5 h-3.5" /> Filter Round
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Rounds */}
        <div className="space-y-8">
          {FIXTURES.map((round) => (
            <section key={round.round}>
              <h2 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-ludo-blue" />
                {round.round}
                <span className="text-[10px] font-medium text-ink-muted">
                  ({round.matches.length} matches)
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {round.matches.map((match) => (
                  <MatchCard key={match.id} {...match} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <PlayoraFooter />
    </main>
  )
}
