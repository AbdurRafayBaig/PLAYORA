"use client"

import { useState } from "react"
import { Shuffle, Link2, PauseOctagon, Users, CircleAlert } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTournament } from "@/lib/tournament/store"
import { unpairedIn, initials } from "@/lib/tournament/engine"
import { cn } from "@/lib/utils"
import type { Round } from "@/lib/tournament/types"

/**
 * Manual control over who plays whom in the current round.
 *
 * Automatic pairing is a starting point, not a rule. An odd round is the
 * obvious case — 25 winners cannot all be paired — and the organiser may
 * well prefer to add a late entrant over handing someone a free pass, or to
 * choose which team sits out rather than accept whoever the draw left over.
 *
 * Only the current round is editable, and only the parts of it that have not
 * been played.
 */
export function RoundControls({ round }: { round: Round }) {
  const { teams, matches, createMatch, setBye, redrawCurrentRound } = useTournament()
  const [picked, setPicked] = useState<string[]>([])

  const waiting = unpairedIn(round, matches)
  const nameOf = (id: string) => teams.find((t) => t.id === id)?.name ?? "Unknown"
  const byeMatch = matches.find((m) => m.roundIndex === round.index && m.status === "bye")
  const played = matches.some(
    (m) =>
      m.roundIndex === round.index &&
      (m.status === "live" || m.status === "completed"),
  )

  const toggle = (id: string) =>
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-2),
    )

  const pairPicked = () => {
    if (picked.length !== 2) return
    createMatch(picked[0], picked[1])
    setPicked([])
  }

  const byePicked = () => {
    if (picked.length !== 1) return
    setBye(picked[0])
    setPicked([])
  }

  return (
    <div className="px-4 py-4 border-t border-border bg-ink-faint/5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-ink flex items-center gap-2">
            <Users aria-hidden="true" className="w-3.5 h-3.5 text-ludo-indigo-ink" />
            Pair this round yourself
          </h3>
          <p className="text-[11px] text-ink-muted mt-0.5 max-w-lg leading-relaxed">
            {waiting.length === 0
              ? "Every team in this round has a fixture. Unpair one below to change it."
              : `${waiting.length} ${waiting.length === 1 ? "team is" : "teams are"} waiting. Pick two to pair them, or pick one and give it the bye.`}
          </p>
        </div>

        <Button
          onClick={() => redrawCurrentRound("random")}
          disabled={played}
          title={played ? "A match in this round has already started" : undefined}
        >
          <Shuffle aria-hidden="true" className="w-3.5 h-3.5" />
          Redraw round
        </Button>
      </div>

      {waiting.length > 0 && (
        <>
          <ul
            aria-label="Teams waiting for a fixture"
            className="flex flex-wrap gap-2 list-none"
          >
            {waiting.map((id) => {
              const selected = picked.includes(id)
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => toggle(id)}
                    aria-pressed={selected}
                    className={cn(
                      "inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer",
                      selected
                        ? "bg-ludo-flame/15 border-ludo-flame/50 text-ludo-flame-ink"
                        : "bg-surface-raised border-border text-ink-muted hover:text-ink",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold",
                        selected
                          ? "bg-ludo-flame text-on-bright"
                          : "bg-ink-faint/10 text-ink-muted",
                      )}
                    >
                      {initials(nameOf(id))}
                    </span>
                    {nameOf(id)}
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" onClick={pairPicked} disabled={picked.length !== 2}>
              <Link2 aria-hidden="true" className="w-3.5 h-3.5" />
              Pair the two selected
            </Button>
            <Button onClick={byePicked} disabled={picked.length !== 1}>
              <PauseOctagon aria-hidden="true" className="w-3.5 h-3.5" />
              Give this team the bye
            </Button>
            {picked.length > 0 && (
              <button
                type="button"
                onClick={() => setPicked([])}
                className="text-[11px] font-semibold text-ink-muted hover:text-ink cursor-pointer"
              >
                Clear selection
              </button>
            )}
          </div>

          {waiting.length % 2 === 1 && !byeMatch && (
            <p className="text-[11px] text-ludo-mango-ink flex items-start gap-1.5">
              <CircleAlert aria-hidden="true" className="w-3.5 h-3.5 shrink-0 mt-px" />
              An odd number of teams is waiting, so one cannot be paired. Give a
              team the bye, or register a late entrant on the Teams page to make
              the numbers even.
            </p>
          )}
        </>
      )}

      {byeMatch && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ludo-mango/30 bg-ludo-mango/10 px-3 py-2">
          <p className="text-[11px] text-ink">
            <span className="font-bold">{nameOf(byeMatch.teamAId)}</span> has the
            bye and advances without playing.
          </p>
          <Button onClick={() => setBye(null)}>Take the bye back</Button>
        </div>
      )}
    </div>
  )
}
