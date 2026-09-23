"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Swords, Trophy, BarChart3, Settings } from "lucide-react"
import { TEAM_BOTTOM_NAV } from "@/lib/constants"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  Home, Swords, Trophy, BarChart3, Settings,
}

export function TeamBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Team portal"
      // pb-safe keeps the tap targets clear of the iPhone home indicator and
      // the Android gesture bar, which previously overlapped the last row.
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-surface-raised/95 backdrop-blur-xl lg:hidden pb-safe no-print"
    >
      <ul className="flex items-stretch justify-around max-w-lg mx-auto">
        {TEAM_BOTTOM_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/team" && pathname.startsWith(`${item.href}/`))
          const Icon = iconMap[item.icon]

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "h-16 flex flex-col items-center justify-center gap-0.5 transition-colors duration-200",
                  active ? "text-ludo-red-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                <span className="relative flex items-center justify-center">
                  {Icon && (
                    <Icon
                      aria-hidden="true"
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        active && "scale-110",
                      )}
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] leading-none",
                    active ? "font-bold" : "font-medium",
                  )}
                >
                  {item.label}
                </span>
                {/* A shape, not just a colour — the active tab stays obvious
                    in greyscale and for colour-blind users. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 w-6 rounded-full transition-colors",
                    active ? "bg-ludo-red" : "bg-transparent",
                  )}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
