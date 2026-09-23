import type { Metadata } from "next"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { ResultsClient } from "./ResultsClient"

export const metadata: Metadata = {
  title: "Results",
  description:
    "Completed Ludo matches, round by round, with the team that advanced from each tie.",
  alternates: { canonical: "/results" },
}

export default function ResultsPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />
      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <ResultsClient />
      </main>
      <PlayoraFooter />
    </div>
  )
}
