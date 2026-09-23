import type { Metadata } from "next"
import { BarChart3, ChevronUp, ChevronDown, Minus, Printer } from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { PageHeader } from "@/components/ui/PageHeader"
import { PrintButton } from "@/components/ui/PrintButton"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { getStandings, TOURNAMENT } from "@/lib/data"
import type { Team, Trend } from "@/lib/types"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Standings",
  description:
    "The live Ludo Championship leaderboard — points, wins, losses and qualification status for every team.",
  alternates: { canonical: "/standings" },
}

const trendMeta: Record<Trend, { icon: typeof ChevronUp; className: string; label: string }> = {
  up: { icon: ChevronUp, className: "text-ludo-green-ink", label: "Moving up" },
  down: { icon: ChevronDown, className: "text-ludo-red-ink", label: "Moving down" },
  same: { icon: Minus, className: "text-ink-faint", label: "No change" },
}

function TrendCell({ trend }: { trend: Trend }) {
  const { icon: Icon, className, label } = trendMeta[trend]
  return (
    <span className={cn("inline-flex", className)} title={label}>
      <Icon aria-hidden="true" className="w-4 h-4" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

/** Last four results, most recent first. */
function FormGuide({ form }: { form: string[] }) {
  return (
    <span className="inline-flex gap-1" aria-label={`Recent form: ${form.join(", ")}`}>
      {form.map((result, i) => (
        <span
          key={i}
          aria-hidden="true"
          title={result === "W" ? "Win" : result === "L" ? "Loss" : "Bye"}
          className={cn(
            "w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center",
            result === "W"
              ? "bg-ludo-green/15 text-ludo-green-ink"
              : result === "L"
                ? "bg-ludo-red/10 text-ludo-red-ink"
                : "bg-ink-faint/10 text-ink-muted",
          )}
        >
          {result}
        </span>
      ))}
    </span>
  )
}

const rankStyle = (rank: number) =>
  rank === 1
    ? "bg-ludo-yellow/20 text-ludo-yellow-ink"
    : rank === 2
      ? "bg-ink-faint/15 text-ink-muted"
      : rank === 3
        ? "bg-ludo-red/10 text-ludo-red-ink"
        : "text-ink-faint"

export default function StandingsPage() {
  const standings = getStandings()

  const columns: Column<Team & { rank: number }>[] = [
    {
      key: "rank",
      header: "#",
      width: "3rem",
      align: "center",
      numeric: true,
      sticky: "0",
      render: (team) => (
        <span
          className={cn(
            "w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-extrabold",
            rankStyle(team.rank),
          )}
        >
          {team.rank}
        </span>
      ),
    },
    {
      key: "team",
      header: "Team",
      width: "9rem",
      sticky: "3rem",
      render: (team) => (
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden="true"
            className="w-7 h-7 shrink-0 rounded-lg bg-ludo-blue/10 hidden sm:flex items-center justify-center text-[10px] font-bold text-ludo-blue-ink"
          >
            {team.initials}
          </span>
          <span className="text-sm font-bold text-ink truncate">{team.name}</span>
        </div>
      ),
    },
    { key: "points", header: "Pts", align: "center", numeric: true, width: "3.5rem", render: (t) => <span className="text-lg font-extrabold text-ink">{t.points}</span> },
    { key: "played", header: "P", align: "center", numeric: true, width: "3rem", render: (t) => <span className="text-ink-muted font-semibold">{t.played}</span> },
    { key: "wins", header: "W", align: "center", numeric: true, width: "3rem", render: (t) => <span className="text-ludo-green-ink font-semibold">{t.wins}</span> },
    { key: "losses", header: "L", align: "center", numeric: true, width: "3rem", render: (t) => <span className="text-ludo-red-ink font-semibold">{t.losses}</span> },
    { key: "form", header: "Form", align: "center", width: "7rem", render: (t) => <FormGuide form={t.form} /> },
    { key: "status", header: "Status", align: "center", width: "7rem", render: (t) => <StatusBadge status={t.status} /> },
    { key: "trend", header: "Trend", align: "center", width: "3.5rem", render: (t) => <TrendCell trend={t.trend} /> },
  ]

  const ranked = standings.map((team, i) => ({ ...team, rank: i + 1 }))

  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />

      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <PageHeader
          eyebrow="Rankings"
          title="Standings"
          description={`${TOURNAMENT.name} · ${TOURNAMENT.stage}`}
          icon={<BarChart3 aria-hidden="true" className="w-5 h-5 text-ludo-green-ink" />}
          actions={
            <PrintButton label="Print standings">
              <Printer aria-hidden="true" className="w-3.5 h-3.5" />
              Print
            </PrintButton>
          }
        />

        <DataTable
          caption={`${TOURNAMENT.name} standings, ranked by points`}
          columns={columns}
          rows={ranked}
          rowKey={(team) => team.id}
          rowClassName={(team) => (team.rank <= 3 ? "bg-ludo-green/[0.04]" : undefined)}
        />

        <p className="mt-2 text-[11px] text-ink-faint lg:hidden">
          Swipe the table sideways for losses, form and status — the rank and
          team stay pinned.
        </p>

        {/* Legend — abbreviations are not self-explanatory to a first-time
            visitor, and the trend arrows need a text equivalent. */}
        <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-ink-muted">
          <div className="flex items-center gap-1.5">
            <dt className="font-bold text-ink">P</dt>
            <dd>Played</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="font-bold text-ink">W</dt>
            <dd>Wins</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="font-bold text-ink">L</dt>
            <dd>Losses</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="font-bold text-ink">Pts</dt>
            <dd>Points (3 per win)</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>
              <ChevronUp aria-hidden="true" className="w-3.5 h-3.5 text-ludo-green-ink" />
            </dt>
            <dd>Moving up</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>
              <ChevronDown aria-hidden="true" className="w-3.5 h-3.5 text-ludo-red-ink" />
            </dt>
            <dd>Moving down</dd>
          </div>
        </dl>
      </main>

      <PlayoraFooter />
    </div>
  )
}
