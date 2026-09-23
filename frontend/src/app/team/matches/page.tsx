import type { Metadata } from "next"
import { Swords, CalendarX2 } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { EmptyState } from "@/components/ui/EmptyState"
import { MatchCard } from "@/components/cards/MatchCard"
import { getSignedInTeam, getMatchesForTeam } from "@/lib/data"
import { pluralise } from "@/lib/utils"

export const metadata: Metadata = { title: "My Matches" }

export default function TeamMatchesPage() {
  const team = getSignedInTeam()
  const matches = getMatchesForTeam(team.name)

  const live = matches.filter((m) => m.status === "live")
  const upcoming = matches.filter((m) =>
    ["scheduled", "checkin", "ready"].includes(m.status),
  )
  const played = matches.filter((m) => m.status === "completed")

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="My Matches"
        title="Fixtures & Results"
        description={`${pluralise(matches.length, "match", "matches")} for ${team.name}`}
        icon={<Swords aria-hidden="true" className="w-5 h-5 text-ludo-red-ink" />}
      />

      {matches.length === 0 ? (
        <EmptyState
          icon={<CalendarX2 className="w-6 h-6" />}
          title="No matches yet"
          description="Your fixtures appear here as soon as the admin publishes the draw."
        />
      ) : (
        <>
          {live.length > 0 && (
            <section aria-labelledby="live-heading" className="space-y-3">
              <h2
                id="live-heading"
                className="flex items-center gap-2 text-sm font-bold text-ink"
              >
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ludo-red" />
                </span>
                Live now
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {live.map((match) => (
                  <MatchCard key={match.id} {...match} />
                ))}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section aria-labelledby="upcoming-heading" className="space-y-3">
              <h2 id="upcoming-heading" className="text-sm font-bold text-ink">
                Upcoming ({upcoming.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {upcoming.map((match) => (
                  <MatchCard key={match.id} {...match} />
                ))}
              </div>
              <p className="text-[11px] text-ink-muted bg-ludo-yellow/10 border border-ludo-yellow/25 rounded-xl px-3.5 py-2.5 leading-relaxed">
                Check in at your table at least 10 minutes before kickoff.
                Missing the check-in window forfeits the match by walkover.
              </p>
            </section>
          )}

          {played.length > 0 && (
            <section aria-labelledby="played-heading" className="space-y-3">
              <h2 id="played-heading" className="text-sm font-bold text-ink">
                Played ({played.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {played.map((match) => (
                  <MatchCard key={match.id} {...match} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
