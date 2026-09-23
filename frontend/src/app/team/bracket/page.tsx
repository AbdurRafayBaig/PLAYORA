import type { Metadata } from "next"
import { TeamBracketClient } from "./TeamBracketClient"

export const metadata: Metadata = { title: "Bracket" }

export default function TeamBracketPage() {
  return <TeamBracketClient />
}
