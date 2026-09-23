import type { Metadata } from "next"
import { Plus, Trophy, Users, Calendar, Layers } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { Panel } from "@/components/ui/Panel"
import { KPICard } from "@/components/cards/KPICard"
import { StatusBadge } from "@/components/cards/StatusBadge"
import {
  TOURNAMENT,
  TEAMS,
  MATCHES,
  ROUND_ORDER,
  getCompletedMatches,
} from "@/lib/data"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = { title: "Tournaments" }

const PAST = [
  { name: "Ludo Championship 2025", status: "archived", teams: 20, winner: "Royal Knights" },
  { name: "Winter Friendly Cup 2025", status: "completed", teams: 12, winner: "Golden Eagles" },
]

export default function AdminTournamentsPage() {
  const completed = getCompletedMatches().length
  const progress = Math.round((completed / MATCHES.length) * 100)

  return (
    <AdminPage
      eyebrow="Overview"
      title="Tournaments"
      description="Create, configure and archive tournaments."
      actions={
        <Button variant="primary">
          <Plus aria-hidden="true" className="w-3.5 h-3.5" />
          New tournament
        </Button>
      }
    >
      <PreviewNotice>
        One tournament is active. Creating and archiving tournaments activates
        once the Django API is connected.
      </PreviewNotice>

      {/* Active tournament */}
      <section className="card-base border-t-4 border-t-ludo-red p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-extrabold text-ink tracking-tight">
                {TOURNAMENT.name}
              </h2>
              <StatusBadge status={TOURNAMENT.status} size="md" />
            </div>
            <p className="text-xs text-ink-muted mt-1">
              {TOURNAMENT.organiser} · {TOURNAMENT.format} · Started{" "}
              {formatDate(TOURNAMENT.startedOn)}
            </p>
          </div>
          <Button>Configure</Button>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-ink-muted">
              Currently at: <span className="text-ink">{TOURNAMENT.stage}</span>
            </span>
            <span className="text-ink tabular-nums">
              {completed} / {MATCHES.length} matches played
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tournament progress"
            className="h-2 rounded-full bg-ink-faint/15 overflow-hidden"
          >
            <div
              className="h-full rounded-full bg-ludo-green transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KPICard icon={<Users className="w-5 h-5" />} label="Teams" value={TEAMS.length} accentColor="red" />
          <KPICard icon={<Calendar className="w-5 h-5" />} label="Total Matches" value={MATCHES.length} accentColor="blue" />
          <KPICard icon={<Trophy className="w-5 h-5" />} label="Completed" value={completed} accentColor="green" />
          <KPICard icon={<Layers className="w-5 h-5" />} label="Rounds" value={ROUND_ORDER.length} accentColor="yellow" />
        </div>
      </section>

      {/* Archive */}
      <Panel title="Past tournaments" icon={<Trophy aria-hidden="true" className="w-4 h-4 text-ink-muted" />} flush>
        <ul className="divide-y divide-border list-none">
          {PAST.map((t) => (
            <li
              key={t.name}
              className="px-4 py-3.5 flex flex-wrap items-center justify-between gap-3 transition-colors hover:bg-ink-faint/5"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink truncate">{t.name}</p>
                <p className="text-[11px] text-ink-muted">
                  {t.teams} teams · Winner: {t.winner}
                </p>
              </div>
              <StatusBadge status={t.status} />
            </li>
          ))}
        </ul>
      </Panel>
    </AdminPage>
  )
}
