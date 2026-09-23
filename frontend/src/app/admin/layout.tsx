import type { Metadata } from "next"
import { AdminShell } from "@/components/layout/AdminShell"

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | PLAYORA Admin" },
  // The console is gated; keep it out of search results entirely.
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}
