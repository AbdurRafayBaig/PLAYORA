import type { Metadata } from "next"
import Link from "next/link"
import { Radio, Calendar } from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { MatchCard } from "@/components/cards/MatchCard"
import { PageHeader } from "@/components/ui/PageHeader"
import { EmptyState } from "@/components/ui/EmptyState"
import { getLiveMatches, getUpcomingMatches, TOURNAMENT } from "@/lib/data"
import { pluralise } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Live Matches",
  description:
    "Every Ludo Championship match currently in progress, with live scores, venue and table assignments.",
  alternates: { canonical: "/live" },
}

export default function LivePage() {
  const liveMatches = getLiveMatches()
  const nextUp = getUpcomingMatches().slice(0, 2)

  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />

      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <PageHeader
          eyebrow="Live Now"
          title="Live Matches"
          description={`${TOURNAMENT.name} · ${TOURNAMENT.stage}`}
          icon={
            <span className="relative flex h-3 w-3" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-ludo-red" />
            </span>
          }
        />

        <p className="sr-only" role="status">
          {liveMatches.length === 0
            ? "No matches are currently in progress."
            : `${pluralise(liveMatches.length, "match", "matches")} in progress.`}
        </p>

        {liveMatches.length > 0 ? (
          <>
            <p className="text-xs text-ink-muted mb-4">
              {pluralise(liveMatches.length, "match", "matches")} currently in progress
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={<Radio className="w-6 h-6" />}
            title="No live matches"
            description="There are no matches currently in progress. Check the fixtures page for upcoming schedules."
            action={
              <Link
                href="/fixtures"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ludo-blue-solid text-white text-xs font-semibold hover:bg-ludo-blue-solid-hover transition-colors"
              >
                <Calendar aria-hidden="true" className="w-4 h-4" />
                View fixtures
              </Link>
            }
          />
        )}

        {/* Up next keeps the page useful between matches, rather than
            leaving a visitor at a dead end. */}
        {nextUp.length > 0 && (
          <section className="mt-10" aria-labelledby="next-up">
            <h2
              id="next-up"
              className="text-sm font-bold text-ink flex items-center gap-2 mb-3"
            >
              <Calendar aria-hidden="true" className="w-4 h-4 text-ludo-blue-ink" />
              Up Next
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {nextUp.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </section>
        )}

        <p className="mt-8 text-center text-[11px] text-ink-faint flex items-center justify-center gap-1.5">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-ludo-green animate-pulse"
          />
          Scores update automatically via live connection
        </p>
      </main>

      <PlayoraFooter />
    </div>
  )
}
