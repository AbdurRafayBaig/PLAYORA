"use client"

import Link from "next/link"
import {
  Trophy, Users, Radio, Calendar, GitBranch, ArrowRight,
  Zap, Shield, Smartphone, ChevronRight, Crown,
} from "lucide-react"
import { MatchCard } from "@/components/tournament/MatchCard"
import { NoTournament } from "@/components/tournament/NoTournament"
import { EmptyState } from "@/components/ui/EmptyState"
import { BRAND, CONTACT } from "@/lib/constants"
import { useTournament, usePublishedMatches } from "@/lib/tournament/store"

const FEATURES = [
  {
    icon: Zap,
    title: "Live Match Tracking",
    description:
      "Matches go live from the admin's control panel with a running clock, so anyone watching knows exactly what is being played right now.",
    color: "bg-ludo-flame/15 text-ludo-flame-ink",
  },
  {
    icon: Shield,
    title: "Admin Runs Everything",
    description:
      "The organiser creates the tournament, registers teams, hands out logins, draws the bracket, assigns tables and publishes each round.",
    color: "bg-ludo-indigo/10 text-ludo-indigo-ink",
  },
  {
    icon: Smartphone,
    title: "Built for a Phone",
    description:
      "Captains follow their fixtures one-handed on the way to the table, and referees score without pinching to zoom.",
    color: "bg-ludo-orchid/15 text-ludo-orchid-ink",
  },
]

const QUICK_NAV = [
  { label: "Fixtures", icon: Calendar, href: "/fixtures", border: "border-t-ludo-indigo", tint: "text-ludo-indigo-ink" },
  { label: "Bracket", icon: GitBranch, href: "/bracket", border: "border-t-ludo-orchid", tint: "text-ludo-orchid-ink" },
  { label: "Live", icon: Radio, href: "/live", border: "border-t-ludo-flame", tint: "text-ludo-flame-ink" },
  { label: "Results", icon: Trophy, href: "/results", border: "border-t-ludo-mango", tint: "text-ludo-mango-ink" },
]

export function HomeClient() {
  const { ready, tournament, teams, matches } = useTournament()
  const published = usePublishedMatches()

  const live = published.filter((m) => m.status === "live")
  const recent = published.filter((m) => m.status === "completed").slice(-2).reverse()
  const upcoming = published.filter((m) => m.status === "scheduled")
  const roundName = (i: number) => tournament?.rounds[i]?.name ?? `Round ${i + 1}`
  const champion = tournament?.championId
    ? teams.find((t) => t.id === tournament.championId)
    : null

  const stillIn = teams.filter((t) => t.status !== "eliminated").length
  const played = matches.filter((m) => m.status === "completed").length

  const quickStats = [
    { label: "Teams Registered", value: teams.length, icon: Users, color: "text-ludo-flame-ink" },
    { label: "Still In", value: stillIn, icon: Shield, color: "text-ludo-orchid-ink" },
    { label: "Matches Played", value: played, icon: Trophy, color: "text-ludo-mango-ink" },
    { label: "Live Now", value: live.length, icon: Radio, color: "text-ludo-indigo-ink" },
  ]

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-10 w-72 h-72 bg-ludo-flame/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-ludo-indigo/10 rounded-full blur-3xl animate-float anim-delay-200" />
          <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-ludo-orchid/10 rounded-full blur-3xl animate-float anim-delay-400" />
          <div className="absolute bottom-40 right-10 w-48 h-48 bg-ludo-mango/10 rounded-full blur-3xl animate-float anim-delay-300" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-in-up">
            {ready && tournament ? (
              <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ludo-flame/15 border border-ludo-flame/30 text-ludo-flame-ink text-xs font-semibold">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-flame opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-ludo-flame" />
                </span>
                {tournament.name} · {roundName(tournament.currentRound)}
              </p>
            ) : (
              <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink-faint/10 border border-border text-ink-muted text-xs font-semibold">
                Knockout · {CONTACT.venue}
              </p>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.1] text-balance">
              Welcome to <span className="text-gradient-ludo">{BRAND.name}</span>
            </h1>

            <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed text-balance">
              A straight knockout Ludo tournament, run from one place. Follow
              every round live, see the bracket fill in, and know exactly when
              and where your team plays next.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-4">
              <Link
                href="/live"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-ludo-flame-solid text-white font-bold text-sm shadow-lg hover:bg-ludo-flame-solid-hover transition-colors duration-300 group"
              >
                <Radio aria-hidden="true" className="w-4 h-4" />
                Watch Live
                <ArrowRight
                  aria-hidden="true"
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/bracket"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-border bg-surface-raised text-ink font-bold text-sm hover:bg-ink-faint/10 transition-colors duration-300"
              >
                <GitBranch aria-hidden="true" className="w-4 h-4 text-ludo-indigo-ink" />
                View Bracket
              </Link>
            </div>
          </div>

          {ready && tournament && (
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
          )}
        </div>
      </section>

      {/* ═══════════ CHAMPION ═══════════ */}
      {champion && (
        <section className="pb-4" aria-labelledby="champion-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border-2 border-ludo-mango bg-ludo-mango/15 p-8 text-center">
              <Crown aria-hidden="true" className="w-10 h-10 mx-auto text-ludo-mango-ink" />
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mt-2">
                Tournament champion
              </p>
              <h2
                id="champion-heading"
                className="text-3xl font-extrabold text-ink tracking-tight mt-1"
              >
                {champion.name}
              </h2>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ LIVE ═══════════ */}
      <section className="py-14 sm:py-16 bg-surface-raised/50" aria-labelledby="live-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="flex items-center gap-2 mb-1">
                <span className="relative flex h-3 w-3" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ludo-flame opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-ludo-flame" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-ludo-flame-ink">
                  Live now
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
              className="text-sm font-semibold text-ludo-flame-ink hover:underline inline-flex items-center gap-1 shrink-0"
            >
              View all
              <ChevronRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>

          {!ready ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="skeleton h-40 rounded-2xl" />
              <div className="skeleton h-40 rounded-2xl" />
            </div>
          ) : !tournament ? (
            <NoTournament what="matches" />
          ) : live.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {live.map((m) => (
                <MatchCard key={m.id} match={m} teams={teams} roundName={roundName(m.roundIndex)} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Radio className="w-6 h-6" />}
              as="h3"
              title="Nothing in play right now"
              description={
                upcoming.length > 0
                  ? "No match has been started yet. The fixtures page shows what is coming up next."
                  : "No match is live. Check back once the organiser starts the next round."
              }
              action={
                <Link
                  href="/fixtures"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ludo-indigo-solid text-white text-xs font-semibold hover:bg-ludo-indigo-solid-hover transition-colors"
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
      {ready && recent.length > 0 && (
        <section className="py-14 sm:py-16" aria-labelledby="results-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ludo-lemon-ink mb-1">
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
                className="text-sm font-semibold text-ludo-lemon-ink hover:underline inline-flex items-center gap-1 shrink-0"
              >
                View all
                <ChevronRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {recent.map((m) => (
                <MatchCard key={m.id} match={m} teams={teams} roundName={roundName(m.roundIndex)} />
              ))}
            </div>
          </div>
        </section>
      )}

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
              One Place to Run the Whole Draw
            </h2>
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
            Explore the Tournament
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
          <div className="relative overflow-hidden rounded-3xl bg-ludo-plum p-8 sm:p-12 text-center">
            <div className="absolute inset-x-0 top-0 h-1.5 ludo-gradient" aria-hidden="true" />
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-ludo-orchid/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-ludo-flame/25 blur-3xl"
            />

            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ludo-vanilla tracking-tight">
                Playing in the tournament?
              </h2>
              <p className="text-sm text-ludo-vanilla/85 max-w-md mx-auto text-balance">
                Sign in with the team code and password the organiser gave you
                at registration to follow your own matches.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-ludo-vanilla text-ludo-plum font-bold text-sm shadow-lg hover:bg-white transition-colors"
                >
                  Team Login
                  <ArrowRight aria-hidden="true" className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-ludo-vanilla/40 text-ludo-vanilla font-bold text-sm hover:bg-ludo-vanilla/10 transition-colors"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
