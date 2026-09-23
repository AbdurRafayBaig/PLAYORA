import type { Metadata } from "next"
import { Calendar, Shuffle, Plus, AlertTriangle } from "lucide-react"
import { AdminPage, PreviewNotice } from "@/components/ui/AdminPage"
import { Button } from "@/components/ui/Button"
import { Panel } from "@/components/ui/Panel"
import { MatchCard } from "@/components/cards/MatchCard"
import { getMatchesByRound, TEAMS, TOURNAMENT } from "@/lib/data"
import { pluralise } from "@/lib/utils"

export const metadata: Metadata = { title: "Fixtures" }

export default function AdminFixturesPage() {
  const rounds = getMatchesByRound()
  const advancing = TEAMS.filter((t) => t.status === "qualified").length
  const isOdd = advancing % 2 !== 0

  return (
    <AdminPage
      eyebrow="Competition"
      title="Fixtures"
      description={`${TOURNAMENT.name} · ${TOURNAMENT.format}`}
      actions={
        <>
          <Button>
            <Shuffle aria-hidden="true" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generate round</span>
          </Button>
          <Button variant="primary">
            <Plus aria-hidden="true" className="w-3.5 h-3.5" />
            Add fixture
          </Button>
        </>
      }
    >
      {/* Odd-team progression is the recurring operational headache this
          tournament format has, so it gets a first-class warning. */}
      {isOdd && (
        <div className="card-base p-4 flex items-start gap-3 border-l-4 border-l-ludo-yellow">
          <AlertTriangle
            aria-hidden="true"
            className="w-5 h-5 text-ludo-yellow-ink shrink-0 mt-0.5"
          />
          <div>
            <h2 className="text-sm font-bold text-ink">Odd number of teams advancing</h2>
            <p className="text-xs text-ink-muted leading-relaxed mt-0.5">
              {advancing} teams qualify for the next round. Assign a bye or an
              advancement rule before generating the next set of fixtures,
              otherwise one team will be left without an opponent.
            </p>
          </div>
        </div>
      )}

      <PreviewNotice>
        Fixture generation, rescheduling and table assignment activate once the
        Django API is connected. The schedule below is the shared demo dataset.
      </PreviewNotice>

      {rounds.map((group) => (
        <Panel
          key={group.round}
          title={group.round}
          icon={<Calendar aria-hidden="true" className="w-4 h-4 text-ludo-blue-ink" />}
          action={
            <span className="text-[11px] text-ink-muted">
              {pluralise(group.matches.length, "match", "matches")}
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {group.matches.map((match) => (
              <MatchCard key={match.id} {...match} />
            ))}
          </div>
        </Panel>
      ))}
    </AdminPage>
  )
}
