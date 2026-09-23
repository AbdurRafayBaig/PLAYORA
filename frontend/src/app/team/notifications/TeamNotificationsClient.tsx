"use client"

import { Bell, BellOff, Info, CircleCheck, TriangleAlert } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { EmptyState } from "@/components/ui/EmptyState"
import { NotSignedIn } from "@/components/tournament/NoTournament"
import { useSignedInTeam, useTournament } from "@/lib/tournament/store"
import { cn, pluralise } from "@/lib/utils"
import { formatKickoff } from "@/lib/tournament/engine"

const toneMeta = {
  info: { icon: Info, bg: "bg-ludo-indigo/10", text: "text-ludo-indigo-ink", edge: "border-l-ludo-indigo" },
  success: { icon: CircleCheck, bg: "bg-ludo-lemon/25", text: "text-ludo-lemon-ink", edge: "border-l-ludo-lemon-solid" },
  warning: { icon: TriangleAlert, bg: "bg-ludo-mango/25", text: "text-ludo-mango-ink", edge: "border-l-ludo-mango" },
} as const

export function TeamNotificationsClient() {
  const { ready, notices } = useTournament()
  const team = useSignedInTeam()

  if (!ready) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    )
  }

  if (!team) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <NotSignedIn />
      </div>
    )
  }

  // Broadcast notices (teamId null) plus anything addressed to this team.
  const mine = notices.filter((n) => n.teamId === null || n.teamId === team.id)

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Notifications"
        title="Updates"
        description={
          mine.length > 0
            ? pluralise(mine.length, "update", "updates")
            : "Nothing yet."
        }
        icon={<Bell aria-hidden="true" className="w-5 h-5 text-ludo-flame-ink" />}
      />

      {mine.length === 0 ? (
        <EmptyState
          icon={<BellOff className="w-6 h-6" />}
          title="No notifications yet"
          description="You are told here when your round is published, when a result is recorded, and if you receive a bye."
        />
      ) : (
        <ul className="space-y-3 list-none">
          {mine.map((n) => {
            const meta = toneMeta[n.tone]
            const Icon = meta.icon
            return (
              <li key={n.id} className={cn("card-base p-4 flex gap-3 border-l-4", meta.edge)}>
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-9 h-9 shrink-0 rounded-xl flex items-center justify-center",
                    meta.bg,
                  )}
                >
                  <Icon className={cn("w-4 h-4", meta.text)} />
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h2 className="text-sm font-bold text-ink">{n.title}</h2>
                    <p className="text-[10px] text-ink-faint shrink-0">
                      {formatKickoff(n.at)}
                    </p>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">{n.body}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
