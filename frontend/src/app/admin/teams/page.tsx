import type { Metadata } from "next"
import { Download, Plus, Upload } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { Button } from "@/components/ui/Button"
import { TEAMS, getPlayersForTeam } from "@/lib/data"
import { winRate } from "@/lib/utils"
import type { Team } from "@/lib/types"

export const metadata: Metadata = { title: "Teams" }

export default function AdminTeamsPage() {
  const columns: Column<Team>[] = [
    {
      key: "team",
      width: "12rem",
      sticky: "0",
      header: "Team",
      render: (team) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            className="w-9 h-9 shrink-0 rounded-xl bg-ludo-red/10 flex items-center justify-center text-[11px] font-bold text-ludo-red-ink"
          >
            {team.initials}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-ink truncate">{team.name}</span>
            <span className="block text-[10px] text-ink-muted">{team.code}</span>
          </span>
        </div>
      ),
    },
    {
      key: "captain",
      header: "Captain",
      render: (team) => <span className="text-xs text-ink-muted">{team.captain}</span>,
    },
    {
      key: "players",
      header: "Players",
      align: "center",
      numeric: true,
      render: (team) => (
        <span className="text-xs font-semibold text-ink-muted">
          {getPlayersForTeam(team.id).length}
        </span>
      ),
    },
    {
      key: "record",
      header: "W / L",
      align: "center",
      numeric: true,
      render: (team) => (
        <span className="text-xs font-semibold">
          <span className="text-ludo-green-ink">{team.wins}</span>
          <span className="text-ink-faint"> / </span>
          <span className="text-ludo-red-ink">{team.losses}</span>
        </span>
      ),
    },
    {
      key: "winrate",
      header: "Win %",
      align: "center",
      numeric: true,
      render: (team) => (
        <span className="text-xs font-semibold text-ink">{winRate(team.wins, team.played)}%</span>
      ),
    },
    {
      key: "points",
      header: "Pts",
      align: "center",
      numeric: true,
      render: (team) => <span className="text-base font-extrabold text-ink">{team.points}</span>,
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (team) => <StatusBadge status={team.status} />,
    },
  ]

  return (
    <AdminPage
      eyebrow="Competition"
      title="Teams"
      description={`${TEAMS.length} teams registered for this tournament.`}
      actions={
        <>
          <Button>
            <Upload aria-hidden="true" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import CSV</span>
          </Button>
          <Button>
            <Download aria-hidden="true" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="primary">
            <Plus aria-hidden="true" className="w-3.5 h-3.5" />
            Add team
          </Button>
        </>
      }
    >
      <PreviewNotice>
        This view reads from the shared demo dataset. Import, export and team
        creation activate once the Django API is connected.
      </PreviewNotice>

      <DataTable
        caption="Registered teams with their record and qualification status"
        columns={columns}
        rows={TEAMS}
        rowKey={(team) => team.id}
      />
    </AdminPage>
  )
}
