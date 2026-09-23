import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  /** Stable key — also used as the React key for cells. */
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: "left" | "center" | "right"
  width?: string
  /** Numeric columns get tabular figures so digits line up. */
  numeric?: boolean
  /**
   * CSS `left` offset to pin this column while the table scrolls sideways.
   * Pin identifying columns only — a row is unreadable once the team name
   * has scrolled away.
   */
  sticky?: string
}

interface DataTableProps<T> {
  /** Describes the table for screen readers; visually hidden. */
  caption: string
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  /** Highlights a row — used for the signed-in team, podium places, etc. */
  rowClassName?: (row: T) => string | undefined
  /** Tailwind min-width for the scrolling table, e.g. "min-w-[34rem]". */
  minWidth?: string
  empty?: ReactNode
  className?: string
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

/**
 * A real `<table>`, not a grid of divs.
 *
 * The previous standings markup used `grid-cols-[60px_1fr_60px_...]` at every
 * breakpoint, which needs ~450px of fixed columns and broke the layout on any
 * phone. Here the table scrolls horizontally inside a focusable region with
 * the identifying columns pinned, so every column stays reachable on a phone
 * instead of being hidden outright — and screen readers get proper row and
 * column relationships either way.
 */
export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  rowClassName,
  minWidth = "min-w-[34rem]",
  empty,
  className,
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) {
    return <>{empty}</>
  }

  const lastStickyKey = [...columns].reverse().find((c) => c.sticky !== undefined)?.key

  return (
    <div
      // tabIndex makes the scroll area reachable by keyboard, which an
      // overflow container otherwise is not.
      tabIndex={0}
      role="region"
      aria-label={caption}
      className={cn("card-base overflow-x-auto", className)}
    >
      <table className={cn("w-full border-collapse", minWidth)}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{
                  width: col.width,
                  left: col.sticky,
                }}
                className={cn(
                  "px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-ink-muted whitespace-nowrap bg-surface-sunken",
                  alignClass[col.align ?? "left"],
                  col.sticky !== undefined && "sticky z-20",
                  col.key === lastStickyKey && "border-r border-border",
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const extra = rowClassName?.(row)
            return (
              <tr key={rowKey(row)} className="border-b border-border last:border-0">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ left: col.sticky }}
                    className={cn(
                      "px-3 py-3 text-sm text-ink align-middle",
                      alignClass[col.align ?? "left"],
                      col.numeric && "tabular-nums",
                      // Pinned cells need their own opaque background, or
                      // the scrolling columns show straight through them.
                      col.sticky !== undefined && "sticky z-10 bg-surface-raised",
                      col.key === lastStickyKey && "border-r border-border",
                      extra,
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
