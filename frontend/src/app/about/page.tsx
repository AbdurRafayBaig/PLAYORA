import type { Metadata } from "next"
import Link from "next/link"
import { Trophy, Radio, Shield, ArrowLeft } from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { PersonCard } from "@/components/cards/PersonCard"
import { TEAM_MEMBERS, BRAND } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About",
  description:
    "The team behind PLAYORA and the technology that runs the Ludo Championship — tournament operations, a live match engine, and audit-logged admin control.",
  alternates: { canonical: "/about" },
}

const PLATFORM_FEATURES = [
  {
    icon: Trophy,
    title: "Tournament Operations",
    description:
      "Full tournament lifecycle management — from team registration to final standings, with configurable formats and rules.",
    color: "text-ludo-red-ink",
  },
  {
    icon: Radio,
    title: "Live Match Engine",
    description:
      "Real-time match tracking with WebSocket-powered live updates, scorer views, and instant result publication.",
    color: "text-ludo-green-ink",
  },
  {
    icon: Shield,
    title: "Admin Control & Audit",
    description:
      "Complete administrative control with audit-logged overrides, advancement decisions, and dispute resolution.",
    color: "text-ludo-blue-ink",
  },
]

const TECH = [
  { name: "Next.js", color: "bg-ink/5 text-ink border-ink/10" },
  { name: "TypeScript", color: "bg-ludo-blue/10 text-ludo-blue-ink border-ludo-blue/20" },
  { name: "Tailwind CSS", color: "bg-ludo-blue/10 text-ludo-blue-ink border-ludo-blue/20" },
  { name: "Django", color: "bg-ludo-green/10 text-ludo-green-ink border-ludo-green/20" },
  { name: "Django REST", color: "bg-ludo-green/10 text-ludo-green-ink border-ludo-green/20" },
  { name: "PostgreSQL", color: "bg-ludo-blue/10 text-ludo-blue-ink border-ludo-blue/20" },
  { name: "WebSockets", color: "bg-ludo-red/10 text-ludo-red-ink border-ludo-red/20" },
  { name: "Vercel", color: "bg-ink/5 text-ink border-ink/10" },
]

export default function AboutPage() {
  const primaryMember = TEAM_MEMBERS.find((m) => m.isPrimary)
  const secondaryMembers = TEAM_MEMBERS.filter((m) => !m.isPrimary)

  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />

      <main
        id="main-content"
        className="flex-1 max-w-4xl mx-auto px-4 py-10 md:py-14 w-full space-y-12"
      >
        {/* Heading */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back to home"
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border border-border text-ink hover:bg-ink-faint/10 transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4 text-ink-muted" />
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              About
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
              The Team Behind {BRAND.name}
            </h1>
          </div>
        </div>

        {/* People */}
        <section aria-labelledby="team-heading" className="space-y-8">
          <div className="text-center space-y-1 animate-fade-in">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Leadership &amp; Engineering
            </p>
            <h2
              id="team-heading"
              className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight text-balance"
            >
              The Brilliant Minds Behind{" "}
              <span className="text-gradient-ludo">{BRAND.name}</span>
            </h2>
          </div>

          {primaryMember && (
            <div className="animate-fade-in-up">
              <PersonCard {...primaryMember} />
            </div>
          )}

          {secondaryMembers.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up anim-delay-200 list-none">
              {secondaryMembers.map((member) => (
                <li key={member.name}>
                  <PersonCard {...member} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* About the platform */}
        <section className="space-y-6 animate-fade-in-up anim-delay-300" aria-labelledby="platform-heading">
          <div className="text-center">
            <h2
              id="platform-heading"
              className="text-lg sm:text-xl font-bold text-ink tracking-tight"
            >
              About {BRAND.name}
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed mt-2 max-w-2xl mx-auto text-balance">
              {BRAND.name} is a comprehensive sports tournament management
              portal built under Tynovate. It bridges the gap between tournament
              organisers, teams, referees, and spectators — providing real-time
              match tracking, automated standings, and complete administrative
              control for Ludo championships and beyond.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PLATFORM_FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <li key={feature.title} className="card-base p-5 space-y-2">
                  <Icon aria-hidden="true" className={`w-6 h-6 ${feature.color}`} />
                  <h3 className="text-sm font-bold text-ink">{feature.title}</h3>
                  <p className="text-[11px] text-ink-muted leading-relaxed">
                    {feature.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Tech stack */}
        <section className="space-y-4 animate-fade-in-up anim-delay-400" aria-labelledby="stack-heading">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Technology Stack
            </p>
            <h2 id="stack-heading" className="text-lg font-bold text-ink tracking-tight mt-1">
              Built with Modern Tech
            </h2>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-2">
            {TECH.map((tech) => (
              <li
                key={tech.name}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border ${tech.color}`}
              >
                {tech.name}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="p-6 rounded-2xl border border-ludo-red/20 bg-ludo-red/5 text-center space-y-4 animate-fade-in-up anim-delay-500">
          <h2 className="text-sm font-bold text-ink">
            Ready to Explore the Tournament?
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              href="/live"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ludo-red-solid text-white text-xs font-semibold shadow hover:bg-ludo-red-solid-hover transition-colors"
            >
              <Radio aria-hidden="true" className="w-4 h-4" />
              Live Matches
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface-raised text-ink text-xs font-semibold hover:bg-ink-faint/10 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>

      <PlayoraFooter />
    </div>
  )
}
