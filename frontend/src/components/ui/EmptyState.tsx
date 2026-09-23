import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

/**
 * Empty is a state, not a bug. Every list in the app renders this instead of
 * collapsing to nothing, so "no live matches right now" never looks like a
 * page that failed to load.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "card-base px-6 py-12 sm:py-16 text-center flex flex-col items-center gap-3",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="w-14 h-14 rounded-2xl bg-ink-faint/10 text-ink-faint flex items-center justify-center"
      >
        {icon}
      </div>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <p className="text-sm text-ink-muted max-w-sm leading-relaxed">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
