"use client"

import {
  MessageCircle, Mail, Phone, MapPin, Clock,
  FileText, AlertTriangle, CheckCircle2, Users,
} from "lucide-react"
import { PlayoraHeader } from "@/components/layout/PlayoraHeader"
import { PlayoraFooter } from "@/components/layout/PlayoraFooter"
import { BRAND } from "@/lib/constants"

const RULES = [
  "Each team consists of exactly 2 members.",
  "All matches are governed by standard Ludo rules as defined by the Sports Society.",
  "Teams must check in at least 10 minutes before their scheduled match time.",
  "Failure to check in results in an automatic walkover for the opposing team.",
  "All results are final once verified and locked by the Admin/Referee.",
  "Disputes must be raised within 15 minutes of result submission.",
  "The tournament admin reserves the right to reschedule, disqualify, or apply penalties as needed.",
  "Any form of cheating or unsportsmanlike behavior will result in immediate disqualification.",
  "Administrative overrides and corrections are logged internally for audit purposes.",
  "Odd-number round progressions (byes, advancement) are decided by the tournament admin.",
]

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PlayoraHeader />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <MessageCircle className="w-5 h-5 text-ludo-blue" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Contact & Rules</h1>
          <p className="text-xs text-ink-muted mt-1">
            Get in touch with the tournament organizers or review the official rules
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-base border-t-4 border-t-ludo-red p-5 space-y-2 text-center">
            <Mail className="w-6 h-6 mx-auto text-ludo-red" />
            <h3 className="text-sm font-bold text-ink">Email</h3>
            <p className="text-xs text-ink-muted">For general inquiries and support</p>
            <a href="mailto:ludo@sportssociety.edu" className="text-xs font-semibold text-ludo-red hover:underline block">
              ludo@sportssociety.edu
            </a>
          </div>

          <div className="card-base border-t-4 border-t-ludo-green p-5 space-y-2 text-center">
            <Phone className="w-6 h-6 mx-auto text-ludo-green" />
            <h3 className="text-sm font-bold text-ink">WhatsApp</h3>
            <p className="text-xs text-ink-muted">Quick responses during tournament hours</p>
            <span className="text-xs font-semibold text-ludo-green block">+92 300 000 0000</span>
          </div>

          <div className="card-base border-t-4 border-t-ludo-blue p-5 space-y-2 text-center">
            <MapPin className="w-6 h-6 mx-auto text-ludo-blue" />
            <h3 className="text-sm font-bold text-ink">Venue</h3>
            <p className="text-xs text-ink-muted">Main tournament venue</p>
            <span className="text-xs font-semibold text-ludo-blue block">University Main Hall</span>
          </div>
        </div>

        {/* Tournament Hours */}
        <div className="card-base p-5 flex items-center gap-4 border-l-4 border-l-ludo-yellow">
          <Clock className="w-6 h-6 text-ludo-yellow flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-ink">Tournament Hours</h3>
            <p className="text-xs text-ink-muted">
              Matches are scheduled between <strong>10:00 AM – 6:00 PM</strong> on tournament days.
              Support available during these hours via WhatsApp.
            </p>
          </div>
        </div>

        {/* Rules Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-ludo-red" />
            <h2 className="text-lg font-bold text-ink tracking-tight">Official Tournament Rules</h2>
          </div>

          <div className="card-base divide-y divide-border overflow-hidden">
            {RULES.map((rule, i) => (
              <div key={i} className="px-4 py-3 flex gap-3 hover:bg-ink-faint/5 transition-colors">
                <span className="w-6 h-6 rounded-full bg-ludo-red/10 text-ludo-red text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-ink-muted leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Important Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-base p-4 space-y-2 border-l-4 border-l-ludo-green">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-ludo-green" />
              <h3 className="text-xs font-bold text-ink">Fair Play</h3>
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              All participants are expected to maintain sportsman spirit. The tournament celebrates competition, skill, and camaraderie.
            </p>
          </div>

          <div className="card-base p-4 space-y-2 border-l-4 border-l-ludo-yellow">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-ludo-yellow" />
              <h3 className="text-xs font-bold text-ink">Disputes</h3>
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Any disputes regarding match results must be raised within 15 minutes. The admin&apos;s decision on disputes is final.
            </p>
          </div>
        </div>

        {/* Organized By */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-4 h-4 text-ink-muted" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Organized By</span>
          </div>
          <p className="text-sm font-bold text-ink">Sports Society — Ludo Championship 2026</p>
          <p className="text-xs text-ink-muted">Powered by {BRAND.name} • {BRAND.footer}</p>
        </div>
      </div>

      <PlayoraFooter />
    </main>
  )
}
