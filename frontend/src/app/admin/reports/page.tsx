import type { Metadata } from "next"
import { Download, FileText, Trophy, Users, Clock, Percent } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { Panel } from "@/components/ui/Panel"
import { KPICard } from "@/components/cards/KPICard"
import {
  TEAMS,
  PLAYERS,
  MATCHES,
  DISPUTES,
  getCompletedMatches,
  getStandings,
} from "@/lib/data"
import { winRate } from "@/lib/utils"

export const metadata: Metadata = { title: "Reports" }

const EXPORTS = [
  { name: "Full fixture list", detail: "Every match with venue, table and kickoff time", format: "CSV" },
  { name: "Final standings", detail: "Ranked table with points, wins and losses", format: "CSV" },
  { name: "Team roster", detail: "All teams with players and contact details", format: "CSV" },
  { name: "Match results", detail: "Verified results with scores and winners", format: "CSV" },
  { name: "Audit trail", detail: "Every administrative action with actor and timestamp", format: "PDF" },
]

export default function AdminReportsPage() {
  const completed = getCompletedMatches()
  const standings = getStandings()
  const leader = standings[0]
  const completionRate = Math.round((completed.length / MATCHES.length) * 100)

  /* Widest bar sets the scale, so the chart stays readable whatever the
     absolute numbers are. */
  const topTeams = standings.slice(0, 5)
  const maxPoints = Math.max(...topTeams.map((t) => t.points), 1)

  return (
    <AdminPage
      eyebrow="Operations"
      title="Reports"
      description="Tournament summary and data exports."
      actions={
        <Button variant="primary">
          <Download aria-hidden="true" className="w-3.5 h-3.5" />
          Export all
        </Button>
      }
    >
      <PreviewNotice>
        Figures are computed from the shared demo dataset. File exports
        activate once the Django API is connected.
      </PreviewNotice>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard icon={<Trophy className="w-5 h-5" />} label="Matches Completed" value={`${completed.length} / ${MATCHES.length}`} change={`${completionRate}%`} changeType="positive" accentColor="green" />
        <KPICard icon={<Users className="w-5 h-5" />} label="Participants" value={PLAYERS.length} hint={`${TEAMS.length} teams`} accentColor="red" />
        <KPICard icon={<Percent className="w-5 h-5" />} label="Top Win Rate" value={`${winRate(leader.wins, leader.played)}%`} hint={leader.name} accentColor="yellow" />
        <KPICard icon={<Clock className="w-5 h-5" />} label="Disputes Raised" value={DISPUTES.length} hint={`${DISPUTES.filter((d) => d.status === "resolved").length} resolved`} accentColor="blue" />
      </div>

      {/* Points chart — plain bars with the value printed, so it reads
          without relying on comparing lengths by eye. */}
      <Panel title="Points by team (top 5)" icon={<FileText aria-hidden="true" className="w-4 h-4 text-ludo-blue-ink" />}>
        <ul className="space-y-3 list-none">
          {topTeams.map((team) => (
            <li key={team.id} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-ink truncate">{team.name}</span>
                <span className="font-extrabold text-ink tabular-nums shrink-0">
                  {team.points} pts
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-ink-faint/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-ludo-blue"
                  style={{ width: `${(team.points / maxPoints) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Available exports" icon={<Download aria-hidden="true" className="w-4 h-4 text-ink-muted" />} flush>
        <ul className="divide-y divide-border list-none">
          {EXPORTS.map((item) => (
            <li
              key={item.name}
              className="px-4 py-3.5 flex flex-wrap items-center justify-between gap-3 transition-colors hover:bg-ink-faint/5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{item.name}</p>
                <p className="text-[11px] text-ink-muted">{item.detail}</p>
              </div>
              <Button aria-label={`Download ${item.name} as ${item.format}`}>
                <Download aria-hidden="true" className="w-3.5 h-3.5" />
                {item.format}
              </Button>
            </li>
          ))}
        </ul>
      </Panel>
    </AdminPage>
  )
}
