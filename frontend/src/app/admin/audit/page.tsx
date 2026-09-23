import type { Metadata } from "next"
import { Download, Info, TriangleAlert, ShieldAlert } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { AUDIT_LOG } from "@/lib/data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Audit Log" }

/** Severity carries an icon as well as a colour, so it survives greyscale. */
const severityMeta = {
  info: { icon: Info, dot: "bg-ludo-blue", text: "text-ludo-blue-ink", label: "Info" },
  warning: { icon: TriangleAlert, dot: "bg-ludo-yellow", text: "text-ludo-yellow-ink", label: "Warning" },
  critical: { icon: ShieldAlert, dot: "bg-ludo-red", text: "text-ludo-red-ink", label: "Critical" },
} as const

export default function AdminAuditPage() {
  return (
    <AdminPage
      eyebrow="Operations"
      title="Audit Log"
      description="Every administrative action, with who did it and when. Entries cannot be edited or deleted."
      actions={
        <Button>
          <Download aria-hidden="true" className="w-3.5 h-3.5" />
          Export log
        </Button>
      }
    >
      <PreviewNotice>
        Showing the most recent {AUDIT_LOG.length} entries from the demo
        dataset. Filtering by actor, date and severity arrives with the API.
      </PreviewNotice>

      {/* Vertical timeline: an audit trail is fundamentally chronological,
          and a table hides that. */}
      <ol className="card-base divide-y divide-border list-none overflow-hidden">
        {AUDIT_LOG.map((entry) => {
          const meta = severityMeta[entry.severity]
          const Icon = meta.icon
          return (
            <li
              key={entry.id}
              className="px-4 py-3.5 flex gap-3 transition-colors hover:bg-ink-faint/5"
            >
              <span
                className={cn(
                  "w-8 h-8 shrink-0 rounded-lg flex items-center justify-center mt-0.5",
                  entry.severity === "info"
                    ? "bg-ludo-blue/10"
                    : entry.severity === "warning"
                      ? "bg-ludo-yellow/15"
                      : "bg-ludo-red/10",
                )}
              >
                <Icon aria-hidden="true" className={cn("w-4 h-4", meta.text)} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <p className="text-sm font-semibold text-ink">{entry.action}</p>
                  <p className="text-[10px] text-ink-faint tabular-nums">{entry.at}</p>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">{entry.target}</p>
                <p className="text-[10px] text-ink-faint mt-1">
                  <span className="font-mono">{entry.id}</span> · by {entry.actor} ·{" "}
                  <span className={meta.text}>{meta.label}</span>
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </AdminPage>
  )
}
