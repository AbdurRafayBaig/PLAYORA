import type { Metadata } from "next"
import { Plus, Shield } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import { Panel } from "@/components/ui/Panel"
import { PORTAL_USERS } from "@/lib/data"
import { cn, getInitials } from "@/lib/utils"
import type { PortalUser } from "@/lib/types"

export const metadata: Metadata = { title: "Users & Roles" }

const roleStyle: Record<PortalUser["role"], string> = {
  "Super Admin": "bg-ludo-red/10 text-ludo-red-ink border-ludo-red/25",
  "Tournament Admin": "bg-ludo-blue/10 text-ludo-blue-ink border-ludo-blue/25",
  Referee: "bg-ludo-green/10 text-ludo-green-ink border-ludo-green/25",
  "Team Captain": "bg-ink-faint/10 text-ink-muted border-ink-faint/25",
}

const PERMISSIONS = [
  { role: "Super Admin", can: "Everything, including role management, overrides and tournament deletion." },
  { role: "Tournament Admin", can: "Fixtures, results, teams, players, venues and announcements. No role changes." },
  { role: "Referee", can: "Start, pause and score assigned matches. Submit results for verification." },
  { role: "Team Captain", can: "View own team's matches, results and standing. Raise disputes." },
]

export default function AdminUsersPage() {
  const columns: Column<PortalUser>[] = [
    {
      key: "user",
      width: "13rem",
      sticky: "0",
      header: "User",
      render: (user) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            className="w-9 h-9 shrink-0 rounded-full bg-ludo-blue/10 flex items-center justify-center text-[11px] font-bold text-ludo-blue-ink"
          >
            {getInitials(user.name)}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-ink truncate">{user.name}</span>
            <span className="block text-[10px] text-ink-muted truncate">{user.email}</span>
          </span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <span
          className={cn(
            "inline-block px-2.5 py-0.5 text-[10px] font-semibold rounded-full border whitespace-nowrap",
            roleStyle[user.role],
          )}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "lastActive",
      header: "Last active",
      render: (user) => <span className="text-[11px] text-ink-muted">{user.lastActive}</span>,
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (user) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[11px] font-semibold",
            user.active ? "text-ludo-green-ink" : "text-ink-faint",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              user.active ? "bg-ludo-green" : "bg-ink-faint",
            )}
          />
          {user.active ? "Active" : "Disabled"}
        </span>
      ),
    },
  ]

  return (
    <AdminPage
      eyebrow="Operations"
      title="Users & Roles"
      description={`${PORTAL_USERS.length} accounts with access to PLAYORA.`}
      actions={
        <Button variant="primary">
          <Plus aria-hidden="true" className="w-3.5 h-3.5" />
          Invite user
        </Button>
      }
    >
      <PreviewNotice>
        Inviting users and changing roles activates once the Django API and
        authentication are connected.
      </PreviewNotice>

      <DataTable
        caption="Portal accounts with their assigned role and activity"
        columns={columns}
        rows={PORTAL_USERS}
        rowKey={(user) => user.id}
      />

      <Panel
        title="What each role can do"
        icon={<Shield aria-hidden="true" className="w-4 h-4 text-ludo-red-ink" />}
        flush
      >
        <dl className="divide-y divide-border">
          {PERMISSIONS.map((p) => (
            <div key={p.role} className="px-4 py-3">
              <dt className="text-xs font-bold text-ink">{p.role}</dt>
              <dd className="text-[11px] text-ink-muted leading-relaxed mt-0.5">{p.can}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </AdminPage>
  )
}
