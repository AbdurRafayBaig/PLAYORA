import type { Metadata } from "next"
import { TeamAccountClient } from "./TeamAccountClient"

export const metadata: Metadata = { title: "Account" }

export default function TeamAccountPage() {
  return <TeamAccountClient />
}
