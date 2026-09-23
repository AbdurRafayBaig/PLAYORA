"use client"

import { Radio, MapPin, Clock, Trophy, Grid2x2, Timer } from "lucide-react"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { cn } from "@/lib/utils"
import { elapsedSince, formatKickoff, initials } from "@/lib/tournament/engine"
import { useNow } from "@/lib/useNow"
import type { Match, Team } from "@/lib/tournament/types"

/** Ticking clock for a live match, driven by the shared page ticker. */
function LiveClock({ startedAt }: { startedAt: string | null }) {
  const now = useNow()

  return (
    <span className="inline-flex items-center gap-1 tabular-nums">
      <Timer aria-hidden="true" className="w-3 h-3 shrink-0" />
      {now === null ? "—" : elapsedSince(startedAt, now)}
    </span>
  )
}

function Side({
  name,
  isWinner,
  align,
  accent,
}: {
  name: string
  isWinner: boolean
  align: "left" | "right"
  accent: "flame" | "indigo"
}) {
  return (
    <div
      className={cn(
        // min-w-0 is what stops a long team name from shoving the VS badge
        // off a 320px screen instead of wrapping.
        "flex items-center gap-2 flex-1 min-w-0",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
          isWinner
            ? "bg-ludo-lemon text-on-bright ring-2 ring-ludo-lemon-solid/40"
            : accent === "flame"
              ? "bg-ludo-flame/10 text-ludo-flame-ink"
              : "bg-ludo-indigo/10 text-ludo-indigo-ink",
        )}
      >
        {initials(name)}
      </span>

      <span className="min-w-0">
        <span
          className={cn(
            "block text-sm font-bold leading-tight",
            isWinner ? "text-ludo-lemon-ink" : "text-ink",
          )}
          title={name}
        >
          {name}
        </span>
        {isWinner && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[10px] font-semibold text-ludo-lemon-ink",
              align === "right" && "flex-row-reverse",
            )}
          >
            <Trophy aria-hidden="true" className="w-3 h-3" /> Advanced
          </span>
        )}
      </span>
    </div>
  )
}

export function MatchCard({
  match,
  teams,
  roundName,
  highlightTeamId,
  className,
}: {
  match: Match
  teams: Team[]
  roundName: string
  /** Draws attention to the viewer's own team. */
  highlightTeamId?: string | null
  className?: string
}) {
  const name = (id: string | null) =>
    id ? (teams.find((t) => t.id === id)?.name ?? "Unknown team") : "Bye"

  const isLive = match.status === "live"
  const isBye = match.status === "bye"
  const teamAName = name(match.teamAId)
  const teamBName = name(match.teamBId)
  const mine =
    highlightTeamId &&
    (match.teamAId === highlightTeamId || match.teamBId === highlightTeamId)

  const summary = [
    `${roundName}:`,
    teamAName,
    isBye ? "receives a bye" : `versus ${teamBName}`,
    `— ${match.status}`,
    match.winnerId ? `. ${name(match.winnerId)} advanced.` : "",
    match.table && match.table !== "—" ? ` Table ${match.table}.` : "",
    match.startsAt ? ` ${formatKickoff(match.startsAt)}.` : "",
  ]
    .filter(Boolean)
    .join(" ")

  if (isBye) {
    return (
      <article
        aria-label={summary}
        className={cn("card-base p-4 flex items-center gap-3", className)}
      >
        <span
          aria-hidden="true"
          className="w-10 h-10 shrink-0 rounded-xl bg-ludo-mango/20 text-ludo-mango-ink flex items-center justify-center text-xs font-bold"
        >
          {initials(teamAName)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-ink truncate">{teamAName}</span>
          <span className="block text-[11px] text-ink-muted">
            Bye — advances without playing
          </span>
        </span>
        <StatusBadge status="bye" />
      </article>
    )
  }

  return (
    <article
      aria-label={summary}
      className={cn(
        "card-base overflow-hidden",
        isLive && "ring-2 ring-ludo-flame/50",
        mine && !isLive && "ring-2 ring-ludo-orchid/40",
        className,
      )}
    >
      <div
        className={cn(
          "px-4 py-2 flex items-center justify-between gap-2 text-xs font-medium",
          isLive ? "bg-ludo-flame/15 text-ludo-flame-ink" : "bg-ink-faint/5 text-ink-muted",
        )}
      >
        <span className="truncate">{roundName}</span>
        <span className="flex items-center gap-2 shrink-0">
          {isLive && <LiveClock startedAt={match.startedAt} />}
          <StatusBadge status={match.status} />
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <Side
            name={teamAName}
            isWinner={match.winnerId === match.teamAId}
            align="left"
            accent="flame"
          />

          <span
            className={cn(
              "w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-[10px] font-extrabold",
              isLive
                ? "bg-ludo-flame text-on-bright animate-pulse-glow"
                : "bg-ink-faint/10 text-ink-muted",
            )}
          >
            {isLive ? <Radio className="w-4 h-4" /> : "VS"}
          </span>

          <Side
            name={teamBName}
            isWinner={match.winnerId === match.teamBId}
            align="right"
            accent="indigo"
          />
        </div>

        <div
          aria-hidden="true"
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted pt-2 border-t border-border"
        >
          {match.table && (
            <span className="inline-flex items-center gap-1">
              <Grid2x2 className="w-3 h-3 shrink-0" />
              Table {match.table}
            </span>
          )}
          <span className="inline-flex items-center gap-1 min-w-0">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">Cafe</span>
          </span>
          <span className="inline-flex items-center gap-1 sm:ml-auto">
            <Clock className="w-3 h-3 shrink-0" />
            {formatKickoff(match.startsAt)}
          </span>
        </div>
      </div>
    </article>
  )
}
