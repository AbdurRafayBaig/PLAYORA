"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Settings, Palette, KeyRound, LogOut, LifeBuoy, ExternalLink, Eye } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Panel } from "@/components/ui/Panel"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { NotSignedIn } from "@/components/tournament/NoTournament"
import { useSignedInTeam, useTournament } from "@/lib/tournament/store"
import { CONTACT } from "@/lib/constants"
import { formatDate } from "@/lib/utils"

function Row({
  label,
  value,
  hint,
  action,
}: {
  label: string
  value: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-bold text-ink">{label}</p>
        <p className="text-[11px] text-ink-muted mt-0.5 break-words">{value}</p>
        {hint && <p className="text-[10px] text-ink-faint mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      {action}
    </div>
  )
}

export function TeamAccountClient() {
  const router = useRouter()
  const { ready, tournament, signOutTeam } = useTournament()
  const team = useSignedInTeam()

  if (!ready) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    )
  }

  if (!team) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <NotSignedIn />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description={`Signed in as ${team.name}`}
        icon={<Settings aria-hidden="true" className="w-5 h-5 text-ink-muted" />}
      />

      <Panel
        title="Your account"
        icon={<KeyRound aria-hidden="true" className="w-4 h-4 text-ludo-flame-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <Row label="Team" value={team.name} />
          <Row label="Team ID" value={team.code} hint="Used with your password to sign in." />
          <Row label="Registered" value={formatDate(team.registeredAt)} />
          <Row
            label="Password"
            value="Managed by the organiser"
            hint="Teams cannot change their own password. If you lose it, the organiser reissues one at the desk."
          />
        </div>
      </Panel>

      <Panel
        title="Appearance"
        icon={<Palette aria-hidden="true" className="w-4 h-4 text-ludo-orchid-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <Row
            label="Theme"
            value="Follows your device by default"
            hint="Stored in this browser only."
            action={<ThemeToggle />}
          />
        </div>
      </Panel>

      <Panel
        title="Help"
        icon={<LifeBuoy aria-hidden="true" className="w-4 h-4 text-ludo-indigo-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <Row
            label="Venue"
            value={tournament?.venue ?? CONTACT.venue}
            hint="All matches are played here."
          />
          <Row
            label="Contact the organisers"
            value={`${CONTACT.email} · ${CONTACT.phone}`}
            action={
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs font-semibold text-ludo-indigo-ink hover:underline"
              >
                Contact
                <ExternalLink aria-hidden="true" className="w-3 h-3" />
              </Link>
            }
          />
        </div>
      </Panel>

      <p className="text-[11px] text-ink-muted bg-ink-faint/5 border border-border rounded-xl px-3.5 py-2.5 leading-relaxed flex items-start gap-2">
        <Eye aria-hidden="true" className="w-4 h-4 shrink-0 mt-px" />
        Your portal is view-only. Everything about the tournament — fixtures,
        tables, times and results — is set by the organiser.
      </p>

      <button
        type="button"
        onClick={() => {
          signOutTeam()
          router.push("/login")
        }}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-ludo-flame/30 bg-ludo-flame/10 text-ludo-flame-ink font-semibold text-sm hover:bg-ludo-flame/20 transition-colors cursor-pointer"
      >
        <LogOut aria-hidden="true" className="w-4 h-4" />
        Log out
      </button>
    </div>
  )
}
