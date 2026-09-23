import type { Metadata } from "next"
import { Plus, Download } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import { PLAYERS, getTeam } from "@/lib/data"
import { getInitials } from "@/lib/utils"
import type { Player } from "@/lib/types"

export const metadata: Metadata = { title: "Players" }

export default function AdminPlayersPage() {
  const columns: Column<Player>[] = [
    {
      key: "player",
      width: "12rem",
      sticky: "0",
      header: "Player",
      render: (player) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            className="w-9 h-9 shrink-0 rounded-full bg-ludo-blue/10 flex items-center justify-center text-[11px] font-bold text-ludo-blue-ink"
          >
            {getInitials(player.name)}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-ink truncate">{player.name}</span>
            <span className="block text-[10px] text-ink-muted">{player.id}</span>
          </span>
        </div>
      ),
    },
    {
      key: "team",
      header: "Team",
      render: (player) => (
        <span className="text-xs font-semibold text-ink">
          {getTeam(player.teamId)?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      align: "center",
      render: (player) =>
        player.role === "Captain" ? (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-ludo-yellow/15 text-ludo-yellow-ink border border-ludo-yellow/30">
            Captain
          </span>
        ) : (
          <span className="text-[11px] text-ink-muted">Member</span>
        ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (player) => (
        <span className="block min-w-0">
          <a
            href={`mailto:${player.email}`}
            className="block text-[11px] text-ludo-blue-ink hover:underline truncate"
          >
            {player.email}
          </a>
          <a
            href={`tel:${player.phone.replace(/\s/g, "")}`}
            className="block text-[10px] text-ink-muted hover:underline"
          >
            {player.phone}
          </a>
        </span>
      ),
    },
    {
      key: "matches",
      header: "Played",
      align: "center",
      numeric: true,
      render: (player) => (
        <span className="text-sm font-semibold text-ink">{player.matchesPlayed}</span>
      ),
    },
  ]

  return (
    <AdminPage
      eyebrow="Competition"
      title="Players"
      description={`${PLAYERS.length} players across ${new Set(PLAYERS.map((p) => p.teamId)).size} teams.`}
      actions={
        <>
          <Button>
            <Download aria-hidden="true" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="primary">
            <Plus aria-hidden="true" className="w-3.5 h-3.5" />
            Add player
          </Button>
        </>
      }
    >
      <PreviewNotice>
        Player records come from the shared demo dataset. Editing becomes
        available once the Django API is connected.
      </PreviewNotice>

      <DataTable
        caption="Registered players, their team and contact details"
        columns={columns}
        rows={PLAYERS}
        rowKey={(player) => player.id}
      />
    </AdminPage>
  )
}
