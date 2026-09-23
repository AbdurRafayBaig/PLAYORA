"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, Bell, Users, Home, Swords, Trophy, BarChart3, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { TeamBottomNav } from "@/components/layout/TeamBottomNav"
import { BRAND } from "@/lib/constants"

const TEAM_SIDEBAR_NAV = [
  { label: "Home",          href: "/team",               icon: Home },
  { label: "My Team",       href: "/team/profile",       icon: Users },
  { label: "My Matches",    href: "/team/matches",       icon: Swords },
  { label: "Results",       href: "/team/results",       icon: Trophy },
  { label: "Standing",      href: "/team/standing",      icon: BarChart3 },
  { label: "Notifications", href: "/team/notifications", icon: Bell },
  { label: "Account",       href: "/team/account",       icon: Settings },
]

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 border-r border-border bg-surface-raised">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                <div className="bg-ludo-red" />
                <div className="bg-ludo-yellow" />
                <div className="bg-ludo-blue" />
                <div className="bg-ludo-green" />
              </div>
            </div>
            <div>
              <p className="text-sm font-extrabold text-ink leading-none">{BRAND.name}</p>
              <p className="text-[10px] text-ink-muted">Team Portal</p>
            </div>
          </Link>
        </div>

        {/* Team Identity */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ludo-red/10 flex items-center justify-center text-sm font-bold text-ludo-red">
              TH
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Thunder Hawks</p>
              <p className="text-[10px] text-ink-muted">Team Code: T001</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {TEAM_SIDEBAR_NAV.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
              (item.href !== "/team" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-ludo-red/10 text-ludo-red"
                    : "text-ink-muted hover:text-ink hover:bg-ink-faint/10"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-ludo-red" : ""}`} />
                <span>{item.label}</span>
                {item.label === "Notifications" && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-ludo-red text-white text-[9px] font-bold flex items-center justify-center">
                    2
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-border bg-surface-raised/90 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                <div className="bg-ludo-red" />
                <div className="bg-ludo-yellow" />
                <div className="bg-ludo-blue" />
                <div className="bg-ludo-green" />
              </div>
            </div>
            <span className="text-sm font-extrabold text-ink">{BRAND.name}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-ink-faint/10 transition-colors cursor-pointer">
              <Bell className="w-4 h-4 text-ink-muted" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ludo-red text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <TeamBottomNav />
      </div>
    </div>
  )
}
