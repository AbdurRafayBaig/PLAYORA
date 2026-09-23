import type { Metadata } from "next"
import Link from "next/link"
import {
  Settings, Palette, Bell, KeyRound, LogOut, LifeBuoy, ExternalLink,
} from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Panel } from "@/components/ui/Panel"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { getSignedInTeam, getPlayersForTeam } from "@/lib/data"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = { title: "Account" }

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
        {hint && <p className="text-[10px] text-ink-faint mt-0.5">{hint}</p>}
      </div>
      {action}
    </div>
  )
}

export default function TeamAccountPage() {
  const team = getSignedInTeam()
  const captain = getPlayersForTeam(team.id).find((p) => p.role === "Captain")

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description={`Signed in as ${team.name}`}
        icon={<Settings aria-hidden="true" className="w-5 h-5 text-ink-muted" />}
      />

      <Panel
        title="Team account"
        icon={<KeyRound aria-hidden="true" className="w-4 h-4 text-ludo-red-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <Row label="Team name" value={team.name} />
          <Row label="Team code" value={team.code} hint="Used together with your password to sign in." />
          <Row label="Captain" value={captain?.name ?? "—"} />
          <Row label="Registered" value={formatDate(team.registeredOn)} />
          <Row
            label="Password"
            value="••••••••"
            hint="Password changes are handled by the tournament admin."
            action={<Button disabled>Change</Button>}
          />
        </div>
      </Panel>

      <Panel
        title="Appearance"
        icon={<Palette aria-hidden="true" className="w-4 h-4 text-ludo-green-ink" />}
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
        title="Notifications"
        icon={<Bell aria-hidden="true" className="w-4 h-4 text-ludo-yellow-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <Row label="Match reminders" value="15 minutes before kickoff" action={<Button disabled>Edit</Button>} />
          <Row label="Result confirmations" value="Enabled" action={<Button disabled>Edit</Button>} />
          <Row label="Schedule changes" value="Enabled" action={<Button disabled>Edit</Button>} />
        </div>
      </Panel>

      <Panel
        title="Help"
        icon={<LifeBuoy aria-hidden="true" className="w-4 h-4 text-ludo-blue-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <Row
            label="Tournament rules"
            value="Check-in policy, disputes and fair play"
            action={
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs font-semibold text-ludo-blue-ink hover:underline"
              >
                Read
                <ExternalLink aria-hidden="true" className="w-3 h-3" />
              </Link>
            }
          />
          <Row
            label="Contact the organisers"
            value="Email or WhatsApp during tournament hours"
            action={
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs font-semibold text-ludo-blue-ink hover:underline"
              >
                Contact
                <ExternalLink aria-hidden="true" className="w-3 h-3" />
              </Link>
            }
          />
        </div>
      </Panel>

      <Link
        href="/login"
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-ludo-red/25 bg-ludo-red/10 text-ludo-red-ink font-semibold text-sm hover:bg-ludo-red/15 transition-colors"
      >
        <LogOut aria-hidden="true" className="w-4 h-4" />
        Log out
      </Link>
    </div>
  )
}
