import type { Metadata } from "next"
import { Trophy, Printer } from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { PageHeader } from "@/components/ui/PageHeader"
import { FilteredMatchList } from "@/components/matches/FilteredMatchList"
import { PrintButton } from "@/components/ui/PrintButton"
import { getCompletedMatches } from "@/lib/data"
import { pluralise } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Results",
  description:
    "Verified results for every completed Ludo Championship match, with final scores and winners.",
  alternates: { canonical: "/results" },
}

export default function ResultsPage() {
  const results = getCompletedMatches()

  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />

      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <PageHeader
          eyebrow="Completed"
          title="Results"
          description={`${pluralise(results.length, "match", "matches")} played and verified`}
          icon={<Trophy aria-hidden="true" className="w-5 h-5 text-ludo-green-ink" />}
          actions={
            <PrintButton label="Print results">
              <Printer aria-hidden="true" className="w-3.5 h-3.5" />
              Print
            </PrintButton>
          }
        />

        <FilteredMatchList
          matches={results}
          emptyTitle="No results yet"
          emptyDescription="Results appear here as soon as a match is verified and locked by the admin."
        />
      </main>

      <PlayoraFooter />
    </div>
  )
}
