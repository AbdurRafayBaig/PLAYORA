import { Radio, MapPin, Clock, Trophy, Grid2x2 } from "lucide-react"
import { StatusBadge } from "./StatusBadge"
import { cn, getInitials } from "@/lib/utils"
import type { MatchStatus } from "@/lib/types"

interface MatchCardProps {
  id: string
  teamA: string
  teamB: string
  status: MatchStatus
  scoreA?: number
  scoreB?: number
  venue?: string
  table?: string
  time?: string
  day?: string
  round?: string
  winner?: "A" | "B" | null
  className?: string
}

/** One side of the fixture. Kept local — nothing else needs it. */
function Side({
  name,
  score,
  isWinner,
  align,
  accent,
  showScore,
}: {
  name: string
  score?: number
  isWinner: boolean
  align: "left" | "right"
  accent: "red" | "blue"
  showScore: boolean
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
      <div
        aria-hidden="true"
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
          isWinner
            ? "bg-ludo-green/15 text-ludo-green-ink ring-2 ring-ludo-green/40"
            : accent === "red"
              ? "bg-ludo-red/10 text-ludo-red-ink"
              : "bg-ludo-blue/10 text-ludo-blue-ink",
        )}
      >
        {getInitials(name)}
      </div>

      <div className="min-w-0">
        <p
          className={cn(
            "text-sm font-bold leading-tight",
            isWinner ? "text-ludo-green-ink" : "text-ink",
          )}
          title={name}
        >
          {name}
        </p>
        <div
          className={cn(
            "flex items-center gap-1.5",
            align === "right" && "justify-end",
          )}
        >
          {showScore && typeof score === "number" && (
            <span className="text-lg font-extrabold text-ink tabular-nums leading-none">
              {score}
            </span>
          )}
          {isWinner && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-ludo-green-ink">
              <Trophy aria-hidden="true" className="w-3 h-3" /> Winner
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function MatchCard({
  teamA,
  teamB,
  status,
  scoreA,
  scoreB,
  venue,
  table,
  time,
  day,
  round,
  winner,
  className,
}: MatchCardProps) {
  const isLive = status === "live"
  const showScore =
    (isLive || status === "completed" || status === "paused") &&
    typeof scoreA === "number" &&
    typeof scoreB === "number"

  /* One accessible sentence per card, so a screen reader is not left
     stitching together a grid of initials and numbers. */
  const summary = [
    round ? `${round}:` : "Match:",
    teamA,
    showScore ? `${scoreA} versus ${scoreB}` : "versus",
    teamB,
    `— ${status}`,
    winner === "A" ? `. ${teamA} won.` : winner === "B" ? `. ${teamB} won.` : "",
    venue ? ` At ${venue}${table ? `, table ${table}` : ""}.` : "",
    time ? ` ${day ? `${day}, ` : ""}${time}.` : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <article
      aria-label={summary}
      className={cn(
        "card-base overflow-hidden",
        isLive && "ring-2 ring-ludo-red/40",
        className,
      )}
    >
      {/* Header strip */}
      <div
        className={cn(
          "px-4 py-2 flex items-center justify-between gap-2 text-xs font-medium",
          isLive ? "bg-ludo-red/10 text-ludo-red-ink" : "bg-ink-faint/5 text-ink-muted",
        )}
      >
        <span className="truncate">{round ?? "Match"}</span>
        <StatusBadge status={status} />
      </div>

      {/* Teams */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <Side
            name={teamA}
            score={scoreA}
            isWinner={winner === "A"}
            align="left"
            accent="red"
            showScore={showScore}
          />

          <div
            className={cn(
              "w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-[10px] font-extrabold",
              isLive
                ? "bg-ludo-red-solid text-white animate-pulse-glow"
                : "bg-ink-faint/10 text-ink-muted",
            )}
          >
            {isLive ? <Radio className="w-4 h-4" /> : "VS"}
          </div>

          <Side
            name={teamB}
            score={scoreB}
            isWinner={winner === "B"}
            align="right"
            accent="blue"
            showScore={showScore}
          />
        </div>

        {/* Meta row — wraps rather than overflowing on a narrow phone */}
        {(venue || table || time) && (
          <div
            aria-hidden="true"
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted pt-2 border-t border-border"
          >
            {venue && (
              <span className="inline-flex items-center gap-1 min-w-0">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{venue}</span>
              </span>
            )}
            {table && (
              <span className="inline-flex items-center gap-1">
                <Grid2x2 className="w-3 h-3 shrink-0" />
                Table {table}
              </span>
            )}
            {time && (
              <span className="inline-flex items-center gap-1 sm:ml-auto">
                <Clock className="w-3 h-3 shrink-0" />
                {day ? `${day}, ` : ""}
                {time}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
