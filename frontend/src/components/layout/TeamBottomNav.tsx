"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Swords, Trophy, BarChart3, Settings } from "lucide-react"

const BOTTOM_NAV = [
  { label: 'Home',     href: '/team',          icon: Home },
  { label: 'Matches',  href: '/team/matches',  icon: Swords },
  { label: 'Results',  href: '/team/results',  icon: Trophy },
  { label: 'Standing', href: '/team/standing',  icon: BarChart3 },
  { label: 'Account',  href: '/team/account',  icon: Settings },
]

export function TeamBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-raised/90 backdrop-blur-xl lg:hidden"
      id="team-bottom-nav"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {BOTTOM_NAV.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/team' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? "text-ludo-red"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-ludo-red animate-pulse-glow" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
