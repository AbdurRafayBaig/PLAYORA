import type { Metadata } from "next"
import { Trophy, CalendarX2 } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { EmptyState } from "@/components/ui/EmptyState"
import { MatchCard } from "@/components/cards/MatchCard"
import { getSignedInTeam, getMatchesForTeam } from "@/lib/data"
import { winRate } from "@/lib/utils"

export const metadata: Metadata = { title: "Results" }

export default function TeamResultsPage() {
  const team = getSignedInTeam()
  const played = getMatchesForTeam(team.name).filter((m) => m.status === "completed")

  /* Derived from the fixtures, so a team's own results page can never
     disagree with the public results page. */
  const won = played.filter(
    (m) => (m.winner === "A" && m.teamA === team.name) || (m.winner === "B" && m.teamB === team.name),
  ).length
  const lost = played.length - won

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Results"
        title="Match History"
        description={`${team.name} · ${won} won, ${lost} lost`}
        icon={<Trophy aria-hidden="true" className="w-5 h-5 text-ludo-green-ink" />}
      />

      {played.length === 0 ? (
        <EmptyState
          icon={<CalendarX2 className="w-6 h-6" />}
          title="No results yet"
          description="Your results appear here once a match is verified and locked by the admin."
        />
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-3">
            <div className="card-base border-t-4 border-t-ludo-green p-4 text-center">
              <dd className="text-2xl font-extrabold text-ludo-green-ink tabular-nums">{won}</dd>
              <dt className="text-[10px] font-medium text-ink-muted">Won</dt>
            </div>
            <div className="card-base border-t-4 border-t-ludo-red p-4 text-center">
              <dd className="text-2xl font-extrabold text-ludo-red-ink tabular-nums">{lost}</dd>
              <dt className="text-[10px] font-medium text-ink-muted">Lost</dt>
            </div>
            <div className="card-base border-t-4 border-t-ludo-blue p-4 text-center">
              <dd className="text-2xl font-extrabold text-ludo-blue-ink tabular-nums">
                {winRate(won, played.length)}%
              </dd>
              <dt className="text-[10px] font-medium text-ink-muted">Win rate</dt>
            </div>
          </dl>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {played.map((match) => (
              <MatchCard key={match.id} {...match} />
            ))}
          </div>

          <p className="text-[11px] text-ink-muted bg-ink-faint/5 border border-border rounded-xl px-3.5 py-2.5 leading-relaxed">
            Results are final once verified and locked. Disputes must be raised
            within 15 minutes of submission.
          </p>
        </>
      )}
    </div>
  )
}
