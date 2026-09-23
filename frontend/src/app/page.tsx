import type { Metadata } from "next"
import Link from "next/link"
import {
  Trophy, Users, Radio, Calendar, BarChart3, ArrowRight,
  Zap, Shield, Smartphone, ChevronRight, CalendarClock,
} from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { MatchCard } from "@/components/cards/MatchCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { BRAND } from "@/lib/constants"
import {
  TOURNAMENT,
  getCompletedMatches,
  getLiveMatches,
  getTournamentStats,
} from "@/lib/data"

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description:
    "Follow the Ludo Championship live: real-time match tracking, fixtures, standings and results, plus portals for teams and tournament admins.",
  alternates: { canonical: "/" },
}

const FEATURES = [
  {
    icon: Zap,
    title: "Live Match Tracking",
    description:
      "Real-time match updates with WebSocket-powered live scores, status changes, and instant result publication.",
    color: "bg-ludo-red/10 text-ludo-red-ink",
  },
  {
    icon: Shield,
    title: "Admin Control Center",
    description:
      "Full tournament management — fixtures, results, overrides, advancements, byes, and audit-logged operations.",
    color: "bg-ludo-blue/10 text-ludo-blue-ink",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Optimized scorer view for referees, bottom-nav team portal, and responsive public pages — all touch-friendly.",
    color: "bg-ludo-green/10 text-ludo-green-ink",
  },
]

const QUICK_NAV = [
  { label: "Fixtures", icon: Calendar, href: "/fixtures", border: "border-t-ludo-blue", tint: "text-ludo-blue-ink" },
  { label: "Standings", icon: BarChart3, href: "/standings", border: "border-t-ludo-green", tint: "text-ludo-green-ink" },
  { label: "Live", icon: Radio, href: "/live", border: "border-t-ludo-red", tint: "text-ludo-red-ink" },
  { label: "Results", icon: Trophy, href: "/results", border: "border-t-ludo-yellow", tint: "text-ludo-yellow-ink" },
]

export default function HomePage() {
  const stats = getTournamentStats()
  const liveMatches = getLiveMatches()
  const recentResults = getCompletedMatches().slice(0, 2)

  const quickStats = [
    { label: "Teams Registered", value: stats.teams, icon: Users, color: "text-ludo-red-ink" },
    { label: "Matches Played", value: stats.matchesPlayed, icon: Trophy, color: "text-ludo-yellow-ink" },
    { label: "Live Now", value: stats.liveNow, icon: Radio, color: "text-ludo-green-ink" },
    { label: "Next Match In", value: stats.nextMatchIn, icon: CalendarClock, color: "text-ludo-blue-ink" },
  ]

  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />

      <main id="main-content" className="flex-1">
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-20 left-10 w-72 h-72 bg-ludo-red/5 rounded-full blur-3xl animate-float" />
            <div className="absolute top-40 right-20 w-96 h-96 bg-ludo-blue/5 rounded-full blur-3xl animate-float anim-delay-200" />
            <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-ludo-green/5 rounded-full blur-3xl animate-float anim-delay-400" />
            <div className="absolute bottom-40 right-10 w-48 h-48 bg-ludo-yellow/5 rounded-full blur-3xl animate-float anim-delay-300" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-in-up">
              <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ludo-red/10 border border-ludo-red/20 text-ludo-red-ink text-xs font-semibold">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-ludo-red" />
                </span>
                {TOURNAMENT.name} · {TOURNAMENT.stage}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.1] text-balance">
                Welcome to <span className="text-gradient-ludo">{BRAND.name}</span>
              </h1>

              <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed text-balance">
                The complete {BRAND.tagline.toLowerCase()} — track live matches,
                view fixtures and standings, and follow your favourite teams
                through every round of the Ludo championship.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-4">
                <Link
                  href="/live"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-ludo-red text-white font-bold text-sm shadow-lg hover:bg-ludo-red-dark hover:shadow-xl transition-all duration-300 group"
                >
                  <Radio aria-hidden="true" className="w-4 h-4" />
                  Watch Live Matches
                  <ArrowRight
                    aria-hidden="true"
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/standings"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-border bg-surface-raised text-ink font-bold text-sm hover:bg-ink-faint/10 transition-colors duration-300"
                >
                  <BarChart3 aria-hidden="true" className="w-4 h-4 text-ludo-blue-ink" />
                  View Standings
                </Link>
              </div>
            </div>

            {/* Quick stats */}
            <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto animate-fade-in-up anim-delay-200">
              {quickStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="card-base p-4 text-center">
                    <Icon aria-hidden="true" className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <dd className="text-2xl font-extrabold text-ink tabular-nums">
                      {stat.value}
                    </dd>
                    <dt className="text-[11px] font-medium text-ink-muted">{stat.label}</dt>
                  </div>
                )
              })}
            </dl>
          </div>
        </section>

        {/* ═══════════ LIVE MATCHES ═══════════ */}
        <section className="py-14 sm:py-16 bg-surface-raised/50" aria-labelledby="live-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-3 w-3" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-red opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-ludo-red" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-ludo-red-ink">
                    Live Now
                  </span>
                </p>
                <h2
                  id="live-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight"
                >
                  Live Matches
                </h2>
              </div>
              <Link
                href="/live"
                className="text-sm font-semibold text-ludo-red-ink hover:underline inline-flex items-center gap-1 shrink-0"
              >
                View all
                <ChevronRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>

            {liveMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} {...match} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Radio className="w-6 h-6" />}
                title="No matches in progress"
                description="Nothing is being played right now. Check the fixtures page for what is coming up next."
                action={
                  <Link
                    href="/fixtures"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ludo-blue text-white text-xs font-semibold hover:bg-ludo-blue-dark transition-colors"
                  >
                    <Calendar aria-hidden="true" className="w-4 h-4" />
                    See fixtures
                  </Link>
                }
              />
            )}
          </div>
        </section>

        {/* ═══════════ RECENT RESULTS ═══════════ */}
        <section className="py-14 sm:py-16" aria-labelledby="results-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ludo-green-ink mb-1">
                  Completed
                </p>
                <h2
                  id="results-heading"
                  className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight"
                >
                  Recent Results
                </h2>
              </div>
              <Link
                href="/results"
                className="text-sm font-semibold text-ludo-green-ink hover:underline inline-flex items-center gap-1 shrink-0"
              >
                View all
                <ChevronRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentResults.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ FEATURES ═══════════ */}
        <section className="py-14 sm:py-16 bg-surface-raised/50" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                Why {BRAND.name}
              </p>
              <h2
                id="features-heading"
                className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight"
              >
                Built for Tournament Excellence
              </h2>
              <p className="text-sm text-ink-muted mt-2 max-w-lg mx-auto text-balance">
                Everything you need to run a professional sports tournament —
                from team management to live match tracking.
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FEATURES.map((feature) => {
                const Icon = feature.icon
                return (
                  <li key={feature.title} className="card-base p-6 space-y-3">
                    <span
                      aria-hidden="true"
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </span>
                    <h3 className="text-base font-bold text-ink">{feature.title}</h3>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* ═══════════ QUICK NAV ═══════════ */}
        <section className="py-14 sm:py-16" aria-labelledby="explore-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              id="explore-heading"
              className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight text-center mb-8"
            >
              Explore Tournament
            </h2>

            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_NAV.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`card-base border-t-4 ${item.border} p-5 flex flex-col items-center gap-2 text-center group h-full`}
                    >
                      <Icon
                        aria-hidden="true"
                        className={`w-8 h-8 ${item.tint} transition-transform duration-300 group-hover:scale-110`}
                      />
                      <span className="text-sm font-bold text-ink">{item.label}</span>
                      <ChevronRight
                        aria-hidden="true"
                        className="w-4 h-4 text-ink-muted transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* ═══════════ CTA ═══════════ */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* The gradient used to run behind the text under a 45% black
                wash — the only way white stayed legible over the yellow
                stop, and it turned the whole panel muddy brown. Now the
                gradient is a crisp accent bar and the text sits on solid
                ink, which reads better and clears AA comfortably. */}
            <div className="relative overflow-hidden rounded-3xl bg-[#121722] p-8 sm:p-12 text-center">
              <div className="absolute inset-x-0 top-0 h-1.5 ludo-gradient" aria-hidden="true" />
              <div
                aria-hidden="true"
                className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-ludo-blue/20 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-ludo-red/20 blur-3xl"
              />

              <div className="relative z-10 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Ready to Compete?
                </h2>
                <p className="text-sm text-white/90 max-w-md mx-auto text-balance">
                  Log in to your team portal to view your matches, check
                  standings, and stay updated on tournament progress.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-ink font-bold text-sm shadow-lg hover:bg-white/90 transition-colors"
                  >
                    Team Login
                    <ArrowRight aria-hidden="true" className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-white/40 text-white font-bold text-sm hover:bg-white/10 transition-colors"
                  >
                    About Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PlayoraFooter />
    </div>
  )
}
