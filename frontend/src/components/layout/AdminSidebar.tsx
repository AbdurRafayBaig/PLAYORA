"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard, Trophy, Users, UserCircle, Calendar,
  Radio, BarChart3, MapPin, AlertTriangle, Megaphone,
  FileText, Shield, ScrollText, Settings, ChevronLeft,
  ChevronRight, LogOut,
} from "lucide-react"
import { ADMIN_NAV, BRAND } from "@/lib/constants"

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Trophy, Users, UserCircle, Calendar,
  Radio, BarChart3, MapPin, AlertTriangle, Megaphone,
  FileText, Shield, ScrollText, Settings,
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 border-r border-border bg-surface-raised transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
      id="admin-sidebar"
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
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
              <p className="text-[10px] text-ink-muted">Admin Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-ink-faint/10 text-ink-muted transition-colors cursor-pointer"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-ludo-red/10 text-ludo-red shadow-sm"
                  : "text-ink-muted hover:text-ink hover:bg-ink-faint/10"
              }`}
            >
              {Icon && (
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-ludo-red" : ""
                }`} />
              )}
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-ludo-red animate-pulse-glow" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border">
        <button
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-ink-muted hover:text-ludo-red hover:bg-ludo-red/5 transition-all cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
