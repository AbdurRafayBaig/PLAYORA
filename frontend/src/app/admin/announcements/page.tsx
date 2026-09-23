import type { Metadata } from "next"
import { Megaphone, Pin, Plus, Send } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { ANNOUNCEMENTS } from "@/lib/data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Announcements" }

const audienceStyle = {
  "All teams": "bg-ludo-blue/10 text-ludo-blue-ink border-ludo-blue/25",
  Admins: "bg-ludo-red/10 text-ludo-red-ink border-ludo-red/25",
  Referees: "bg-ludo-green/10 text-ludo-green-ink border-ludo-green/25",
} as const

export default function AdminAnnouncementsPage() {
  const pinned = ANNOUNCEMENTS.filter((a) => a.pinned)
  const rest = ANNOUNCEMENTS.filter((a) => !a.pinned)

  const card = (announcement: (typeof ANNOUNCEMENTS)[number]) => (
    <li
      key={announcement.id}
      className={cn(
        "card-base p-4 space-y-2",
        announcement.pinned && "border-l-4 border-l-ludo-yellow",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-ink flex items-center gap-1.5 min-w-0">
          {announcement.pinned && (
            <Pin aria-label="Pinned" className="w-3.5 h-3.5 text-ludo-yellow-ink shrink-0" />
          )}
          <span className="truncate">{announcement.title}</span>
        </h3>
        <span
          className={cn(
            "px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0",
            audienceStyle[announcement.audience],
          )}
        >
          {announcement.audience}
        </span>
      </div>
      <p className="text-xs text-ink-muted leading-relaxed">{announcement.body}</p>
      <p className="text-[10px] text-ink-faint">Sent {announcement.sentAt}</p>
    </li>
  )

  return (
    <AdminPage
      eyebrow="Operations"
      title="Announcements"
      description="Broadcast messages to teams, referees and admins."
      actions={
        <Button variant="primary">
          <Plus aria-hidden="true" className="w-3.5 h-3.5" />
          New announcement
        </Button>
      }
    >
      <PreviewNotice>
        Composing and sending announcements activates once the Django API is
        connected. Teams see these in their portal notifications.
      </PreviewNotice>

      {/* Composer — visible so the workflow is legible, disabled so it is
          not mistaken for a working send. */}
      <section className="card-base p-4 space-y-3" aria-labelledby="composer">
        <h2 id="composer" className="text-sm font-bold text-ink flex items-center gap-2">
          <Megaphone aria-hidden="true" className="w-4 h-4 text-ludo-red-ink" />
          Compose
        </h2>
        <input
          type="text"
          disabled
          placeholder="Announcement title"
          aria-label="Announcement title"
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink placeholder:text-ink-faint disabled:opacity-60"
        />
        <textarea
          rows={3}
          disabled
          placeholder="What do the teams need to know?"
          aria-label="Announcement body"
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink placeholder:text-ink-faint resize-y disabled:opacity-60"
        />
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[11px] text-ink-faint">
            Sending is disabled in this preview build.
          </p>
          <Button variant="primary" disabled>
            <Send aria-hidden="true" className="w-3.5 h-3.5" />
            Send to all teams
          </Button>
        </div>
      </section>

      {pinned.length > 0 && (
        <section aria-labelledby="pinned-heading" className="space-y-3">
          <h2 id="pinned-heading" className="text-sm font-bold text-ink">
            Pinned
          </h2>
          <ul className="space-y-3 list-none">{pinned.map(card)}</ul>
        </section>
      )}

      <section aria-labelledby="sent-heading" className="space-y-3">
        <h2 id="sent-heading" className="text-sm font-bold text-ink">
          Earlier
        </h2>
        <ul className="space-y-3 list-none">{rest.map(card)}</ul>
      </section>
    </AdminPage>
  )
}
