import type { Metadata } from "next"
import { Radio, Play, Pause, Check, MapPin, Clock } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { getLiveMatches, getUpcomingMatches, VENUES } from "@/lib/data"
import { pluralise } from "@/lib/utils"
import type { Match } from "@/lib/types"

export const metadata: Metadata = { title: "Live Matches" }

/**
 * Referee-facing scorer row.
 *
 * Deliberately chunky: this is operated one-handed, standing next to a table,
 * so every control clears 44px and the score is readable at arm's length.
 */
function ScorerRow({ match }: { match: Match }) {
  return (
    <div className="card-base p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-ink">{match.round}</p>
          <p className="text-[11px] text-ink-muted flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="w-3 h-3" />
              {match.venue} · Table {match.table}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="w-3 h-3" />
              {match.time}
            </span>
          </p>
        </div>
        <StatusBadge status={match.status} size="md" />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0 text-center">
          <p className="text-xs font-bold text-ink truncate">{match.teamA}</p>
          <p className="text-3xl font-extrabold text-ink tabular-nums mt-1">
            {match.scoreA ?? 0}
          </p>
        </div>
        <span className="text-[10px] font-bold text-ink-faint">VS</span>
        <div className="min-w-0 text-center">
          <p className="text-xs font-bold text-ink truncate">{match.teamB}</p>
          <p className="text-3xl font-extrabold text-ink tabular-nums mt-1">
            {match.scoreB ?? 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border">
        <Button size="md" aria-label={`Pause ${match.round}`}>
          <Pause aria-hidden="true" className="w-4 h-4" />
          Pause
        </Button>
        <Button size="md" aria-label={`Resume ${match.round}`}>
          <Play aria-hidden="true" className="w-4 h-4" />
          Resume
        </Button>
        <Button size="md" variant="primary" aria-label={`Submit result for ${match.round}`}>
          <Check aria-hidden="true" className="w-4 h-4" />
          Result
        </Button>
      </div>
    </div>
  )
}

export default function AdminLivePage() {
  const live = getLiveMatches()
  const nextUp = getUpcomingMatches().filter((m) => m.day === "Today")
  const tablesInUse = VENUES.reduce((sum, v) => sum + v.tablesInUse, 0)
  const totalTables = VENUES.reduce((sum, v) => sum + v.tables, 0)

  return (
    <AdminPage
      eyebrow="Competition"
      title="Live Matches"
      description={`${pluralise(live.length, "match", "matches")} in progress · ${tablesInUse} of ${totalTables} tables in use`}
    >
      <PreviewNotice>
        Scoring controls are wired to the UI only. Connecting the WebSocket
        channel makes these buttons write to the live match state.
      </PreviewNotice>

      {live.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {live.map((match) => (
            <ScorerRow key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Radio className="w-6 h-6" />}
          title="Nothing in progress"
          description="No match is currently live. Start a scheduled fixture to open its scorer view."
        />
      )}

      {nextUp.length > 0 && (
        <section aria-labelledby="starting-soon" className="space-y-3">
          <h2 id="starting-soon" className="text-sm font-bold text-ink">
            Starting soon
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none">
            {nextUp.map((match) => (
              <li
                key={match.id}
                className="card-base p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {match.teamA} vs {match.teamB}
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    {match.round} · {match.venue}, Table {match.table} · {match.time}
                  </p>
                </div>
                <Button variant="primary" aria-label={`Start ${match.round}`}>
                  <Play aria-hidden="true" className="w-3.5 h-3.5" />
                  Start
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AdminPage>
  )
}
