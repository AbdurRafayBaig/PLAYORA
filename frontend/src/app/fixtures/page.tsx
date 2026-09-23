import type { Metadata } from "next"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { FixturesClient } from "./FixturesClient"

export const metadata: Metadata = {
  title: "Fixtures",
  description:
    "Published Ludo fixtures — round by round, with the table and kickoff time for every match.",
  alternates: { canonical: "/fixtures" },
}

export default function FixturesPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />
      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <FixturesClient />
      </main>
      <PlayoraFooter />
    </div>
  )
}
