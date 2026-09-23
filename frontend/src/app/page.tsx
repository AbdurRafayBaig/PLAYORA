"use client"

import Link from "next/link"
import {
  Trophy, Users, Radio, Calendar, BarChart3, ArrowRight,
  Zap, Shield, Smartphone, ChevronRight,
} from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { MatchCard } from "@/components/cards/MatchCard"
import { BRAND } from "@/lib/constants"

/* ── Mock Data for Demo ── */
const LIVE_MATCHES = [
  { id: "M001", teamA: "Thunder Hawks", teamB: "Storm Riders", status: "live" as const, venue: "Main Hall", table: "T1", time: "2:30 PM", round: "Quarter Final" },
  { id: "M002", teamA: "Phoenix Squad", teamB: "Royal Knights", status: "live" as const, venue: "Main Hall", table: "T2", time: "2:30 PM", round: "Quarter Final" },
]

const RECENT_RESULTS = [
  { id: "M003", teamA: "Silver Wolves", teamB: "Golden Eagles", status: "completed" as const, winner: "A" as const, venue: "Room 201", table: "T3", time: "1:00 PM", round: "Round 2" },
  { id: "M004", teamA: "Iron Titans", teamB: "Blue Dragons", status: "completed" as const, winner: "B" as const, venue: "Room 201", table: "T4", time: "12:30 PM", round: "Round 2" },
]

const STATS = [
  { label: "Teams Registered", value: "24", icon: Users, color: "text-ludo-red" },
  { label: "Matches Played", value: "38", icon: Trophy, color: "text-ludo-yellow" },
  { label: "Live Now", value: "2", icon: Radio, color: "text-ludo-green" },
  { label: "Next Match In", value: "15m", icon: Calendar, color: "text-ludo-blue" },
]

const FEATURES = [
  {
    icon: Zap,
    title: "Live Match Tracking",
    description: "Real-time match updates with WebSocket-powered live scores, status changes, and instant result publication.",
    color: "bg-ludo-red/10 text-ludo-red",
  },
  {
    icon: Shield,
    title: "Admin Control Center",
    description: "Full tournament management — fixtures, results, overrides, advancements, byes, and audit-logged operations.",
    color: "bg-ludo-blue/10 text-ludo-blue",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Optimized scorer view for referees, bottom-nav team portal, and responsive public pages — all touch-friendly.",
    color: "bg-ludo-green/10 text-ludo-green",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PlayoraHeader />

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-ludo-red/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-ludo-blue/5 rounded-full blur-3xl animate-float delay-200" />
          <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-ludo-green/5 rounded-full blur-3xl animate-float delay-400" />
          <div className="absolute bottom-40 right-10 w-48 h-48 bg-ludo-yellow/5 rounded-full blur-3xl animate-float delay-300" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ludo-red/10 border border-ludo-red/20 text-ludo-red text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Tournament Season Active
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-tight">
              Welcome to{" "}
              <span className="text-gradient-ludo">{BRAND.name}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
              The complete {BRAND.tagline.toLowerCase()} — track live matches, view fixtures & standings, 
              and follow your favorite teams through every round of the Ludo championship.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/live"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-ludo-red text-white font-bold text-sm shadow-lg hover:bg-ludo-red-dark hover:shadow-xl transition-all duration-300 group"
                id="hero-live-cta"
              >
                <Radio className="w-4 h-4 group-hover:animate-pulse" />
                Watch Live Matches
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/standings"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-border bg-surface-raised text-ink font-bold text-sm hover:bg-ink-faint/10 transition-all duration-300"
                id="hero-standings-cta"
              >
                <BarChart3 className="w-4 h-4 text-ludo-blue" />
                View Standings
              </Link>
            </div>
          </div>

          {/* ── Quick Stats ── */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto animate-fade-in-up delay-200">
            {STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="card-base p-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-extrabold text-ink">{stat.value}</p>
                  <p className="text-[11px] font-medium text-ink-muted">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ LIVE MATCHES ═══════════ */}
      <section className="py-16 bg-surface-raised/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-ludo-red" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-ludo-red">
                  Live Now
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Live Matches
              </h2>
            </div>
            <Link
              href="/live"
              className="text-sm font-semibold text-ludo-red hover:underline inline-flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LIVE_MATCHES.map((match) => (
              <MatchCard key={match.id} {...match} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ RECENT RESULTS ═══════════ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ludo-green mb-1 block">
                Completed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Recent Results
              </h2>
            </div>
            <Link
              href="/results"
              className="text-sm font-semibold text-ludo-green hover:underline inline-flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECENT_RESULTS.map((match) => (
              <MatchCard key={match.id} {...match} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="py-16 bg-surface-raised/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1 block">
              Why PLAYORA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Built for Tournament Excellence
            </h2>
            <p className="text-sm text-ink-muted mt-2 max-w-lg mx-auto">
              Everything you need to run a professional sports tournament — from team management to live match tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="card-base p-6 space-y-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-ink">{feature.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ QUICK NAV CARDS ═══════════ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Explore Tournament
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Fixtures", icon: Calendar, href: "/fixtures", color: "ludo-blue", borderColor: "border-t-ludo-blue" },
              { label: "Standings", icon: BarChart3, href: "/standings", color: "ludo-green", borderColor: "border-t-ludo-green" },
              { label: "Live", icon: Radio, href: "/live", color: "ludo-red", borderColor: "border-t-ludo-red" },
              { label: "Results", icon: Trophy, href: "/results", color: "ludo-yellow", borderColor: "border-t-ludo-yellow" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.label} href={item.href}>
                  <div className={`card-base border-t-4 ${item.borderColor} p-5 text-center space-y-2 group cursor-pointer`}>
                    <Icon className={`w-8 h-8 mx-auto text-${item.color} transition-transform duration-300 group-hover:scale-125`} />
                    <p className="text-sm font-bold text-ink">{item.label}</p>
                    <ChevronRight className="w-4 h-4 mx-auto text-ink-muted group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center">
            {/* Animated Ludo Gradient Background */}
            <div className="absolute inset-0 ludo-gradient opacity-90" />
            <div className="absolute inset-0 bg-black/20" />
            
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to Compete?
              </h2>
              <p className="text-sm text-white/80 max-w-md mx-auto">
                Login to your team portal to view your matches, check standings, and stay updated on tournament progress.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-ink font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  Team Login
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PlayoraFooter />
    </main>
  )
}
