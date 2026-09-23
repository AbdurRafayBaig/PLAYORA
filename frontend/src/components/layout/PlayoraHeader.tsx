"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Home, Radio, Calendar, BarChart3, Trophy, Users,
  MessageCircle, Menu, X, LogIn,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { PUBLIC_NAV, BRAND } from "@/lib/constants"

const iconMap: Record<string, React.ElementType> = {
  Home, Radio, Calendar, BarChart3, Trophy, Users, MessageCircle,
}

export function PlayoraHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface-raised/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" id="header-logo">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="bg-ludo-red" />
                <div className="bg-ludo-yellow" />
                <div className="bg-ludo-blue" />
                <div className="bg-ludo-green" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-ink leading-none">
                {BRAND.name}
              </span>
              <span className="text-[10px] font-medium text-ink-muted leading-none hidden sm:block">
                {BRAND.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" id="desktop-nav">
            {PUBLIC_NAV.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-ludo-red/10 text-ludo-red"
                      : "text-ink-muted hover:text-ink hover:bg-ink-faint/10"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ludo-red text-white text-sm font-semibold hover:bg-ludo-red-dark transition-colors duration-200 shadow-sm"
              id="header-login"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-ink-faint/10 transition-colors"
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-surface-raised animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {PUBLIC_NAV.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-ludo-red/10 text-ludo-red"
                      : "text-ink-muted hover:text-ink hover:bg-ink-faint/10"
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ludo-red text-white text-sm font-semibold mt-2"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
