import type { Metadata } from "next"
import { MapPin, Plus, Grid2x2 } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { VENUES, getLiveMatches } from "@/lib/data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Venues & Tables" }

export default function AdminVenuesPage() {
  const live = getLiveMatches()
  const totalTables = VENUES.reduce((sum, v) => sum + v.tables, 0)
  const inUse = VENUES.reduce((sum, v) => sum + v.tablesInUse, 0)

  /** Which match, if any, is occupying a given table. */
  const occupant = (venueName: string, table: string) =>
    live.find((m) => m.venue === venueName && m.table === table)

  return (
    <AdminPage
      eyebrow="Competition"
      title="Venues & Tables"
      description={`${inUse} of ${totalTables} tables currently in use across ${VENUES.length} venues.`}
      actions={
        <Button variant="primary">
          <Plus aria-hidden="true" className="w-3.5 h-3.5" />
          Add venue
        </Button>
      }
    >
      <PreviewNotice>
        Table occupancy reflects the live match state. Adding venues and
        reassigning tables activates once the Django API is connected.
      </PreviewNotice>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {VENUES.map((venue) => (
          <section key={venue.id} className="card-base p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                  <MapPin aria-hidden="true" className="w-4 h-4 text-ludo-blue-ink shrink-0" />
                  <span className="truncate">{venue.name}</span>
                </h2>
                <p className="text-[11px] text-ink-muted mt-0.5">{venue.location}</p>
              </div>
              <StatusBadge status={venue.status} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2">
                Tables ({venue.tablesInUse} of {venue.tables} in use)
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 list-none">
                {Array.from({ length: venue.tables }, (_, i) => {
                  const table = `T${i + 1}`
                  const match = occupant(venue.name, table)
                  const busy = Boolean(match)
                  return (
                    <li
                      key={table}
                      className={cn(
                        "rounded-xl border p-3 text-center",
                        busy
                          ? "border-ludo-red/30 bg-ludo-red/5"
                          : venue.status === "closed"
                            ? "border-border bg-ink-faint/5 opacity-60"
                            : "border-ludo-green/30 bg-ludo-green/5",
                      )}
                    >
                      <Grid2x2
                        aria-hidden="true"
                        className={cn(
                          "w-4 h-4 mx-auto mb-1",
                          busy ? "text-ludo-red-ink" : "text-ludo-green-ink",
                        )}
                      />
                      <p className="text-xs font-bold text-ink">{table}</p>
                      <p
                        className={cn(
                          "text-[10px] font-semibold mt-0.5",
                          busy ? "text-ludo-red-ink" : "text-ink-muted",
                        )}
                      >
                        {venue.status === "closed" ? "Closed" : busy ? "In use" : "Free"}
                      </p>
                      {match && (
                        <p className="text-[9px] text-ink-muted truncate mt-0.5">
                          {match.roundShort}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </AdminPage>
  )
}
