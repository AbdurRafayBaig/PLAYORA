import type { Metadata } from "next"
import { RefreshCw, Download } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { Button } from "@/components/ui/Button"
import { getStandings, TOURNAMENT } from "@/lib/data"
import { cn, winRate } from "@/lib/utils"
import type { Team } from "@/lib/types"

export const metadata: Metadata = { title: "Standings" }

export default function AdminStandingsPage() {
  const ranked = getStandings().map((team, i) => ({ ...team, rank: i + 1 }))

  const columns: Column<Team & { rank: number }>[] = [
    {
      key: "rank",
      header: "#",
      align: "center",
      numeric: true,
      width: "3rem",
      sticky: "0",
      render: (team) => (
        <span
          className={cn(
            "w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-extrabold",
            team.rank === 1
              ? "bg-ludo-yellow/20 text-ludo-yellow-ink"
              : team.rank === 2
                ? "bg-ink-faint/15 text-ink-muted"
                : team.rank === 3
                  ? "bg-ludo-red/10 text-ludo-red-ink"
                  : "text-ink-faint",
          )}
        >
          {team.rank}
        </span>
      ),
    },
    {
      key: "team",
      header: "Team",
      width: "10rem",
      sticky: "3rem",
      render: (team) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            className="w-8 h-8 shrink-0 rounded-lg bg-ludo-blue/10 flex items-center justify-center text-[10px] font-bold text-ludo-blue-ink"
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
    { key: "points", header: "Pts", align: "center", numeric: true, width: "3.5rem", render: (t) => <span className="text-lg font-extrabold text-ink">{t.points}</span> },
    { key: "played", header: "P", align: "center", numeric: true, width: "3rem", render: (t) => <span className="text-ink-muted font-semibold">{t.played}</span> },
    { key: "wins", header: "W", align: "center", numeric: true, width: "3rem", render: (t) => <span className="text-ludo-green-ink font-semibold">{t.wins}</span> },
    { key: "losses", header: "L", align: "center", numeric: true, width: "3rem", render: (t) => <span className="text-ludo-red-ink font-semibold">{t.losses}</span> },
    { key: "winrate", header: "Win %", align: "center", numeric: true, width: "4.5rem", render: (t) => <span className="text-xs font-semibold text-ink">{winRate(t.wins, t.played)}%</span> },
    { key: "status", header: "Status", align: "center", width: "7rem", render: (t) => <StatusBadge status={t.status} /> },
  ]

  return (
    <AdminPage
      eyebrow="Competition"
      title="Standings"
      description={`${TOURNAMENT.name} · recalculated from verified results`}
      actions={
        <>
          <Button>
            <RefreshCw aria-hidden="true" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Recalculate</span>
          </Button>
          <Button>
            <Download aria-hidden="true" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </>
      }
    >
      <PreviewNotice>
        Standings are derived from match results rather than stored, so they
        cannot drift out of sync with the fixtures.
      </PreviewNotice>

      <DataTable
        caption="Team standings ranked by points, then wins"
        columns={columns}
        rows={ranked}
        rowKey={(team) => team.id}
        rowClassName={(team) => (team.rank <= 3 ? "bg-ludo-green/[0.04]" : undefined)}
      />
    </AdminPage>
  )
}
