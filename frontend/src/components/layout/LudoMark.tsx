import { cn } from "@/lib/utils"

/**
 * The PLAYORA mark: a Ludo board's four home squares.
 *
 * This markup was copy-pasted into six components, which meant six places to
 * update and a real chance of them drifting apart.
 */
export function LudoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden",
        className,
      )}
    >
      <span className="bg-ludo-red" />
      <span className="bg-ludo-yellow" />
      <span className="bg-ludo-blue" />
      <span className="bg-ludo-green" />
    </span>
  )
}
