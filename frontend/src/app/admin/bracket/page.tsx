import type { Metadata } from "next"
import { AdminBracketClient } from "./AdminBracketClient"

export const metadata: Metadata = { title: "Bracket" }

export default function AdminBracketPage() {
  return <AdminBracketClient />
}
