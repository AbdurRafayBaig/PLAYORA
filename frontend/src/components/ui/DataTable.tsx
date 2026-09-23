import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  /** Stable key — also used as the React key for cells. */
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: "left" | "center" | "right"
  /** Hidden below `sm`, so a phone shows only the columns that matter. */
  hideOnMobile?: boolean
  width?: string
  /** Numeric columns get tabular figures so digits line up. */
  numeric?: boolean
}

interface DataTableProps<T> {
  /** Describes the table for screen readers; visually hidden. */
  caption: string
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  /** Highlights a row — used for the signed-in team, podium places, etc. */
  rowClassName?: (row: T) => string | undefined
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
 * The previous standings markup used `grid-cols-[60px_1fr_60px_...]` on every
 * breakpoint, which needs ~450px of fixed columns and broke the layout on any
 * phone. Here the table scrolls horizontally inside a focusable region, and
 * secondary columns drop out below `sm` — and screen readers get proper row
 * and column relationships either way.
 */
export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  rowClassName,
  empty,
  className,
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) {
    return <>{empty}</>
  }

  return (
    <div
      // tabIndex makes the scroll area reachable by keyboard, which an
      // overflow container otherwise is not.
      tabIndex={0}
      role="region"
      aria-label={caption}
      className={cn("card-base overflow-x-auto", className)}
    >
      <table className="w-full min-w-[34rem] border-collapse">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border bg-ink-faint/5">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  "px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-ink-muted whitespace-nowrap",
                  alignClass[col.align ?? "left"],
                  col.hideOnMobile && "hidden sm:table-cell",
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={cn("transition-colors hover:bg-ink-faint/5", rowClassName?.(row))}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-3 py-3 text-sm text-ink align-middle",
                    alignClass[col.align ?? "left"],
                    col.numeric && "tabular-nums",
                    col.hideOnMobile && "hidden sm:table-cell",
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
