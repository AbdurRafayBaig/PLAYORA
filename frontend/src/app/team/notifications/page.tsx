import type { Metadata } from "next"
import { Bell, BellOff, Info, CircleCheck, TriangleAlert } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { EmptyState } from "@/components/ui/EmptyState"
import { NOTIFICATIONS, ANNOUNCEMENTS } from "@/lib/data"
import { cn, pluralise } from "@/lib/utils"

export const metadata: Metadata = { title: "Notifications" }

const toneMeta = {
  info: { icon: Info, bg: "bg-ludo-blue/10", text: "text-ludo-blue-ink" },
  success: { icon: CircleCheck, bg: "bg-ludo-green/10", text: "text-ludo-green-ink" },
  warning: { icon: TriangleAlert, bg: "bg-ludo-yellow/15", text: "text-ludo-yellow-ink" },
} as const

export default function TeamNotificationsPage() {
  const unread = NOTIFICATIONS.filter((n) => !n.read)
  const pinned = ANNOUNCEMENTS.filter((a) => a.pinned && a.audience === "All teams")

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Notifications"
        title="Updates"
        description={
          unread.length > 0
            ? `${pluralise(unread.length, "unread update", "unread updates")}`
            : "You are all caught up."
        }
        icon={<Bell aria-hidden="true" className="w-5 h-5 text-ludo-red-ink" />}
      />

      {/* Pinned tournament announcements sit above personal updates, because
          a check-in rule change outranks a score notification. */}
      {pinned.length > 0 && (
        <section aria-labelledby="pinned-heading" className="space-y-3">
          <h2 id="pinned-heading" className="text-sm font-bold text-ink">
            Pinned by the organisers
          </h2>
          <ul className="space-y-3 list-none">
            {pinned.map((a) => (
              <li
                key={a.id}
                className="card-base p-4 space-y-1.5 border-l-4 border-l-ludo-yellow"
              >
                <h3 className="text-sm font-bold text-ink">{a.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{a.body}</p>
                <p className="text-[10px] text-ink-faint">{a.sentAt}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="updates-heading" className="space-y-3">
        <h2 id="updates-heading" className="text-sm font-bold text-ink">
          Your updates
        </h2>

        {NOTIFICATIONS.length === 0 ? (
          <EmptyState
            icon={<BellOff className="w-6 h-6" />}
            title="Nothing yet"
            description="Match reminders, result confirmations and schedule changes will show up here."
          />
        ) : (
          <ul className="space-y-3 list-none">
            {NOTIFICATIONS.map((n) => {
              const meta = toneMeta[n.tone]
              const Icon = meta.icon
              return (
                <li
                  key={n.id}
                  className={cn(
                    "card-base p-4 flex gap-3",
                    // Unread gets a border as well as a tint, so the
                    // distinction is not carried by colour alone.
                    !n.read && "border-l-4 border-l-ludo-red",
                  )}
                >
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
                      <h3 className="text-sm font-bold text-ink">
                        {n.title}
                        {!n.read && (
                          <span className="ml-2 align-middle px-1.5 py-0.5 text-[9px] font-bold rounded bg-ludo-red-solid text-white">
                            New
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-ink-faint shrink-0">{n.at}</p>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed">{n.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
