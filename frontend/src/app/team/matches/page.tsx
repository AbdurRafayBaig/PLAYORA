import type { Metadata } from "next"
import { TeamMatchesClient } from "./TeamMatchesClient"

export const metadata: Metadata = { title: "My Matches" }

export default function TeamMatchesPage() {
  return <TeamMatchesClient />
}
