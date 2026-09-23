import type { Metadata } from "next"
import {
  MessageCircle, Mail, Phone, MapPin, Clock,
  FileText, AlertTriangle, CheckCircle2, Users, ExternalLink,
} from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { PageHeader } from "@/components/ui/PageHeader"
import { BRAND, CONTACT } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Contact & Rules",
  description:
    "Reach the Ludo Championship organisers and read the official tournament rules, check-in policy and dispute process.",
  alternates: { canonical: "/contact" },
}

const RULES = [
  "Each team consists of exactly 2 members.",
  "All matches are governed by standard Ludo rules as defined by the Sports Society.",
  "Teams must check in at least 10 minutes before their scheduled match time.",
  "Failure to check in results in an automatic walkover for the opposing team.",
  "All results are final once verified and locked by the Admin/Referee.",
  "Disputes must be raised within 15 minutes of result submission.",
  "The tournament admin reserves the right to reschedule, disqualify, or apply penalties as needed.",
  "Any form of cheating or unsportsmanlike behaviour will result in immediate disqualification.",
  "Administrative overrides and corrections are logged internally for audit purposes.",
  "Odd-number round progressions (byes, advancement) are decided by the tournament admin.",
]

export default function ContactPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <PlayoraHeader />

      <main
        id="main-content"
        className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-10"
      >
        <PageHeader
          align="center"
          eyebrow="Support"
          title="Contact & Rules"
          description="Get in touch with the tournament organisers or review the official rules."
          icon={<MessageCircle aria-hidden="true" className="w-5 h-5 text-ludo-indigo-ink" />}
        />

        {/* Contact cards — every channel here is actually actionable. The
            phone number and venue used to be plain text you could not tap. */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <li className="card-base border-t-4 border-t-ludo-flame p-5 text-center flex flex-col gap-2">
            <Mail aria-hidden="true" className="w-6 h-6 mx-auto text-ludo-flame-ink" />
            <h2 className="text-sm font-bold text-ink">Email</h2>
            <p className="text-xs text-ink-muted">For general inquiries and support</p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-auto text-xs font-semibold text-ludo-flame-ink hover:underline break-words"
            >
              {CONTACT.email}
            </a>
          </li>

          <li className="card-base border-t-4 border-t-ludo-lemon p-5 text-center flex flex-col gap-2">
            <Phone aria-hidden="true" className="w-6 h-6 mx-auto text-ludo-lemon-ink" />
            <h2 className="text-sm font-bold text-ink">Phone &amp; WhatsApp</h2>
            <p className="text-xs text-ink-muted">Quickest during tournament hours</p>
            {/* tel: on a phone dials; wa.me on desktop opens WhatsApp Web. */}
            <a
              href={`tel:+${CONTACT.phoneLink}`}
              className="mt-auto text-xs font-semibold text-ludo-lemon-ink hover:underline"
            >
              {CONTACT.phone}
            </a>
            <a
              href={`https://wa.me/${CONTACT.phoneLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-ludo-lemon-ink hover:underline"
            >
              Message on WhatsApp
              <ExternalLink aria-hidden="true" className="w-2.5 h-2.5 opacity-70" />
            </a>
          </li>

          <li className="card-base border-t-4 border-t-ludo-indigo p-5 text-center flex flex-col gap-2">
            <MapPin aria-hidden="true" className="w-6 h-6 mx-auto text-ludo-indigo-ink" />
            <h2 className="text-sm font-bold text-ink">Venue</h2>
            <p className="text-xs text-ink-muted">Main tournament venue</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT.venue)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-1 text-xs font-semibold text-ludo-indigo-ink hover:underline"
            >
              {CONTACT.venue}
              <ExternalLink aria-hidden="true" className="w-2.5 h-2.5 opacity-70" />
            </a>
          </li>
        </ul>

        {/* Hours */}
        <div className="card-base p-5 flex items-start gap-4 border-l-4 border-l-ludo-mango">
          <Clock aria-hidden="true" className="w-6 h-6 text-ludo-mango-ink shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-bold text-ink">Tournament Hours</h2>
            <p className="text-xs text-ink-muted leading-relaxed mt-0.5">
              Matches are scheduled between <strong className="text-ink">{CONTACT.hours}</strong> on
              tournament days. Support is available during these hours via WhatsApp.
            </p>
          </div>
        </div>

        {/* Rules */}
        <section className="space-y-4" aria-labelledby="rules-heading">
          <h2
            id="rules-heading"
            className="text-lg font-bold text-ink tracking-tight flex items-center gap-2"
          >
            <FileText aria-hidden="true" className="w-5 h-5 text-ludo-flame-ink" />
            Official Tournament Rules
          </h2>

          <ol className="card-base divide-y divide-border overflow-hidden list-none">
            {RULES.map((rule, i) => (
              <li key={rule} className="px-4 py-3 flex gap-3 transition-colors hover:bg-ink-faint/5">
                <span
                  aria-hidden="true"
                  className="w-6 h-6 shrink-0 mt-0.5 rounded-full bg-ludo-flame/10 text-ludo-flame-ink text-[10px] font-bold flex items-center justify-center"
                >
                  {i + 1}
                </span>
                <p className="text-xs text-ink-muted leading-relaxed">{rule}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-base p-4 space-y-2 border-l-4 border-l-ludo-lemon">
            <h2 className="text-xs font-bold text-ink flex items-center gap-2">
              <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-ludo-lemon-ink" />
              Fair Play
            </h2>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              All participants are expected to maintain sportsmanship. The
              tournament celebrates competition, skill, and camaraderie.
            </p>
          </div>

          <div className="card-base p-4 space-y-2 border-l-4 border-l-ludo-mango">
            <h2 className="text-xs font-bold text-ink flex items-center gap-2">
              <AlertTriangle aria-hidden="true" className="w-4 h-4 text-ludo-mango-ink" />
              Disputes
            </h2>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Any dispute about a match result must be raised within 15 minutes.
              The admin&apos;s decision on disputes is final.
            </p>
          </div>
        </div>

        {/* Organised by */}
        <div className="text-center py-4">
          <p className="flex items-center justify-center gap-2 mb-2">
            <Users aria-hidden="true" className="w-4 h-4 text-ink-muted" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Organised By
            </span>
          </p>
          <p className="text-sm font-bold text-ink">
            Sports Society — Ludo Championship
          </p>
          <p className="text-xs text-ink-muted">
            Powered by {BRAND.name} · {BRAND.footer}
          </p>
        </div>
      </main>

      <PlayoraFooter />
    </div>
  )
}
