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
 * Bright board hues (lemon, mango, flame) are used as fills with plum text
 * rather than as text on a tint: `text-ludo-lemon` on white is about 1.4:1.
 */
const statusConfig: Record<string, { label: string; colorClass: string; pulse?: boolean }> = {
  unscheduled: { label: "Not scheduled", colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/25" },
  scheduled:   { label: "Scheduled",     colorClass: "bg-ludo-indigo/10 text-ludo-indigo-ink border-ludo-indigo/25" },
  live:        { label: "LIVE",          colorClass: "bg-ludo-flame text-on-bright border-ludo-flame", pulse: true },
  completed:   { label: "Completed",     colorClass: "bg-ludo-lemon/25 text-ludo-lemon-ink border-ludo-lemon-solid/30" },
  bye:         { label: "Bye",           colorClass: "bg-ludo-mango/25 text-ludo-mango-ink border-ludo-mango/40" },

  active:      { label: "Still in",      colorClass: "bg-ludo-lemon/25 text-ludo-lemon-ink border-ludo-lemon-solid/30" },
  eliminated:  { label: "Knocked out",   colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/25" },
  champion:    { label: "Champion",      colorClass: "bg-ludo-mango text-on-bright border-ludo-mango" },

  setup:       { label: "Setup",         colorClass: "bg-ludo-indigo/10 text-ludo-indigo-ink border-ludo-indigo/25" },
  running:     { label: "Running",       colorClass: "bg-ludo-flame/15 text-ludo-flame-ink border-ludo-flame/30" },
  complete:    { label: "Finished",      colorClass: "bg-ludo-lemon/25 text-ludo-lemon-ink border-ludo-lemon-solid/30" },

  published:   { label: "Published",     colorClass: "bg-ludo-lemon/25 text-ludo-lemon-ink border-ludo-lemon-solid/30" },
  draft:       { label: "Not published", colorClass: "bg-ink-faint/10 text-ink-muted border-ink-faint/25" },
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
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-plum opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-ludo-plum" />
        </span>
      )}
      {config.label}
    </span>
  )
}
