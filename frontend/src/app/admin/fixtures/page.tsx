import type { Metadata } from "next"
import { FixturesAdminClient } from "./FixturesAdminClient"

export const metadata: Metadata = { title: "Fixtures" }

export default function AdminFixturesPage() {
  return <FixturesAdminClient />
}
