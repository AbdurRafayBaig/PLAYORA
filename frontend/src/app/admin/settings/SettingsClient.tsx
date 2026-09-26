"use client"

import { useState } from "react"
import { Settings, Palette, Database, Trophy, TriangleAlert } from "lucide-react"
import { AdminPage } from "@/components/ui/AdminPage"
import { Panel } from "@/components/ui/Panel"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { useTournament } from "@/lib/tournament/store"
import { CONTACT } from "@/lib/constants"
import { formatDate } from "@/lib/utils"

function Row({
  label,
  value,
  hint,
  action,
}: {
  label: string
  value: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-bold text-ink">{label}</p>
        <p className="text-[11px] text-ink-muted mt-0.5 break-words">{value}</p>
        {hint && <p className="text-[10px] text-ink-faint mt-0.5">{hint}</p>}
      </div>
      {action}
    </div>
  )
}

export function SettingsClient() {
  const { ready, tournament, teams, matches, resetEverything } = useTournament()
  const [confirming, setConfirming] = useState(false)

  if (!ready) {
    return (
      <AdminPage title="Settings">
        <div className="skeleton h-40 rounded-2xl" />
      </AdminPage>
    )
  }

  return (
    <AdminPage
      eyebrow="Setup"
      title="Settings"
      description="Tournament details, appearance and data."
    >
      <Panel
        title="Tournament"
        icon={<Trophy aria-hidden="true" className="w-4 h-4 text-ludo-flame-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <Row label="Name" value={tournament?.name ?? "No tournament created"} />
          <Row label="Venue" value={tournament?.venue ?? CONTACT.venue} />
          <Row
            label="Format"
            value="Single elimination — lose once and you are out"
            hint="Rounds halve until one team remains; an odd round gives one team a bye."
          />
          <Row
            label="Created"
            value={tournament ? formatDate(tournament.createdAt) : "—"}
          />
          <Row
            label="Registered teams"
            value={`${teams.length} teams · ${matches.length} matches drawn`}
          />
        </div>
      </Panel>

      <Panel
        title="Appearance"
        icon={<Palette aria-hidden="true" className="w-4 h-4 text-ludo-orchid-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <Row
            label="Theme"
            value="Follows your device by default"
            hint="Stored in this browser only."
            action={<ThemeToggle />}
          />
        </div>
      </Panel>

      <Panel
        title="Data"
        icon={<Database aria-hidden="true" className="w-4 h-4 text-ink-muted" />}
        flush
      >
        <div className="divide-y divide-border">
          <Row
            label="Where this is stored"
            value="This browser's local storage"
            hint="Teams cannot sign in from their own phones until the database is connected — a login created here exists only on this device."
          />
          <Row
            label="Shared database"
            value="Not connected yet — coming next, so every phone sees the same tournament"
          />
        </div>
      </Panel>

      {/* Destructive, so it is separated, explained, and confirmed. */}
      <section className="card-base border-l-4 border-l-ludo-flame p-5 space-y-3">
        <h2 className="text-sm font-bold text-ink flex items-center gap-2">
          <TriangleAlert aria-hidden="true" className="w-4 h-4 text-ludo-flame-ink" />
          Reset everything
        </h2>
        <p className="text-xs text-ink-muted leading-relaxed max-w-lg">
          Deletes the tournament, every registered team and their logins, the
          whole bracket and all results. There is no undo and nothing is backed
          up anywhere else.
        </p>
        {confirming ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                resetEverything()
                setConfirming(false)
              }}
            >
              Yes, delete everything
            </Button>
            <Button size="md" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirming(true)}>
            <Settings aria-hidden="true" className="w-3.5 h-3.5" />
            Reset tournament data
          </Button>
        )}
      </section>
    </AdminPage>
  )
}
