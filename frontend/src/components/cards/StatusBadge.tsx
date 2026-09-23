import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  size?: "sm" | "md"
  className?: string
}

/**
 * Colour is never the only signal here — each badge carries its own label,
 * so the status survives greyscale printing and colour blindness.
 *
 * Text uses the `-ink` tokens: the brand hues are tuned for fills and do not
 * reach 4.5:1 as 10px text on a white card.
 */
const statusConfig: Record<string, { label: string; colorClass: string; pulse?: boolean }> = {
  scheduled:    { label: "Scheduled",    colorClass: "bg-ludo-blue/10 text-ludo-blue-ink border-ludo-blue/25" },
  checkin:      { label: "Check-in",     colorClass: "bg-ludo-yellow/15 text-ludo-yellow-ink border-ludo-yellow/30" },
  ready:        { label: "Ready",        colorClass: "bg-ludo-yellow/15 text-ludo-yellow-ink border-ludo-yellow/30" },
  live:         { label: "LIVE",         colorClass: "bg-ludo-red/10 text-ludo-red-ink border-ludo-red/25", pulse: true },
  paused:       { label: "Paused",       colorClass: "bg-ludo-yellow/15 text-ludo-yellow-ink border-ludo-yellow/30" },
  completed:    { label: "Completed",    colorClass: "bg-ludo-green/10 text-ludo-green-ink border-ludo-green/25" },
  cancelled:    { label: "Cancelled",    colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/25" },
  postponed:    { label: "Postponed",    colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/25" },
  walkover:     { label: "Walkover",     colorClass: "bg-ludo-yellow/15 text-ludo-yellow-ink border-ludo-yellow/30" },
  active:       { label: "Active",       colorClass: "bg-ludo-green/10 text-ludo-green-ink border-ludo-green/25" },
  qualified:    { label: "Qualified",    colorClass: "bg-ludo-green/10 text-ludo-green-ink border-ludo-green/25" },
  eliminated:   { label: "Eliminated",   colorClass: "bg-ludo-red/10 text-ludo-red-ink border-ludo-red/25" },
  disqualified: { label: "Disqualified", colorClass: "bg-ludo-red/10 text-ludo-red-ink border-ludo-red/25" },
  bye:          { label: "Bye",          colorClass: "bg-ludo-yellow/15 text-ludo-yellow-ink border-ludo-yellow/30" },
  draft:        { label: "Draft",        colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/25" },
  archived:     { label: "Archived",     colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/25" },
  open:         { label: "Open",         colorClass: "bg-ludo-red/10 text-ludo-red-ink border-ludo-red/25" },
  reviewing:    { label: "Reviewing",    colorClass: "bg-ludo-yellow/15 text-ludo-yellow-ink border-ludo-yellow/30" },
  resolved:     { label: "Resolved",     colorClass: "bg-ludo-green/10 text-ludo-green-ink border-ludo-green/25" },
  rejected:     { label: "Rejected",     colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/25" },
  closed:       { label: "Closed",       colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/25" },
}

export function StatusBadge({ status, size = "sm", className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/25",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full border whitespace-nowrap",
        config.colorClass,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className,
      )}
    >
      {config.pulse && (
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-ludo-red" />
        </span>
      )}
      {config.label}
    </span>
  )
}
