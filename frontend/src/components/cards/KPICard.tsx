import { type ReactNode } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  icon: ReactNode
  label: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  accentColor?: "red" | "yellow" | "green" | "blue"
  hint?: string
}

const accentStyles = {
  red: "border-t-ludo-red",
  yellow: "border-t-ludo-yellow",
  green: "border-t-ludo-green",
  blue: "border-t-ludo-blue",
} as const

const iconBgStyles = {
  red: "bg-ludo-red/10 text-ludo-red-ink",
  yellow: "bg-ludo-yellow/15 text-ludo-yellow-ink",
  green: "bg-ludo-green/10 text-ludo-green-ink",
  blue: "bg-ludo-blue/10 text-ludo-blue-ink",
} as const

const changeStyles = {
  positive: "bg-ludo-green/10 text-ludo-green-ink",
  negative: "bg-ludo-red/10 text-ludo-red-ink",
  neutral: "bg-ink-faint/10 text-ink-muted",
} as const

const ChangeIcon = { positive: TrendingUp, negative: TrendingDown, neutral: Minus }

export function KPICard({
  icon,
  label,
  value,
  change,
  changeType = "neutral",
  accentColor = "red",
  hint,
}: KPICardProps) {
  const Icon = ChangeIcon[changeType]

  return (
    <div className={cn("card-base border-t-4 p-4 sm:p-5 space-y-3", accentStyles[accentColor])}>
      <div className="flex items-start justify-between gap-2">
        <div
          aria-hidden="true"
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            iconBgStyles[accentColor],
          )}
        >
          {icon}
        </div>
        {change && (
          <span
            className={cn(
              // The arrow means the direction survives greyscale and colour
              // blindness; the colour alone would not.
              "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
              changeStyles[changeType],
            )}
          >
            <Icon aria-hidden="true" className="w-3 h-3" />
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-ink tracking-tight tabular-nums">{value}</p>
        <p className="text-xs font-medium text-ink-muted mt-0.5">{label}</p>
        {hint && <p className="text-[10px] text-ink-faint mt-1">{hint}</p>}
      </div>
    </div>
  )
}
