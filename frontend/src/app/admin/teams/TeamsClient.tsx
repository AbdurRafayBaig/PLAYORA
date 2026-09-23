"use client"

import { useState } from "react"
import {
  Plus, Users, Copy, Check, RefreshCw, Trash2, Printer, Eye, EyeOff, KeyRound,
} from "lucide-react"
import { AdminPage } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { PrintButton } from "@/components/ui/PrintButton"
import { useTournament } from "@/lib/tournament/store"
import { initials } from "@/lib/tournament/engine"
import { cn } from "@/lib/utils"
import type { Team } from "@/lib/tournament/types"

/** Copy-to-clipboard that reports success inline rather than silently. */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          /* Clipboard blocked (insecure context) — the value is on screen. */
        }
      }}
      className="w-8 h-8 shrink-0 inline-flex items-center justify-center rounded-lg text-ink-muted hover:text-ink hover:bg-ink-faint/10 transition-colors cursor-pointer"
    >
      {copied ? (
        <Check aria-hidden="true" className="w-3.5 h-3.5 text-ludo-lemon-ink" />
      ) : (
        <Copy aria-hidden="true" className="w-3.5 h-3.5" />
      )}
      <span className="sr-only" role="status">
        {copied ? `${label} copied` : ""}
      </span>
    </button>
  )
}

function TeamRow({ team, locked }: { team: Team; locked: boolean }) {
  const { removeTeam, regeneratePassword } = useTournament()
  const [shown, setShown] = useState(false)

  return (
    <li className="px-4 py-4 space-y-3">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="w-10 h-10 shrink-0 rounded-xl bg-ludo-orchid/15 text-ludo-orchid-ink flex items-center justify-center text-xs font-bold"
        >
          {initials(team.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink truncate">{team.name}</p>
          <p className="text-[11px] text-ink-muted truncate">
            {team.players.length > 0
              ? team.players.map((p) => p.name).join(" · ")
              : "No players recorded"}
          </p>
        </div>
        <StatusBadge status={team.status} />
      </div>

      {/* The handover block. This is what gets read out at the desk, so the
          code and password are monospaced and individually copyable. */}
      <div className="rounded-xl border border-dashed border-border bg-ink-faint/5 p-3 grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted w-16 shrink-0">
            Team ID
          </span>
          <code className="font-mono text-sm font-bold text-ink truncate">{team.code}</code>
          <CopyButton value={team.code} label={`team ID for ${team.name}`} />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted w-16 shrink-0">
            Password
          </span>
          <code className="font-mono text-sm font-bold text-ink truncate">
            {shown ? team.password : "••••••••"}
          </code>
          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown}
            className="w-8 h-8 shrink-0 inline-flex items-center justify-center rounded-lg text-ink-muted hover:text-ink hover:bg-ink-faint/10 transition-colors cursor-pointer"
          >
            {shown ? (
              <EyeOff aria-hidden="true" className="w-3.5 h-3.5" />
            ) : (
              <Eye aria-hidden="true" className="w-3.5 h-3.5" />
            )}
          </button>
          <CopyButton value={team.password} label={`password for ${team.name}`} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 no-print">
        <Button onClick={() => regeneratePassword(team.id)}>
          <RefreshCw aria-hidden="true" className="w-3.5 h-3.5" />
          New password
        </Button>
        {!locked && (
          <Button variant="danger" onClick={() => removeTeam(team.id)}>
            <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
            Remove
          </Button>
        )}
      </div>
    </li>
  )
}

export function TeamsClient() {
  const { ready, tournament, teams, addTeam } = useTournament()
  const [name, setName] = useState("")
  const [p1, setP1] = useState("")
  const [p2, setP2] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [justAdded, setJustAdded] = useState<Team | null>(null)

  if (!ready) {
    return (
      <AdminPage title="Teams & Logins">
        <div className="skeleton h-40 rounded-2xl" />
      </AdminPage>
    )
  }

  if (!tournament) {
    return (
      <AdminPage title="Teams & Logins">
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No tournament yet"
          description="Create a tournament on the dashboard before registering teams."
        />
      </AdminPage>
    )
  }

  // Teams can no longer be *removed* after the draw — that would leave a
  // hole in a bracket someone has already been told about. Adding is still
  // allowed: late entrants turn up, and an odd round is often better solved
  // with one more team than with a bye.
  const locked = tournament.phase !== "setup"
  const running = tournament.phase === "running"

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Enter a team name.")
      return
    }
    if (teams.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("A team with that name is already registered.")
      return
    }
    const created = addTeam({
      name: trimmed,
      players: [
        { name: p1, phone: "" },
        { name: p2, phone: "" },
      ],
    })
    if (created) {
      setJustAdded(created)
      setName("")
      setP1("")
      setP2("")
    }
  }

  return (
    <AdminPage
      eyebrow="Run the tournament"
      title="Teams & Logins"
      description={`${teams.length} registered. Each team gets an ID and password to hand over at registration.`}
      actions={
        teams.length > 0 ? (
          <PrintButton label="Print the credential sheet">
            <Printer aria-hidden="true" className="w-3.5 h-3.5" />
            Print sheet
          </PrintButton>
        ) : undefined
      }
    >
      {locked && (
        <p className="text-[11px] text-ink-muted bg-ludo-mango/15 border border-ludo-mango/30 rounded-xl px-3.5 py-2.5 leading-relaxed">
          {running
            ? "The draw has been made. A team added now joins the round in play unpaired — go to Fixtures to choose who it plays. Existing teams can no longer be removed, because the bracket already refers to them."
            : "This tournament is finished. Teams are read-only."}
        </p>
      )}

      {tournament.phase === "complete" ? null : (
        <form onSubmit={handleAdd} className="card-base p-5 space-y-4 no-print">
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <Plus aria-hidden="true" className="w-4 h-4 text-ludo-flame-ink" />
            Register a team
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-3">
              <label htmlFor="team-name" className="block text-xs font-semibold text-ink">
                Team name
              </label>
              <input
                id="team-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Thunder Hawks"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "team-error" : undefined}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ludo-flame/40"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="p1" className="block text-xs font-semibold text-ink">
                Player 1
              </label>
              <input
                id="p1"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                placeholder="Captain"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ludo-flame/40"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="p2" className="block text-xs font-semibold text-ink">
                Player 2
              </label>
              <input
                id="p2"
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                placeholder="Partner"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ludo-flame/40"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="primary" size="md" className="w-full">
                <Plus aria-hidden="true" className="w-4 h-4" />
                {running ? "Add to current round" : "Add team"}
              </Button>
            </div>
          </div>

          {error && (
            <p
              id="team-error"
              role="alert"
              className="text-xs text-ludo-flame-ink bg-ludo-flame/10 border border-ludo-flame/25 rounded-xl px-3 py-2.5"
            >
              {error}
            </p>
          )}

          {justAdded && (
            <div
              role="status"
              className="rounded-xl border border-ludo-lemon-solid/30 bg-ludo-lemon/20 px-4 py-3"
            >
              <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                <KeyRound aria-hidden="true" className="w-3.5 h-3.5" />
                {justAdded.name} registered — give the captain these now
              </p>
              <p className="text-sm font-mono font-bold text-ink mt-1">
                ID {justAdded.code} · Password {justAdded.password}
              </p>
            </div>
          )}
        </form>
      )}

      {teams.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No teams yet"
          description="Register the first team above. PLAYORA issues its ID and password automatically."
        />
      ) : (
        <section className="card-base overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-bold text-ink">
              Registered teams ({teams.length})
            </h2>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Print this sheet to hand credentials out at the desk.
            </p>
          </div>
          <ul className={cn("divide-y divide-border list-none")}>
            {teams.map((team) => (
              <TeamRow key={team.id} team={team} locked={locked} />
            ))}
          </ul>
        </section>
      )}
    </AdminPage>
  )
}
