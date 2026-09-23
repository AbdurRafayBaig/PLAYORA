import type { Metadata } from "next"
import { Settings, Palette, Bell, Database, Trophy } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { Panel } from "@/components/ui/Panel"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { TOURNAMENT } from "@/lib/data"
import { CONTACT } from "@/lib/constants"

export const metadata: Metadata = { title: "Settings" }

/** Read-only row: label, current value, and a disabled edit affordance. */
function SettingRow({
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
      {action ?? (
        <Button disabled aria-label={`Edit ${label}`}>
          Edit
        </Button>
      )}
    </div>
  )
}

export default function AdminSettingsPage() {
  return (
    <AdminPage
      eyebrow="Operations"
      title="Settings"
      description="Tournament rules, notifications and appearance."
    >
      <PreviewNotice>
        Settings are read-only in this preview. Editing writes to the backend
        once the Django API is connected.
      </PreviewNotice>

      <Panel
        title="Tournament"
        icon={<Trophy aria-hidden="true" className="w-4 h-4 text-ludo-red-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <SettingRow label="Tournament name" value={TOURNAMENT.name} />
          <SettingRow label="Organiser" value={TOURNAMENT.organiser} />
          <SettingRow
            label="Format"
            value={TOURNAMENT.format}
            hint="Changing the format after fixtures are generated requires regenerating the bracket."
          />
          <SettingRow label="Current stage" value={TOURNAMENT.stage} />
        </div>
      </Panel>

      <Panel
        title="Match rules"
        icon={<Settings aria-hidden="true" className="w-4 h-4 text-ludo-blue-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <SettingRow label="Check-in window" value="10 minutes before kickoff" hint="Teams that miss this forfeit by walkover." />
          <SettingRow label="Dispute window" value="15 minutes after result submission" />
          <SettingRow label="Points per win" value="3 points" />
          <SettingRow label="Odd-team progression" value="Admin assigns a bye" hint="Applied when an odd number of teams advances." />
          <SettingRow label="Tournament hours" value={CONTACT.hours} />
        </div>
      </Panel>

      <Panel
        title="Notifications"
        icon={<Bell aria-hidden="true" className="w-4 h-4 text-ludo-yellow-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <SettingRow label="Notify teams when fixtures are published" value="Enabled" />
          <SettingRow label="Notify teams 15 minutes before kickoff" value="Enabled" />
          <SettingRow label="Notify admins when a dispute is raised" value="Enabled" />
        </div>
      </Panel>

      <Panel
        title="Appearance"
        icon={<Palette aria-hidden="true" className="w-4 h-4 text-ludo-green-ink" />}
        flush
      >
        <div className="divide-y divide-border">
          <SettingRow
            label="Theme"
            value="Follows your device by default"
            hint="This preference is stored in your browser, not on your account."
            action={<ThemeToggle />}
          />
        </div>
      </Panel>

      <Panel
        title="Data"
        icon={<Database aria-hidden="true" className="w-4 h-4 text-ink-muted" />}
        flush
      >
        <div className="divide-y divide-border">
          <SettingRow
            label="Data source"
            value="Bundled demo dataset"
            hint="Set NEXT_PUBLIC_API_URL to point PLAYORA at a Django REST backend."
            action={<Button disabled>Connect</Button>}
          />
        </div>
      </Panel>
    </AdminPage>
  )
}
