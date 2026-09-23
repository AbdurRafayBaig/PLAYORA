import { Radio, MapPin, Clock, Trophy } from "lucide-react"
import { StatusBadge } from "./StatusBadge"

interface MatchCardProps {
  id: string
  teamA: string
  teamB: string
  status: "scheduled" | "live" | "completed" | "cancelled" | "paused"
  venue?: string
  table?: string
  time?: string
  round?: string
  winner?: "A" | "B" | null
}

export function MatchCard({
  teamA,
  teamB,
  status,
  venue,
  table,
  time,
  round,
  winner,
}: MatchCardProps) {
  return (
    <div className={`card-base overflow-hidden ${status === "live" ? "ring-2 ring-ludo-red/40" : ""}`}>
      {/* Header Strip */}
      <div className={`px-4 py-2 flex items-center justify-between text-xs font-medium ${
        status === "live"
          ? "bg-ludo-red/10 text-ludo-red"
          : "bg-ink-faint/5 text-ink-muted"
      }`}>
        <span className="flex items-center gap-1.5">
          {round || "Round 1"}
        </span>
        <StatusBadge status={status} />
      </div>

      {/* Teams */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          {/* Team A */}
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
              winner === "A"
                ? "bg-ludo-green/10 text-ludo-green border-2 border-ludo-green/30"
                : "bg-ludo-red/10 text-ludo-red"
            }`}>
              {teamA.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className={`text-sm font-bold text-ink ${winner === "A" ? "text-ludo-green" : ""}`}>
                {teamA}
              </p>
              {winner === "A" && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-ludo-green">
                  <Trophy className="w-3 h-3" /> Winner
                </span>
              )}
            </div>
          </div>

          {/* VS */}
          <div className="mx-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold ${
              status === "live"
                ? "bg-ludo-red text-white animate-pulse-glow"
                : "bg-ink-faint/10 text-ink-muted"
            }`}>
              {status === "live" ? (
                <Radio className="w-4 h-4" />
              ) : (
                "VS"
              )}
            </div>
          </div>

          {/* Team B */}
          <div className="flex items-center gap-3 flex-1 flex-row-reverse text-right">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
              winner === "B"
                ? "bg-ludo-green/10 text-ludo-green border-2 border-ludo-green/30"
                : "bg-ludo-blue/10 text-ludo-blue"
            }`}>
              {teamB.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className={`text-sm font-bold text-ink ${winner === "B" ? "text-ludo-green" : ""}`}>
                {teamB}
              </p>
              {winner === "B" && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-ludo-green">
                  <Trophy className="w-3 h-3" /> Winner
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-3 text-[11px] text-ink-muted pt-1 border-t border-border">
          {venue && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {venue}
            </span>
          )}
          {table && (
            <span className="flex items-center gap-1">
              Table {table}
            </span>
          )}
          {time && (
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" /> {time}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
