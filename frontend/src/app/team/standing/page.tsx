import type { Metadata } from "next"
import Link from "next/link"
import { BarChart3, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { getSignedInTeam, getStandings, TOURNAMENT } from "@/lib/data"
import { cn } from "@/lib/utils"
import type { Team } from "@/lib/types"

export const metadata: Metadata = { title: "Standing" }

export default function TeamStandingPage() {
  const team = getSignedInTeam()
  const ranked = getStandings().map((t, i) => ({ ...t, rank: i + 1 }))
  const mine = ranked.find((t) => t.id === team.id)
  const above = mine && mine.rank > 1 ? ranked[mine.rank - 2] : null
  const gap = above && mine ? above.points - mine.points : 0

  const columns: Column<Team & { rank: number }>[] = [
    {
      key: "rank",
      header: "#",
      align: "center",
      numeric: true,
      width: "3rem",
      sticky: "0",
      render: (t) => (
        <span
          className={cn(
            "w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-extrabold",
            t.rank === 1
              ? "bg-ludo-yellow/20 text-ludo-yellow-ink"
              : t.rank === 2
                ? "bg-ink-faint/15 text-ink-muted"
                : t.rank === 3
                  ? "bg-ludo-red/10 text-ludo-red-ink"
                  : "text-ink-faint",
          )}
        >
          {t.rank}
        </span>
      ),
    },
    {
      key: "team",
      header: "Team",
      width: "9.5rem",
      sticky: "3rem",
      render: (t) => (
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold text-ink truncate">{t.name}</span>
          {t.id === team.id && (
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-ludo-red-solid text-white shrink-0">
              You
            </span>
          )}
        </span>
      ),
    },
    { key: "points", header: "Pts", align: "center", numeric: true, width: "3.25rem", render: (t) => <span className="text-base font-extrabold text-ink">{t.points}</span> },
    { key: "played", header: "P", align: "center", numeric: true, width: "2.75rem", render: (t) => <span className="text-ink-muted font-semibold">{t.played}</span> },
    { key: "wins", header: "W", align: "center", numeric: true, width: "2.75rem", render: (t) => <span className="text-ludo-green-ink font-semibold">{t.wins}</span> },
    { key: "status", header: "Status", align: "center", width: "7rem", render: (t) => <StatusBadge status={t.status} /> },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Standing"
        title="Where You Rank"
        description={`${TOURNAMENT.name} · ${TOURNAMENT.stage}`}
        icon={<BarChart3 aria-hidden="true" className="w-5 h-5 text-ludo-blue-ink" />}
      />

      {/* Your position, called out before the full table — the one number a
          team actually opens this page for. */}
      {mine && (
        <div className="card-base border-t-4 border-t-ludo-red p-5 sm:p-6">
          <div className="flex items-center gap-5">
            <div className="text-center shrink-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-ink tabular-nums leading-none">
                #{mine.rank}
              </p>
              <p className="text-[10px] font-medium text-ink-muted mt-1">
                of {ranked.length}
              </p>
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-base font-bold text-ink truncate">{mine.name}</p>
              <p className="text-xs text-ink-muted">
                {mine.points} points · {mine.wins}W / {mine.losses}L
              </p>
              <StatusBadge status={mine.status} />
              {above && (
                <p className="text-[11px] text-ink-muted pt-1">
                  {gap === 0
                    ? `Level on points with ${above.name} in ${above.rank}${above.rank === 1 ? "st" : above.rank === 2 ? "nd" : above.rank === 3 ? "rd" : "th"}.`
                    : `${gap} ${gap === 1 ? "point" : "points"} behind ${above.name}.`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <DataTable
        caption={`${TOURNAMENT.name} standings with your team highlighted`}
        columns={columns}
        rows={ranked}
        rowKey={(t) => t.id}
        rowClassName={(t) =>
          t.id === team.id ? "bg-ludo-red/[0.06] font-semibold" : undefined
        }
      />

      <Link
        href="/standings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ludo-blue-ink hover:underline"
      >
        View the full public standings
        <ExternalLink aria-hidden="true" className="w-3 h-3" />
      </Link>
    </div>
  )
}
