import type { Metadata } from "next"
import { AlertTriangle, Check, X, ShieldCheck } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { DISPUTES, MATCHES } from "@/lib/data"
import { pluralise } from "@/lib/utils"

export const metadata: Metadata = { title: "Disputes" }

export default function AdminDisputesPage() {
  const open = DISPUTES.filter((d) => d.status === "open" || d.status === "reviewing")
  const closed = DISPUTES.filter((d) => d.status === "resolved" || d.status === "rejected")

  const matchLabel = (matchId: string) => {
    const match = MATCHES.find((m) => m.id === matchId)
    return match ? `${match.teamA} vs ${match.teamB}` : matchId
  }

  return (
    <AdminPage
      eyebrow="Operations"
      title="Disputes"
      description={`${pluralise(open.length, "dispute", "disputes")} awaiting a decision.`}
    >
      <PreviewNotice>
        Resolving a dispute will lock or reopen the associated match result once
        the Django API is connected.
      </PreviewNotice>

      <section aria-labelledby="open-disputes" className="space-y-3">
        <h2 id="open-disputes" className="text-sm font-bold text-ink flex items-center gap-2">
          <AlertTriangle aria-hidden="true" className="w-4 h-4 text-ludo-yellow-ink" />
          Needs attention
        </h2>

        {open.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="w-6 h-6" />}
            title="No open disputes"
            description="Every raised dispute has been resolved. New ones appear here within the 15-minute window after a result is submitted."
          />
        ) : (
          <ul className="space-y-3 list-none">
            {open.map((dispute) => (
              <li
                key={dispute.id}
                className="card-base p-4 space-y-3 border-l-4 border-l-ludo-yellow"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">
                      {dispute.id} · {matchLabel(dispute.matchId)}
                    </p>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      Raised by {dispute.raisedBy} · {dispute.raisedAt}
                    </p>
                  </div>
                  <StatusBadge status={dispute.status} size="md" />
                </div>

                <p className="text-xs text-ink-muted leading-relaxed bg-ink-faint/5 rounded-xl px-3 py-2.5">
                  {dispute.reason}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">
                    <Check aria-hidden="true" className="w-3.5 h-3.5" />
                    Uphold &amp; correct result
                  </Button>
                  <Button variant="danger">
                    <X aria-hidden="true" className="w-3.5 h-3.5" />
                    Reject
                  </Button>
                  <Button>View match</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {closed.length > 0 && (
        <section aria-labelledby="closed-disputes" className="space-y-3">
          <h2 id="closed-disputes" className="text-sm font-bold text-ink">
            Closed
          </h2>
          <ul className="card-base divide-y divide-border list-none overflow-hidden">
            {closed.map((dispute) => (
              <li
                key={dispute.id}
                className="px-4 py-3 flex flex-wrap items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink">
                    {dispute.id} · {matchLabel(dispute.matchId)}
                  </p>
                  <p className="text-[10px] text-ink-muted truncate">{dispute.reason}</p>
                </div>
                <StatusBadge status={dispute.status} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </AdminPage>
  )
}
