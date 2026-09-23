"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  Home, Radio, Calendar, BarChart3, Trophy, Users,
  MessageCircle, Menu, X, LogIn,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { PUBLIC_NAV, BRAND } from "@/lib/constants"
import { LudoMark } from "@/components/layout/LudoMark"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  Home, Radio, Calendar, BarChart3, Trophy, Users, MessageCircle,
}

export function PlayoraHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  /* Close on navigation. Clicking a link already closes the menu, but a
     browser back/forward or a programmatic push would otherwise leave it
     hanging open over the new page. Adjusting state during render rather
     than in an effect avoids painting the stale menu over the new page. */
  if (pathname !== lastPath) {
    setLastPath(pathname)
    if (mobileOpen) setMobileOpen(false)
  }

  /* Escape closes, and focus goes back to the button that opened it —
     otherwise a keyboard user is dropped at the top of the document. */
  useEffect(() => {
    if (!mobileOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.body.dataset.scrollLocked = "true"
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      delete document.body.dataset.scrollLocked
    }
  }, [mobileOpen])

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface-raised/85 backdrop-blur-xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 rounded-lg"
            aria-label={`${BRAND.name} home`}
          >
            <LudoMark className="w-9 h-9 shrink-0" />
            <span className="flex flex-col min-w-0">
              <span className="text-lg font-extrabold tracking-tight text-ink leading-none">
                {BRAND.name}
              </span>
              <span className="text-[10px] font-medium text-ink-muted leading-none hidden sm:block truncate">
                {BRAND.tagline}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5">
            {PUBLIC_NAV.map((item) => {
              const Icon = iconMap[item.icon]
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200",
                    active
                      ? "bg-ludo-red/10 text-ludo-red-ink font-semibold"
                      : "text-ink-muted hover:text-ink hover:bg-ink-faint/10",
                  )}
                >
                  {Icon && <Icon aria-hidden="true" className="w-4 h-4" />}
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ludo-red text-white text-sm font-semibold hover:bg-ludo-red-dark transition-colors duration-200 shadow-sm"
            >
              <LogIn aria-hidden="true" className="w-4 h-4" />
              Login
            </Link>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              // 44px square: the minimum comfortable touch target.
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl border border-border text-ink hover:bg-ink-faint/10 transition-colors cursor-pointer"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileOpen ? (
                <X aria-hidden="true" className="w-5 h-5" />
              ) : (
                <Menu aria-hidden="true" className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — its own scroll area, so a long nav never traps the
          page behind an un-scrollable panel. */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 top-16 bg-surface-overlay z-40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-nav-panel"
            ref={panelRef}
            className="lg:hidden fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-border bg-surface-raised shadow-elevated animate-fade-in"
          >
            <nav aria-label="Mobile" className="px-4 py-3 space-y-1 pb-safe">
              {PUBLIC_NAV.map((item) => {
                const Icon = iconMap[item.icon]
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      active
                        ? "bg-ludo-red/10 text-ludo-red-ink font-semibold"
                        : "text-ink-muted hover:text-ink hover:bg-ink-faint/10",
                    )}
                  >
                    {Icon && <Icon aria-hidden="true" className="w-5 h-5" />}
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ludo-red text-white text-sm font-semibold mt-2"
              >
                <LogIn aria-hidden="true" className="w-5 h-5" />
                Login
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
