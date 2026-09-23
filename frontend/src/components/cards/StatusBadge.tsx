import { Radio } from "lucide-react"

interface StatusBadgeProps {
  status: string
  size?: "sm" | "md"
}

const statusConfig: Record<string, { label: string; colorClass: string; pulse?: boolean }> = {
  scheduled:    { label: "Scheduled",    colorClass: "bg-ludo-blue/10 text-ludo-blue border-ludo-blue/20" },
  checkin:      { label: "Check-in",     colorClass: "bg-ludo-yellow/10 text-ludo-yellow-dark border-ludo-yellow/20" },
  ready:        { label: "Ready",        colorClass: "bg-ludo-yellow/10 text-ludo-yellow-dark border-ludo-yellow/20" },
  live:         { label: "LIVE",         colorClass: "bg-ludo-red/10 text-ludo-red border-ludo-red/20", pulse: true },
  paused:       { label: "Paused",       colorClass: "bg-ludo-yellow/10 text-ludo-yellow-dark border-ludo-yellow/20" },
  completed:    { label: "Completed",    colorClass: "bg-ludo-green/10 text-ludo-green border-ludo-green/20" },
  cancelled:    { label: "Cancelled",    colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/20" },
  postponed:    { label: "Postponed",    colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/20" },
  walkover:     { label: "Walkover",     colorClass: "bg-ludo-yellow/10 text-ludo-yellow-dark border-ludo-yellow/20" },
  active:       { label: "Active",       colorClass: "bg-ludo-green/10 text-ludo-green border-ludo-green/20" },
  qualified:    { label: "Qualified",    colorClass: "bg-ludo-green/10 text-ludo-green border-ludo-green/20" },
  eliminated:   { label: "Eliminated",   colorClass: "bg-ludo-red/10 text-ludo-red border-ludo-red/20" },
  disqualified: { label: "Disqualified", colorClass: "bg-ludo-red/10 text-ludo-red border-ludo-red/20" },
  bye:          { label: "Bye",          colorClass: "bg-ludo-yellow/10 text-ludo-yellow-dark border-ludo-yellow/20" },
  draft:        { label: "Draft",        colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/20" },
  archived:     { label: "Archived",     colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/20" },
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/20",
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${config.colorClass} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
    >
      {config.pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-ludo-red" />
        </span>
      )}
      {status === "live" && <Radio className="w-3 h-3" />}
      {config.label}
    </span>
  )
}
