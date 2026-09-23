"use client"

import { useId, useMemo, useRef, useState } from "react"
import {
  Shuffle, PauseOctagon, Users, CircleAlert, Unlink, Search, X,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTournament } from "@/lib/tournament/store"
import { unpairedIn, initials } from "@/lib/tournament/engine"
import { cn } from "@/lib/utils"
import type { Round } from "@/lib/tournament/types"

/**
 * Manual control over who plays whom in the current round.
 *
 * Built for a field of fifty, not six. Pairing is two taps — pick a team,
 * pick its opponent, and the fixture is created immediately — because at 25
 * ties per round a confirm step would mean seventy-five clicks instead of
 * fifty. Everything is reversible from the fixture row above, so there is no
 * destructive action to guard against.
 *
 * Only the current round is editable, and only the parts of it nobody has
 * started playing.
 */
export function RoundControls({ round }: { round: Round }) {
  const {
    teams, matches, tournament, createMatch, setBye, redrawCurrentRound,
    unpairAll, setPairingMode,
  } = useTournament()

  const [picked, setPicked] = useState<string | null>(null)
  // Mirrored in a ref so two taps in the same tick still pair: reading
  // `picked` from the render closure would miss the first one.
  const pickedRef = useRef<string | null>(null)
  const select = (id: string | null) => {
    pickedRef.current = id
    setPicked(id)
  }
  const [query, setQuery] = useState("")
  const searchId = useId()

  const waiting = unpairedIn(round, matches)
  const nameOf = (id: string) => teams.find((t) => t.id === id)?.name ?? "Unknown"
  const byeMatch = matches.find((m) => m.roundIndex === round.index && m.status === "bye")
  const paired = matches.filter((m) => m.roundIndex === round.index && m.status !== "bye")
  const played = matches.some(
    (m) =>
      m.roundIndex === round.index &&
      (m.status === "live" || m.status === "completed"),
  )
  const manual = tournament?.pairingMode === "manual"

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return waiting
    return waiting.filter((id) => nameOf(id).toLowerCase().includes(q))
    // `waiting` is derived fresh each render; nameOf closes over `teams`.
  }, [waiting, query, teams]) // eslint-disable-line react-hooks/exhaustive-deps

  /** First tap selects, second tap pairs. */
  const tap = (id: string) => {
    const current = pickedRef.current
    if (current === null) {
      select(id)
      return
    }
    if (current === id) {
      select(null)
      return
    }
    createMatch(current, id)
    select(null)
    setQuery("")
  }

  return (
    <div className="px-4 py-4 border-t border-border bg-ink-faint/5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-ink flex items-center gap-2">
            <Users aria-hidden="true" className="w-3.5 h-3.5 text-ludo-indigo-ink" />
            Set this round yourself
          </h3>
          <p className="text-[11px] text-ink-muted mt-0.5 max-w-lg leading-relaxed">
            {waiting.length === 0
              ? "Every team in this round has a fixture. Change any of them with Unpair on the fixture above, or start over with the buttons here."
              : picked
                ? `${nameOf(picked)} selected — now tap its opponent.`
                : `${waiting.length} ${waiting.length === 1 ? "team is" : "teams are"} waiting. Tap a team, then tap its opponent.`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {paired.length > 0 && (
            <Button
              onClick={() => unpairAll(round.index)}
              disabled={played}
              title={played ? "A match in this round has already started" : undefined}
            >
              <Unlink aria-hidden="true" className="w-3.5 h-3.5" />
              Unpair all
            </Button>
          )}
          <Button
            onClick={() => redrawCurrentRound("random")}
            disabled={played}
            title={played ? "A match in this round has already started" : undefined}
          >
            <Shuffle aria-hidden="true" className="w-3.5 h-3.5" />
            Draw for me
          </Button>
        </div>
      </div>

      {/* Whether later rounds arrive paired or empty is the organiser's call,
          not a one-time decision made at the draw. */}
      <label className="flex items-start gap-2.5 text-[11px] text-ink-muted cursor-pointer">
        <input
          type="checkbox"
          checked={manual}
          onChange={(e) => setPairingMode(e.target.checked ? "manual" : "auto")}
          className="mt-0.5 accent-ludo-flame"
        />
        <span>
          <span className="font-bold text-ink">I pair every round myself.</span>{" "}
          Later rounds arrive with all their teams waiting and no fixtures,
          instead of being drawn for you.
        </span>
      </label>

      {waiting.length > 0 && (
        <>
          {/* A fifty-team pool is unusable without a filter. */}
          {waiting.length > 10 && (
            <div className="relative max-w-xs">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-faint"
              />
              <label htmlFor={searchId} className="sr-only">
                Filter waiting teams
              </label>
              <input
                id={searchId}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter teams…"
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-surface text-base sm:text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ludo-flame/40"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear filter"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X aria-hidden="true" className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <ul
            aria-label="Teams waiting for a fixture"
            className="flex flex-wrap gap-2 list-none max-h-64 overflow-y-auto"
          >
            {visible.map((id) => {
              const selected = picked === id
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => tap(id)}
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
            {visible.length === 0 && (
              <li className="text-[11px] text-ink-faint py-2">
                No waiting team matches “{query}”.
              </li>
            )}
          </ul>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                if (pickedRef.current) setBye(pickedRef.current)
                select(null)
              }}
              disabled={!picked}
            >
              <PauseOctagon aria-hidden="true" className="w-3.5 h-3.5" />
              Give the selected team the bye
            </Button>
            {picked && (
              <button
                type="button"
                onClick={() => select(null)}
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
