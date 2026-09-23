import type { Metadata } from "next"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { HomeClient } from "./HomeClient"
import { BRAND } from "@/lib/constants"

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description:
    "Follow the Ludo knockout live: every round, the full bracket, live match clocks, and a portal for each registered team.",
  alternates: { canonical: "/" },
}

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />
      <main id="main-content" className="flex-1">
        <HomeClient />
      </main>
      <PlayoraFooter />
    </div>
  )
}
