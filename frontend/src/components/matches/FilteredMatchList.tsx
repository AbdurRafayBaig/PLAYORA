"use client"

import { useMemo, useState } from "react"
import { CalendarX2, ListFilter } from "lucide-react"
import { MatchCard } from "@/components/cards/MatchCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { cn, pluralise } from "@/lib/utils"
import type { Match } from "@/lib/types"

interface FilteredMatchListProps {
  matches: Match[]
  /** Renders one section per round instead of a flat grid. */
  grouped?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

const ALL = "All rounds"

/**
 * Round filter over a list of matches.
 *
 * The fixtures and results pages previously shipped a "Filter Round" button
 * that did nothing at all — a control that looks interactive and is not is
 * worse than no control.
 */
export function FilteredMatchList({
  matches,
  grouped = false,
  emptyTitle = "No matches found",
  emptyDescription = "Try a different round, or check back once the next stage is drawn.",
}: FilteredMatchListProps) {
  const [round, setRound] = useState<string>(ALL)

  // Insertion order of the source array is already the intended stage order.
  const rounds = useMemo(() => {
    const seen: string[] = []
    for (const m of matches) if (!seen.includes(m.round)) seen.push(m.round)
    return [ALL, ...seen]
  }, [matches])

  const visible = useMemo(
    () => (round === ALL ? matches : matches.filter((m) => m.round === round)),
    [matches, round],
  )

  const groups = useMemo(() => {
    if (!grouped) return []
    const order: string[] = []
    const byRound = new Map<string, Match[]>()
    for (const m of visible) {
      if (!byRound.has(m.round)) {
        byRound.set(m.round, [])
        order.push(m.round)
      }
      byRound.get(m.round)!.push(m)
    }
    return order.map((name) => ({ name, matches: byRound.get(name)! }))
  }, [visible, grouped])

  return (
    <div className="space-y-6">
      {/* Filter chips: a horizontal scroller on a phone, a wrapped row on
          desktop. Radio semantics so arrow keys work as expected. */}
      {rounds.length > 2 && (
        <div
          role="radiogroup"
          aria-label="Filter by round"
          className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap no-print"
        >
          <ListFilter
            aria-hidden="true"
            className="w-4 h-4 text-ink-faint shrink-0 hidden sm:block"
          />
          {rounds.map((name) => {
            const selected = round === name
            return (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setRound(name)}
                className={cn(
                  "shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer",
                  selected
                    ? "bg-ludo-red-solid text-white border-ludo-red-solid"
                    : "bg-surface-raised text-ink-muted border-border hover:text-ink hover:bg-ink-faint/10",
                )}
              >
                {name}
              </button>
            )
          })}
        </div>
      )}

      <p className="sr-only" role="status">
        Showing {pluralise(visible.length, "match", "matches")}
        {round === ALL ? "" : ` in ${round}`}.
      </p>

      {visible.length === 0 ? (
        <EmptyState
          icon={<CalendarX2 className="w-6 h-6" />}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : grouped ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.name} aria-labelledby={`round-${group.name.replace(/\s+/g, "-")}`}>
              <h2
                id={`round-${group.name.replace(/\s+/g, "-")}`}
                className="text-sm font-bold text-ink mb-3 flex items-center gap-2"
              >
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-ludo-blue" />
                {group.name}
                <span className="text-[10px] font-medium text-ink-muted">
                  ({pluralise(group.matches.length, "match", "matches")})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.matches.map((match) => (
                  <MatchCard key={match.id} {...match} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((match) => (
            <MatchCard key={match.id} {...match} />
          ))}
        </div>
      )}
    </div>
  )
}
