"use client"

import { Users, KeyRound, Calendar, Eye } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Panel } from "@/components/ui/Panel"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { useSignedInTeam, useTournament } from "@/lib/tournament/store"
import { initials } from "@/lib/tournament/engine"
import { formatDate } from "@/lib/utils"

export function TeamProfileClient() {
  const { ready } = useTournament()
  const team = useSignedInTeam()

  if (!ready) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    )
  }

  // TeamShell gates the whole portal, so `team` is present here. This
  // guard only narrows the type.
  if (!team) return null

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="My Team"
        title={team.name}
        description={`Registered ${formatDate(team.registeredAt)}`}
        icon={<Users aria-hidden="true" className="w-5 h-5 text-ludo-orchid-ink" />}
        actions={<StatusBadge status={team.status} size="md" />}
      />

      <Panel
        title="Your login"
        icon={<KeyRound aria-hidden="true" className="w-4 h-4 text-ludo-flame-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <div className="px-4 py-3.5">
            <p className="text-xs font-bold text-ink">Team ID</p>
            <p className="font-mono text-sm text-ink mt-0.5">{team.code}</p>
          </div>
          <div className="px-4 py-3.5">
            <p className="text-xs font-bold text-ink">Password</p>
            {/* Never re-displayed here. A shoulder-surfer at a crowded venue
                is a realistic threat, and the organiser can reissue in
                seconds if a captain forgets it. */}
            <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">
              Hidden for safety. Lost it? Ask the organiser to reissue one —
              it takes seconds at the desk.
            </p>
          </div>
        </div>
      </Panel>

      <Panel
        title={`Players (${team.players.length})`}
        icon={<Users aria-hidden="true" className="w-4 h-4 text-ink-muted" />}
        flush
      >
        {team.players.length === 0 ? (
          <p className="px-4 py-4 text-xs text-ink-muted">
            No players recorded for this team yet.
          </p>
        ) : (
          <ul className="divide-y divide-border list-none">
            {team.players.map((p) => (
              <li key={p.name} className="px-4 py-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-11 h-11 shrink-0 rounded-full bg-ludo-orchid/15 text-ludo-orchid-ink flex items-center justify-center text-sm font-bold"
                >
                  {initials(p.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{p.name}</p>
                  {p.phone && (
                    <a
                      href={`tel:${p.phone.replace(/\s/g, "")}`}
                      className="text-[11px] text-ludo-indigo-ink hover:underline"
                    >
                      {p.phone}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {team.eliminatedInRound !== null && (
        <div className="card-base p-4 flex items-start gap-3 border-l-4 border-l-ink-faint">
          <Calendar aria-hidden="true" className="w-5 h-5 text-ink-muted shrink-0 mt-0.5" />
          <p className="text-xs text-ink-muted leading-relaxed">
            Your run ended in round {team.eliminatedInRound + 1}. The bracket
            stays available so you can follow the rest of the tournament.
          </p>
        </div>
      )}

      <p className="text-[11px] text-ink-muted bg-ink-faint/5 border border-border rounded-xl px-3.5 py-2.5 leading-relaxed flex items-start gap-2">
        <Eye aria-hidden="true" className="w-4 h-4 shrink-0 mt-px" />
        Team details are maintained by the organiser. If a player needs
        changing, speak to them before the next round is drawn.
      </p>
    </div>
  )
}
