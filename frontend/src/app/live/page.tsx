"use client"

import { Radio } from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { MatchCard } from "@/components/cards/MatchCard"

const LIVE_MATCHES = [
  { id: "QF1", teamA: "Thunder Hawks", teamB: "Storm Riders", status: "live" as const, venue: "Main Hall", table: "T1", time: "2:30 PM", round: "Quarter Final 1" },
  { id: "QF2", teamA: "Phoenix Squad", teamB: "Royal Knights", status: "live" as const, venue: "Main Hall", table: "T2", time: "2:30 PM", round: "Quarter Final 2" },
]

export default function LivePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PlayoraHeader />

      <div className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-ludo-red" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-ludo-red">Live Now</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Live Matches</h1>
          <p className="text-xs text-ink-muted mt-1">
            {LIVE_MATCHES.length} match{LIVE_MATCHES.length !== 1 ? "es" : ""} currently in progress
          </p>
        </div>

        {/* Live Matches */}
        {LIVE_MATCHES.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LIVE_MATCHES.map((match) => (
              <MatchCard key={match.id} {...match} />
            ))}
          </div>
        ) : (
          <div className="card-base p-12 text-center space-y-3">
            <Radio className="w-12 h-12 mx-auto text-ink-faint" />
            <h3 className="text-lg font-bold text-ink">No Live Matches</h3>
            <p className="text-sm text-ink-muted max-w-md mx-auto">
              There are no matches currently in progress. Check the fixtures page for upcoming schedules.
            </p>
          </div>
        )}

        {/* Auto-refresh Notice */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-ink-faint flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ludo-green animate-pulse" />
            Scores update automatically via live connection
          </p>
        </div>
      </div>

      <PlayoraFooter />
    </main>
  )
}
