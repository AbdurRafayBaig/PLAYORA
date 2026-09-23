import type { Metadata } from "next"
import { TeamHomeClient } from "./TeamHomeClient"

export const metadata: Metadata = { title: "Home" }

export default function TeamHomePage() {
  return <TeamHomeClient />
}
