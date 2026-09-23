"use client"

import { useRef } from "react"
import { Crown, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { initials } from "@/lib/tournament/engine"
import type { Match, Round, Team } from "@/lib/tournament/types"

/**
 * Knockout bracket.
 *
 * This replaces the old points table. In a single-elimination draw a league
 * table carries no information — every surviving team has won every match it
 * played, so they would all sit level on points. What a captain and a
 * spectator actually want to know is *how far each team got*, which is the
 * bracket.
 *
 * Laid out as a horizontally scrolling set of round columns: on desktop the
 * whole draw is visible at once, on a phone you swipe through rounds, and
 * the markup stays one ordered list per round either way.
 */
export function BracketView({
  rounds,
  matches,
  teams,
  currentRound,
  championId,
  highlightTeamId,
}: {
  rounds: Round[]
  matches: Match[]
  teams: Team[]
  currentRound: number
  championId: string | null
  highlightTeamId?: string | null
}) {
  const nameOf = (id: string | null) =>
    id ? (teams.find((t) => t.id === id)?.name ?? "Unknown") : null

  const champion = championId ? nameOf(championId) : null
  const scroller = useRef<HTMLDivElement>(null)

  /* A 48-team draw is seven columns wide and 24 cards deep in the first
     one. Scrolling to a round by hand is miserable, so each round gets a
     jump target. */
  const jumpTo = (index: number) => {
    const el = scroller.current?.querySelector<HTMLElement>(
      `[data-round="${index}"]`,
    )
    el?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
  }

  return (
    <div className="space-y-3">
      {rounds.length > 2 && (
        <div
          className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 no-print"
          aria-label="Jump to a round"
        >
          {rounds.map((r) => (
            <button
              key={r.index}
              type="button"
              onClick={() => jumpTo(r.index)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer",
                r.index === currentRound && !championId
                  ? "bg-ludo-flame/15 border-ludo-flame/40 text-ludo-flame-ink"
                  : "bg-surface-raised border-border text-ink-muted hover:text-ink",
              )}
            >
              {r.name}
              <span className="ml-1.5 text-ink-faint">{r.size}</span>
            </button>
          ))}
        </div>
      )}

    <div
      ref={scroller}
      tabIndex={0}
      role="region"
      aria-label="Tournament bracket"
      className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      <div className="flex gap-4 min-w-min">
        {rounds.map((round) => {
          const inRound = matches.filter((m) => m.roundIndex === round.index)
          const isCurrent = round.index === currentRound && !championId
          const notDrawn = inRound.length === 0

          return (
            <section
              key={round.index}
              data-round={round.index}
              aria-labelledby={`bracket-round-${round.index}`}
              className="w-[15rem] shrink-0 scroll-mt-4"
            >
              <header
                className={cn(
                  "rounded-xl px-3 py-2 mb-3 border",
                  isCurrent
                    ? "bg-ludo-flame/10 border-ludo-flame/30"
                    : "bg-ink-faint/5 border-border",
                )}
              >
                <h2
                  id={`bracket-round-${round.index}`}
                  className="text-sm font-bold text-ink flex items-center gap-2"
                >
                  {round.name}
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ludo-flame-ink">
                      In play
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-ink-muted">
                  {round.size} {round.size === 1 ? "team" : "teams"}
                  {!round.published && !notDrawn && (
                    <span className="inline-flex items-center gap-1 ml-2 text-ink-faint">
                      <Lock aria-hidden="true" className="w-3 h-3" />
                      Unpublished
                    </span>
                  )}
                </p>
              </header>

              {notDrawn ? (
                <p className="text-[11px] text-ink-faint px-3 py-6 text-center border border-dashed border-border rounded-xl">
                  Drawn once the previous round finishes.
                </p>
              ) : (
                <ol className="space-y-2 list-none">
                  {inRound.map((match) => (
                    <li key={match.id}>
                      <div
                        className={cn(
                          "rounded-xl border overflow-hidden",
                          match.status === "live"
                            ? "border-ludo-flame/50 bg-ludo-flame/5"
                            : "border-border bg-surface-raised",
                        )}
                      >
                        {[match.teamAId, match.teamBId].map((teamId, i) => {
                          const label = teamId ? nameOf(teamId) : "Bye"
                          const won = Boolean(match.winnerId) && match.winnerId === teamId
                          const lost = Boolean(match.winnerId) && teamId !== null && !won
                          const mine = highlightTeamId && teamId === highlightTeamId

                          return (
                            <div
                              key={i}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2",
                                i === 0 && "border-b border-border",
                                won && "bg-ludo-lemon/15",
                                lost && "opacity-55",
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "w-6 h-6 shrink-0 rounded-md text-[9px] font-bold flex items-center justify-center",
                                  won
                                    ? "bg-ludo-lemon text-on-bright"
                                    : "bg-ink-faint/10 text-ink-muted",
                                )}
                              >
                                {teamId ? initials(label ?? "") : "—"}
                              </span>
                              <span
                                className={cn(
                                  "text-xs truncate flex-1 min-w-0",
                                  won ? "font-bold text-ink" : "text-ink-muted",
                                )}
                                title={label ?? undefined}
                              >
                                {label ?? "Bye"}
                              </span>
                              {mine && (
                                <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold rounded bg-ludo-orchid-solid text-white">
                                  You
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )
        })}

        {/* Champion column — the payoff the whole bracket points at. */}
        <section aria-labelledby="bracket-champion" className="w-[15rem] shrink-0">
          <header className="rounded-xl px-3 py-2 mb-3 border bg-ludo-mango/15 border-ludo-mango/40">
            <h2
              id="bracket-champion"
              className="text-sm font-bold text-ink flex items-center gap-2"
            >
              <Crown aria-hidden="true" className="w-4 h-4 text-ludo-mango-ink" />
              Champion
            </h2>
            <p className="text-[11px] text-ink-muted">1 team</p>
          </header>

          {champion ? (
            <div className="rounded-xl border-2 border-ludo-mango bg-ludo-mango/10 px-3 py-4 text-center">
              <Crown
                aria-hidden="true"
                className="w-6 h-6 mx-auto text-ludo-mango-ink mb-1"
              />
              <p className="text-sm font-extrabold text-ink">{champion}</p>
              <p className="text-[10px] text-ink-muted mt-0.5">Tournament winner</p>
            </div>
          ) : (
            <p className="text-[11px] text-ink-faint px-3 py-6 text-center border border-dashed border-border rounded-xl">
              Still to be decided.
            </p>
          )}
        </section>
      </div>
    </div>
    </div>
  )
}
