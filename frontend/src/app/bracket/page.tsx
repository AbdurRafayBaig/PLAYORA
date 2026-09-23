import type { Metadata } from "next"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { BracketClient } from "./BracketClient"

export const metadata: Metadata = {
  title: "Bracket",
  description:
    "The full Ludo knockout bracket — every round from the opening draw to the final, and who is still in.",
  alternates: { canonical: "/bracket" },
}

export default function BracketPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <BracketClient />
      </main>
      <PlayoraFooter />
    </div>
  )
}
