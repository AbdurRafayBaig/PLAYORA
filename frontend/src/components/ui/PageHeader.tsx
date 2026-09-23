import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  icon?: ReactNode
  /** Filters, print buttons — anything that hangs to the right on desktop. */
  actions?: ReactNode
  align?: "left" | "center"
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  actions,
  align = "left",
  className,
}: PageHeaderProps) {
  const centered = align === "center"

  return (
    <div
      className={cn(
        "flex gap-4 mb-8",
        centered
          ? "flex-col items-center text-center"
          : "flex-col sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {(eyebrow || icon) && (
          <div
            className={cn(
              "flex items-center gap-2 mb-1",
              centered && "justify-center",
            )}
          >
            {icon}
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                {eyebrow}
              </span>
            )}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-ink-muted mt-1.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0 no-print">{actions}</div>
      )}
    </div>
  )
}
