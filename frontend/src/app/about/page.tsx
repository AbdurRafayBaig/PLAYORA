import type { Metadata } from "next"
import Link from "next/link"
import {
  Trophy, Radio, Shield, GitBranch, ArrowRight, Mail, Phone, Shuffle,
} from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { PersonCard } from "@/components/cards/PersonCard"
import { TEAM_MEMBERS, BRAND, CONTACT } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About",
  description:
    "The team behind PLAYORA, led by Abdur Rafay Baig, and how it runs a Ludo knockout — the draw, manual or automatic pairing, live match control and a portal for every team.",
  alternates: { canonical: "/about" },
}

const CAPABILITIES = [
  {
    icon: GitBranch,
    title: "Bracket engine",
    description:
      "Halves the field every round — 50 teams becomes 25 matches, then 13 — and handles the bye when a round comes out odd. Progression comes from results, so the two can never disagree.",
    tint: "bg-ludo-orchid/15 text-ludo-orchid-ink",
  },
  {
    icon: Shuffle,
    title: "Your draw, your call",
    description:
      "Let PLAYORA draw the round, or pair every match yourself. An automatic draw stays editable — unpair, re-pair, move the bye — until a match starts.",
    tint: "bg-ludo-mango/20 text-ludo-mango-ink",
  },
  {
    icon: Radio,
    title: "Live match control",
    description:
      "Start a match and it shows as live everywhere, with a running clock, until you record which team advanced.",
    tint: "bg-ludo-flame/15 text-ludo-flame-ink",
  },
  {
    icon: Shield,
    title: "One organiser, full control",
    description:
      "Registration, logins, the draw, tables, kickoff times and publishing all sit with the organiser. Teams only see their own fixtures, and only once a round is published.",
    tint: "bg-ludo-indigo/10 text-ludo-indigo-ink",
  },
]

const STACK = [
  { group: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"] },
  { group: "Data", items: ["PostgreSQL (next release)", "Prisma", "Neon"] },
  { group: "Delivery", items: ["Vercel", "Installable web app", "Works down to 320px"] },
]

export default function AboutPage() {
  const lead = TEAM_MEMBERS.find((m) => m.isPrimary)
  const rest = TEAM_MEMBERS.filter((m) => !m.isPrimary)

  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />

      <main id="main-content" className="flex-1">
        {/* ── Intro ── */}
        <section className="border-b border-border bg-surface-raised/50">
          <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              About {BRAND.name}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink tracking-tight text-balance max-w-2xl">
              A Ludo knockout, run from one screen
            </h1>
            <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed max-w-2xl">
              {BRAND.name} replaces the whiteboard, the WhatsApp group and the
              paper bracket. The organiser registers teams and hands each one a
              login, draws the rounds or pairs them by hand, sets tables and
              kickoff times at the Cafe, and runs every match live. Teams follow
              their own run from their phones; everyone else follows the
              bracket. Built under Tynovate for the Sports Society.
            </p>
          </div>
        </section>

        {/* ── Capabilities ── */}
        <section className="max-w-5xl mx-auto px-4 py-14" aria-labelledby="what-heading">
          <h2 id="what-heading" className="text-xl font-extrabold text-ink tracking-tight">
            What it does
          </h2>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPABILITIES.map((c) => {
              const Icon = c.icon
              return (
                <li key={c.title} className="card-base p-5 space-y-3">
                  <span
                    aria-hidden="true"
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.tint}`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-sm font-bold text-ink">{c.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{c.description}</p>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ── Team ── */}
        <section
          className="border-y border-border bg-surface-raised/50"
          aria-labelledby="team-heading"
        >
          <div className="max-w-5xl mx-auto px-4 py-14">
            <h2 id="team-heading" className="text-xl font-extrabold text-ink tracking-tight">
              The team
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted max-w-xl leading-relaxed">
              Led by Abdur Rafay Baig, who architected and built the platform
              end to end, with two specialists on the backend and on mobile.
            </p>

            {/* Lead card centred and narrow so it grows downward, with the
                other two side by side beneath it. */}
            <div className="mt-6 space-y-5">
              {lead && <PersonCard {...lead} />}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 list-none max-w-3xl mx-auto">
                {rest.map((member) => (
                  <li key={member.name}>
                    <PersonCard {...member} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Stack ── */}
        <section className="max-w-5xl mx-auto px-4 py-14" aria-labelledby="stack-heading">
          <h2 id="stack-heading" className="text-xl font-extrabold text-ink tracking-tight">
            Built with
          </h2>
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STACK.map((group) => (
              <div key={group.group}>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                  {group.group}
                </dt>
                <dd>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-ink-faint/10 text-ink-muted border border-border"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Contact ── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="relative overflow-hidden rounded-3xl bg-ludo-plum p-8 sm:p-10">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 ludo-gradient" />
            <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-extrabold text-ludo-vanilla tracking-tight">
                  Questions about the tournament?
                </h2>
                <p className="mt-2 text-sm text-ludo-vanilla/80 max-w-md leading-relaxed">
                  Reach the organisers directly — fastest during tournament hours.
                </p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-ludo-mango hover:underline break-all"
                  >
                    <Mail aria-hidden="true" className="w-4 h-4 shrink-0" />
                    {CONTACT.email}
                  </a>
                  <a
                    href={`tel:+${CONTACT.phoneLink}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-ludo-mango hover:underline"
                  >
                    <Phone aria-hidden="true" className="w-4 h-4 shrink-0" />
                    {CONTACT.phone}
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <Link
                  href="/bracket"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ludo-vanilla text-ludo-plum text-sm font-bold hover:bg-white transition-colors"
                >
                  <Trophy aria-hidden="true" className="w-4 h-4" />
                  View the bracket
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-ludo-vanilla/40 text-ludo-vanilla text-sm font-bold hover:bg-ludo-vanilla/10 transition-colors"
                >
                  Rules &amp; contact
                  <ArrowRight aria-hidden="true" className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PlayoraFooter />
    </div>
  )
}
