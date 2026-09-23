import type { Metadata } from "next"
import { TeamsClient } from "./TeamsClient"

export const metadata: Metadata = { title: "Teams & Logins" }

export default function AdminTeamsPage() {
  return <TeamsClient />
}
