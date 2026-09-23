import type { Metadata } from "next"
import { LiveAdminClient } from "./LiveAdminClient"

export const metadata: Metadata = { title: "Live Control" }

export default function AdminLivePage() {
  return <LiveAdminClient />
}
