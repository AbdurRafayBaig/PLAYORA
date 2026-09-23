import type { Metadata } from "next"
import { Users, Mail, Phone, Calendar, Trophy, Swords, Percent } from "lucide-react"
import { Panel } from "@/components/ui/Panel"
import { PageHeader } from "@/components/ui/PageHeader"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { getSignedInTeam, getPlayersForTeam } from "@/lib/data"
import { cn, formatDate, getInitials, winRate } from "@/lib/utils"

export const metadata: Metadata = { title: "My Team" }

export default function TeamProfilePage() {
  const team = getSignedInTeam()
  const players = getPlayersForTeam(team.id)

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="My Team"
        title={team.name}
        description={`Team code ${team.code} · Registered ${formatDate(team.registeredOn)}`}
        icon={<Users aria-hidden="true" className="w-5 h-5 text-ludo-red-ink" />}
        actions={<StatusBadge status={team.status} size="md" />}
      />

      {/* Record */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Played", value: team.played, icon: Swords, tint: "text-ink-muted" },
          { label: "Won", value: team.wins, icon: Trophy, tint: "text-ludo-green-ink" },
          { label: "Lost", value: team.losses, icon: Swords, tint: "text-ludo-red-ink" },
          { label: "Win rate", value: `${winRate(team.wins, team.played)}%`, icon: Percent, tint: "text-ludo-blue-ink" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card-base p-4 text-center">
              <Icon aria-hidden="true" className={`w-5 h-5 mx-auto mb-1.5 ${stat.tint}`} />
              <dd className="text-xl font-extrabold text-ink tabular-nums">{stat.value}</dd>
              <dt className="text-[10px] font-medium text-ink-muted">{stat.label}</dt>
            </div>
          )
        })}
      </dl>

      {/* Form guide */}
      <Panel title="Recent form" icon={<Trophy aria-hidden="true" className="w-4 h-4 text-ludo-yellow-ink" />}>
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5"
            aria-label={`Recent form, most recent first: ${team.form.join(", ")}`}
          >
            {team.form.map((result, i) => (
              <span
                key={i}
                aria-hidden="true"
                title={result === "W" ? "Win" : result === "L" ? "Loss" : "Bye"}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center",
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
          <span className="text-[11px] text-ink-muted ml-1">most recent first</span>
        </div>
      </Panel>

      {/* Roster */}
      <Panel
        title={`Roster (${players.length} players)`}
        icon={<Users aria-hidden="true" className="w-4 h-4 text-ink-muted" />}
        flush
      >
        <ul className="divide-y divide-border list-none">
          {players.map((player) => (
            <li key={player.id} className="px-4 py-4 flex items-start gap-3">
              <span
                aria-hidden="true"
                className="w-11 h-11 shrink-0 rounded-full bg-ludo-red/10 flex items-center justify-center text-sm font-bold text-ludo-red-ink"
              >
                {getInitials(player.name)}
              </span>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-ink">{player.name}</p>
                  {player.role === "Captain" && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-ludo-yellow/15 text-ludo-yellow-ink border border-ludo-yellow/30">
                      Captain
                    </span>
                  )}
                </div>
                {/* Tappable: on a phone this is how a teammate actually
                    gets hold of the captain. */}
                <a
                  href={`mailto:${player.email}`}
                  className="flex items-center gap-1.5 text-[11px] text-ludo-blue-ink hover:underline break-all"
                >
                  <Mail aria-hidden="true" className="w-3 h-3 shrink-0" />
                  {player.email}
                </a>
                <a
                  href={`tel:${player.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-1.5 text-[11px] text-ink-muted hover:underline"
                >
                  <Phone aria-hidden="true" className="w-3 h-3 shrink-0" />
                  {player.phone}
                </a>
                <p className="flex items-center gap-1.5 text-[10px] text-ink-faint">
                  <Calendar aria-hidden="true" className="w-3 h-3 shrink-0" />
                  {player.matchesPlayed} matches played
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <p className="text-[11px] text-ink-muted bg-ink-faint/5 border border-border rounded-xl px-3.5 py-2.5 leading-relaxed">
        Roster changes are made by the tournament admin. Contact the organisers
        via the Contact page if a player needs to be swapped before the next round.
      </p>
    </div>
  )
}
