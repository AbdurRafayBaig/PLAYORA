"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home, Users, Swords, Trophy, BarChart3, Bell, Settings, LogOut, ExternalLink,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { TeamBottomNav } from "@/components/layout/TeamBottomNav"
import { LudoMark } from "@/components/layout/LudoMark"
import { BRAND, TEAM_NAV } from "@/lib/constants"
import { getSignedInTeam, NOTIFICATIONS } from "@/lib/data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  Home, Users, Swords, Trophy, BarChart3, Bell, Settings,
}

export function TeamShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const team = getSignedInTeam()
  const unread = NOTIFICATIONS.filter((n) => !n.read).length

  const isActive = (href: string) =>
    pathname === href || (href !== "/team" && pathname.startsWith(`${href}/`))

  const activeLabel =
    TEAM_NAV.find((i) => isActive(i.href))?.label ?? "Team Portal"

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 h-dvh sticky top-0 border-r border-border bg-surface-raised no-print">
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <LudoMark className="w-8 h-8 rounded-lg shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-extrabold text-ink leading-none">
                {BRAND.name}
              </span>
              <span className="block text-[10px] text-ink-muted mt-0.5">Team Portal</span>
            </span>
          </Link>
        </div>

        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <span
              aria-hidden="true"
              className="w-10 h-10 shrink-0 rounded-xl bg-ludo-red/10 flex items-center justify-center text-sm font-bold text-ludo-red-ink"
            >
              {team.initials}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-ink truncate">{team.name}</span>
              <span className="block text-[10px] text-ink-muted">
                Team Code: {team.code}
              </span>
            </span>
          </div>
        </div>

        <nav aria-label="Team portal sections" className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <ul className="space-y-0.5">
            {TEAM_NAV.map((item) => {
              const Icon = iconMap[item.icon]
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200",
                      active
                        ? "bg-ludo-red/10 text-ludo-red-ink font-semibold"
                        : "text-ink-muted hover:text-ink hover:bg-ink-faint/10",
                    )}
                  >
                    {Icon && <Icon aria-hidden="true" className="w-5 h-5 shrink-0" />}
                    <span className="truncate">{item.label}</span>
                    {item.href === "/team/notifications" && unread > 0 && (
                      <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-ludo-red text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {unread}
                        <span className="sr-only"> unread</span>
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-muted hover:text-ink hover:bg-ink-faint/10 transition-colors"
          >
            <ExternalLink aria-hidden="true" className="w-5 h-5 shrink-0" />
            View public site
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-muted hover:text-ludo-red-ink hover:bg-ludo-red/5 transition-colors"
          >
            <LogOut aria-hidden="true" className="w-5 h-5 shrink-0" />
            Log out
          </Link>
        </div>
      </aside>

      {/* ── Content column ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 px-4 h-16 flex items-center justify-between gap-3 border-b border-border bg-surface-raised/90 backdrop-blur-xl no-print">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <LudoMark className="w-8 h-8 rounded-lg shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-extrabold text-ink leading-none truncate">
                {activeLabel}
              </span>
              <span className="block text-[10px] text-ink-muted mt-0.5 truncate">
                {team.name}
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link
              href="/team/notifications"
              className="relative w-11 h-11 flex items-center justify-center rounded-xl border border-border text-ink hover:bg-ink-faint/10 transition-colors"
              aria-label={
                unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
              }
            >
              <Bell aria-hidden="true" className="w-4 h-4 text-ink-muted" />
              {unread > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-ludo-red text-white text-[9px] font-bold flex items-center justify-center"
                >
                  {unread}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* pb-24 clears the fixed bottom nav so the last card is never
            hidden behind it. */}
        <main id="main-content" className="flex-1 min-w-0 pb-24 lg:pb-0">
          {children}
        </main>

        <TeamBottomNav />
      </div>
    </div>
  )
}
