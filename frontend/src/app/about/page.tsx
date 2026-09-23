"use client"

import Link from "next/link"
import {
  ArrowLeft, Trophy, Radio, Users, Shield,
  BarChart3, Zap,
} from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { PersonCard } from "@/components/cards/PersonCard"
import { TEAM_MEMBERS, BRAND } from "@/lib/constants"

const PLATFORM_FEATURES = [
  {
    icon: Trophy,
    title: "Tournament Operations",
    description: "Full tournament lifecycle management — from team registration to final standings, with configurable formats and rules.",
    color: "text-ludo-red",
  },
  {
    icon: Radio,
    title: "Live Match Engine",
    description: "Real-time match tracking with WebSocket-powered live updates, scorer views, and instant result publication.",
    color: "text-ludo-green",
  },
  {
    icon: Shield,
    title: "Admin Control & Audit",
    description: "Complete administrative control with audit-logged overrides, advancement decisions, and dispute resolution.",
    color: "text-ludo-blue",
  },
]

export default function AboutPage() {
  const primaryMember = TEAM_MEMBERS.find((m) => m.isPrimary)
  const secondaryMembers = TEAM_MEMBERS.filter((m) => !m.isPrimary)

  return (
    <main className="min-h-screen flex flex-col">
      <PlayoraHeader />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-10 md:py-16 w-full space-y-12">
        {/* ── Back Navigation ── */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-ink-faint/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-ink-muted" />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              About
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
              The Team Behind {BRAND.name}
            </h1>
          </div>
        </div>

        {/* ── Section: Leadership & Engineering ── */}
        <div className="text-center space-y-1 animate-fade-in">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            Leadership & Engineering
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            The Brilliant Minds Behind{" "}
            <span className="text-gradient-ludo">{BRAND.name}</span>
          </h2>
        </div>

        {/* ── Primary Person Card (Abdur Rafay — Lead) ── */}
        {primaryMember && (
          <div className="animate-fade-in-up">
            <PersonCard {...primaryMember} />
          </div>
        )}

        {/* ── Secondary Team Members ── */}
        {secondaryMembers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up delay-200">
            {secondaryMembers.map((member) => (
              <PersonCard key={member.name + member.role} {...member} />
            ))}
          </div>
        )}

        {/* ── About PLAYORA Section ── */}
        <section className="space-y-4 pt-6 animate-fade-in-up delay-300">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
              About {BRAND.name}
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-2 max-w-2xl mx-auto">
              {BRAND.name} is a comprehensive sports tournament management portal built under Tynovate.
              It bridges the gap between tournament organizers, teams, referees, and spectators — providing
              real-time match tracking, automated standings, and complete administrative control for
              Ludo championships and beyond.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {PLATFORM_FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="card-base p-5 space-y-2">
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                  <h3 className="text-sm font-bold text-ink">{feature.title}</h3>
                  <p className="text-[11px] text-ink-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Tech Stack Section ── */}
        <section className="space-y-4 animate-fade-in-up delay-400">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Technology Stack
            </span>
            <h2 className="text-lg font-bold text-ink tracking-tight mt-1">
              Built with Modern Tech
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { name: "Next.js", color: "bg-ink/5 text-ink border-ink/10" },
              { name: "TypeScript", color: "bg-ludo-blue/10 text-ludo-blue border-ludo-blue/20" },
              { name: "Tailwind CSS", color: "bg-ludo-blue/10 text-ludo-blue border-ludo-blue/20" },
              { name: "Django", color: "bg-ludo-green/10 text-ludo-green border-ludo-green/20" },
              { name: "Django REST", color: "bg-ludo-green/10 text-ludo-green border-ludo-green/20" },
              { name: "PostgreSQL", color: "bg-ludo-blue/10 text-ludo-blue border-ludo-blue/20" },
              { name: "WebSockets", color: "bg-ludo-red/10 text-ludo-red border-ludo-red/20" },
              { name: "Vercel", color: "bg-ink/5 text-ink border-ink/10" },
            ].map((tech) => (
              <span
                key={tech.name}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="p-6 rounded-2xl border border-ludo-red/20 bg-ludo-red/5 text-center space-y-3 animate-fade-in-up delay-500">
          <h3 className="text-sm font-bold text-ink">Ready to Explore the Tournament?</h3>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/live"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ludo-red text-white text-xs font-semibold shadow hover:bg-ludo-red-dark transition-colors"
            >
              <Radio className="w-4 h-4" />
              Live Matches
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-ink text-xs font-semibold hover:bg-ink-faint/10 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </div>

      <PlayoraFooter />
    </main>
  )
}
