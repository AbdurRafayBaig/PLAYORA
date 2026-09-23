import type { Metadata } from "next"
import { TeamShell } from "@/components/layout/TeamShell"

export const metadata: Metadata = {
  title: { default: "Team Portal", template: "%s | PLAYORA Team" },
  robots: { index: false, follow: false },
}

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TeamShell>{children}</TeamShell>
}
