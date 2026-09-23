import type { Metadata } from "next"
import { TeamProfileClient } from "./TeamProfileClient"

export const metadata: Metadata = { title: "My Team" }

export default function TeamProfilePage() {
  return <TeamProfileClient />
}
