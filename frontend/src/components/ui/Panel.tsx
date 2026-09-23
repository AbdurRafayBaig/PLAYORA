import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PanelProps {
  title: string
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  /** Removes the inner padding for edge-to-edge lists and tables. */
  flush?: boolean
  className?: string
}

/** A titled card. The workhorse container for dashboard and portal sections. */
export function Panel({
  title,
  icon,
  action,
  children,
  flush = false,
  className,
}: PanelProps) {
  return (
    <section className={cn("card-base overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-ink flex items-center gap-2 min-w-0">
          {icon}
          <span className="truncate">{title}</span>
        </h2>
        {action && <div className="shrink-0 no-print">{action}</div>}
      </div>
      <div className={cn(!flush && "p-4")}>{children}</div>
    </section>
  )
}
