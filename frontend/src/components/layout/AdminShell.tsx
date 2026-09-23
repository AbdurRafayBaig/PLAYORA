"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  LayoutDashboard, Trophy, Users, UserCircle, Calendar,
  Radio, BarChart3, MapPin, AlertTriangle, Megaphone,
  FileText, Shield, ScrollText, Settings, ChevronLeft,
  ChevronRight, LogOut, Menu, X, ExternalLink,
} from "lucide-react"
import { ADMIN_NAV_GROUPS, BRAND } from "@/lib/constants"
import { LudoMark } from "@/components/layout/LudoMark"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Trophy, Users, UserCircle, Calendar,
  Radio, BarChart3, MapPin, AlertTriangle, Megaphone,
  FileText, Shield, ScrollText, Settings,
}

const COLLAPSE_KEY = "playora:admin-sidebar-collapsed"

/**
 * Admin console chrome.
 *
 * The old sidebar was a fixed 256px column at every breakpoint, which left a
 * 375px phone with ~119px of usable content. Below `lg` it is now an
 * off-canvas drawer behind a top bar instead.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  /* Restore the collapsed preference after mount. Reading localStorage during
     render would desync the server and client markup. */
  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "true")
    } catch {
      /* Private mode or blocked storage — the default is fine. */
    }
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(COLLAPSE_KEY, String(next))
      } catch {
        /* Non-fatal. */
      }
      return next
    })
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!drawerOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.body.dataset.scrollLocked = "true"
    drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      delete document.body.dataset.scrollLocked
    }
  }, [drawerOpen])

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`))

  const activeLabel =
    ADMIN_NAV_GROUPS.flatMap((g) => g.items).find((i) => isActive(i.href))?.label ??
    "Admin"

  const navList = (showLabels: boolean) => (
    <nav aria-label="Admin sections" className="flex-1 p-2 space-y-4 overflow-y-auto">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.group}>
          {showLabels && (
            <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
              {group.group}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = iconMap[item.icon]
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    title={!showLabels ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200",
                      !showLabels && "justify-center",
                      active
                        ? "bg-ludo-red/10 text-ludo-red-ink font-semibold"
                        : "text-ink-muted hover:text-ink hover:bg-ink-faint/10",
                    )}
                  >
                    {Icon && <Icon aria-hidden="true" className="w-5 h-5 shrink-0" />}
                    {showLabels && <span className="truncate">{item.label}</span>}
                    {!showLabels && <span className="sr-only">{item.label}</span>}
                    {active && showLabels && (
                      <span
                        aria-hidden="true"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-ludo-red shrink-0"
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  const footer = (showLabels: boolean) => (
    <div className="p-3 border-t border-border space-y-1">
      <Link
        href="/"
        title={!showLabels ? "View public site" : undefined}
        className={cn(
          "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-ink-muted hover:text-ink hover:bg-ink-faint/10 transition-colors",
          !showLabels && "justify-center",
        )}
      >
        <ExternalLink aria-hidden="true" className="w-5 h-5 shrink-0" />
        {showLabels ? <span>View public site</span> : <span className="sr-only">View public site</span>}
      </Link>
      <Link
        href="/login"
        title={!showLabels ? "Log out" : undefined}
        className={cn(
          "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-ink-muted hover:text-ludo-red-ink hover:bg-ludo-red/5 transition-colors",
          !showLabels && "justify-center",
        )}
      >
        <LogOut aria-hidden="true" className="w-5 h-5 shrink-0" />
        {showLabels ? <span>Log out</span> : <span className="sr-only">Log out</span>}
      </Link>
    </div>
  )

  return (
    <div className="flex min-h-dvh bg-surface">
      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-dvh sticky top-0 border-r border-border bg-surface-raised transition-[width] duration-300 no-print",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between gap-2">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2 min-w-0">
              <LudoMark className="w-8 h-8 rounded-lg shrink-0" />
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-ink leading-none truncate">
                  {BRAND.name}
                </span>
                <span className="block text-[10px] text-ink-muted mt-0.5">Admin Panel</span>
              </span>
            </Link>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="w-8 h-8 shrink-0 mx-auto flex items-center justify-center rounded-lg hover:bg-ink-faint/10 text-ink-muted transition-colors cursor-pointer"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
          >
            {collapsed ? (
              <ChevronRight aria-hidden="true" className="w-4 h-4" />
            ) : (
              <ChevronLeft aria-hidden="true" className="w-4 h-4" />
            )}
          </button>
        </div>

        {navList(!collapsed)}
        {footer(!collapsed)}
      </aside>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-surface-overlay"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="relative flex flex-col w-[min(18rem,85vw)] h-dvh bg-surface-raised border-r border-border shadow-elevated animate-slide-right"
          >
            <div className="p-4 border-b border-border flex items-center justify-between gap-2">
              <Link href="/admin" className="flex items-center gap-2 min-w-0">
                <LudoMark className="w-8 h-8 rounded-lg shrink-0" />
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold text-ink leading-none">
                    {BRAND.name}
                  </span>
                  <span className="block text-[10px] text-ink-muted mt-0.5">Admin Panel</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl hover:bg-ink-faint/10 text-ink-muted transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <X aria-hidden="true" className="w-5 h-5" />
              </button>
            </div>
            {navList(true)}
            {footer(true)}
          </div>
        </div>
      )}

      {/* ── Content column ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-3 px-4 h-16 border-b border-border bg-surface-raised/90 backdrop-blur-xl no-print">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border border-border text-ink hover:bg-ink-faint/10 transition-colors cursor-pointer"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
          >
            <Menu aria-hidden="true" className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-sm font-extrabold text-ink truncate">{activeLabel}</p>
            <p className="text-[10px] text-ink-muted leading-none">{BRAND.name} Admin</p>
          </div>

          <ThemeToggle className="shrink-0" />
        </header>

        <main id="main-content" className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
