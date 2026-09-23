import type { Metadata } from "next"
import { TeamNotificationsClient } from "./TeamNotificationsClient"

export const metadata: Metadata = { title: "Notifications" }

export default function TeamNotificationsPage() {
  return <TeamNotificationsClient />
}
