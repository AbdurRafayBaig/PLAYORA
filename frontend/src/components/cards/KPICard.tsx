import { type ReactNode } from "react"

interface KPICardProps {
  icon: ReactNode
  label: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  accentColor?: "red" | "yellow" | "green" | "blue"
}

const accentStyles = {
  red:    "border-t-ludo-red",
  yellow: "border-t-ludo-yellow",
  green:  "border-t-ludo-green",
  blue:   "border-t-ludo-blue",
}

const iconBgStyles = {
  red:    "bg-ludo-red/10 text-ludo-red",
  yellow: "bg-ludo-yellow/10 text-ludo-yellow-dark",
  green:  "bg-ludo-green/10 text-ludo-green",
  blue:   "bg-ludo-blue/10 text-ludo-blue",
}

export function KPICard({
  icon,
  label,
  value,
  change,
  changeType = "neutral",
  accentColor = "red",
}: KPICardProps) {
  return (
    <div className={`card-base border-t-4 ${accentStyles[accentColor]} p-5 space-y-3`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgStyles[accentColor]}`}>
          {icon}
        </div>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              changeType === "positive"
                ? "bg-ludo-green/10 text-ludo-green"
                : changeType === "negative"
                ? "bg-ludo-red/10 text-ludo-red"
                : "bg-ink-faint/10 text-ink-muted"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-ink tracking-tight">{value}</p>
        <p className="text-xs font-medium text-ink-muted mt-0.5">{label}</p>
      </div>
    </div>
  )
}
