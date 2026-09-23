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
  red: "border-t-ludo-flame",
  yellow: "border-t-ludo-mango",
  green: "border-t-ludo-lemon",
  blue: "border-t-ludo-indigo",
} as const

const iconBgStyles = {
  red: "bg-ludo-flame/10 text-ludo-flame-ink",
  yellow: "bg-ludo-mango/15 text-ludo-mango-ink",
  green: "bg-ludo-lemon/10 text-ludo-lemon-ink",
  blue: "bg-ludo-indigo/10 text-ludo-indigo-ink",
} as const

const changeStyles = {
  positive: "bg-ludo-lemon/10 text-ludo-lemon-ink",
  negative: "bg-ludo-flame/10 text-ludo-flame-ink",
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
