import type { Metadata } from "next"
import { Calendar, Printer } from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { PageHeader } from "@/components/ui/PageHeader"
import { FilteredMatchList } from "@/components/matches/FilteredMatchList"
import { PrintButton } from "@/components/ui/PrintButton"
import { MATCHES, ROUND_ORDER, TOURNAMENT } from "@/lib/data"

export const metadata: Metadata = {
  title: "Fixtures",
  description:
    "The full Ludo Championship schedule — every round, kickoff time, venue and table assignment.",
  alternates: { canonical: "/fixtures" },
}

export default function FixturesPage() {
  // Sorted by stage so the filter chips read in tournament order.
  const ordered = [...MATCHES].sort(
    (a, b) =>
      ROUND_ORDER.indexOf(a.round as (typeof ROUND_ORDER)[number]) -
      ROUND_ORDER.indexOf(b.round as (typeof ROUND_ORDER)[number]),
  )

  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />

      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <PageHeader
          eyebrow="Schedule"
          title="Fixtures"
          description={`${TOURNAMENT.name} · ${TOURNAMENT.format}`}
          icon={<Calendar aria-hidden="true" className="w-5 h-5 text-ludo-blue-ink" />}
          actions={
            <PrintButton label="Print schedule">
              <Printer aria-hidden="true" className="w-3.5 h-3.5" />
              Print
            </PrintButton>
          }
        />

        <FilteredMatchList
          matches={ordered}
          grouped
          emptyTitle="No fixtures in this round"
          emptyDescription="This stage has not been drawn yet. Fixtures appear here as soon as the admin publishes them."
        />
      </main>

      <PlayoraFooter />
    </div>
  )
}
