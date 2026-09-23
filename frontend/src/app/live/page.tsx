import type { Metadata } from "next"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { LiveClient } from "./LiveClient"

export const metadata: Metadata = {
  title: "Live Matches",
  description:
    "Every Ludo match being played right now, with a running clock and the table it is on.",
  alternates: { canonical: "/live" },
}

export default function LivePage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />
      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <LiveClient />
      </main>
      <PlayoraFooter />
    </div>
  )
}
