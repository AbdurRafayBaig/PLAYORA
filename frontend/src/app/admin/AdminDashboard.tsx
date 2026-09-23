"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Trophy, Users, Radio, Calendar, GitBranch, Crown, Shuffle,
  ArrowRight, CircleAlert, CheckCircle2, Plus,
} from "lucide-react"
import { AdminPage } from "@/components/ui/AdminPage"
import { KPICard } from "@/components/cards/KPICard"
import { Panel } from "@/components/ui/Panel"
import { Button } from "@/components/ui/Button"
import { StatusBadge } from "@/components/cards/StatusBadge"
import { MatchCard } from "@/components/tournament/MatchCard"
import { useTournament } from "@/lib/tournament/store"
import { isRoundComplete, isRoundFullyScheduled, roundSizes } from "@/lib/tournament/engine"
import { CONTACT } from "@/lib/constants"

/** Step 1: there is nothing yet. */
function CreateTournament() {
  const { createTournament } = useTournament()
  const [name, setName] = useState("Ludo Championship")
  const [venue, setVenue] = useState<string>(CONTACT.venue)

  return (
    <div className="card-base border-t-4 border-t-ludo-flame p-6 sm:p-8 max-w-xl">
      <h2 className="text-lg font-extrabold text-ink tracking-tight">
        Start a tournament
      </h2>
      <p className="text-xs text-ink-muted mt-1 leading-relaxed">
        Nothing is set up yet. Create the tournament first, then register teams
        — each one gets a login you hand over at the registration desk.
      </p>

      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          createTournament({ name, venue })
        }}
      >
        <div className="space-y-1.5">
          <label htmlFor="t-name" className="block text-xs font-semibold text-ink">
            Tournament name
          </label>
          <input
            id="t-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ludo-flame/40"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="t-venue" className="block text-xs font-semibold text-ink">
            Venue
          </label>
          <input
            id="t-venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ludo-flame/40"
          />
        </div>
        <Button type="submit" variant="primary" size="md" className="w-full">
          <Trophy aria-hidden="true" className="w-4 h-4" />
          Create tournament
        </Button>
      </form>
    </div>
  )
}

/** Step 2: teams are being registered, no draw yet. */
function SetupPhase() {
  const { teams, drawFirstRound } = useTournament()
  const enough = teams.length >= 2
  const path = enough ? roundSizes(teams.length).join(" → ") : "—"

  return (
    <div className="space-y-6">
      <div className="card-base border-t-4 border-t-ludo-indigo p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-ink">Registration open</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              {teams.length} {teams.length === 1 ? "team" : "teams"} registered.
              Add every team before drawing — the bracket is fixed once drawn.
            </p>
          </div>
          <Link
            href="/admin/teams"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-ludo-indigo-solid text-white text-sm font-semibold hover:bg-ludo-indigo-solid-hover transition-colors"
          >
            <Plus aria-hidden="true" className="w-4 h-4" />
            Add teams
          </Link>
        </div>

        {enough && (
          <p className="mt-4 text-xs text-ink-muted">
            Knockout path with {teams.length} teams:{" "}
            <span className="font-bold text-ink">{path}</span>
            {roundSizes(teams.length).some((n) => n % 2 === 1 && n > 1) && (
              <span className="block mt-1 text-ludo-mango-ink">
                An odd round is coming up, so one team will receive a bye and
                advance without playing. PLAYORA assigns it automatically.
              </span>
            )}
          </p>
        )}
      </div>

      <div className="card-base p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-ink">Draw the first round</h2>
          <p className="text-xs text-ink-muted mt-0.5 max-w-md leading-relaxed">
            {enough
              ? "Pairs every registered team at random and locks registration. You assign tables and times next."
              : "Register at least two teams before drawing."}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          disabled={!enough}
          onClick={drawFirstRound}
        >
          <Shuffle aria-hidden="true" className="w-4 h-4" />
          Draw &amp; start
        </Button>
      </div>
    </div>
  )
}

/** Step 3: the tournament is under way. */
function RunningPhase() {
  const { tournament, teams, matches, publishRound, advanceRound } = useTournament()
  if (!tournament) return null

  const round = tournament.rounds[tournament.currentRound]
  const inRound = matches.filter((m) => m.roundIndex === tournament.currentRound)
  const live = matches.filter((m) => m.status === "live")
  const scheduled = isRoundFullyScheduled(matches, tournament.currentRound)
  const complete = isRoundComplete(matches, tournament.currentRound)
  const stillIn = teams.filter((t) => t.status !== "eliminated").length
  const played = matches.filter((m) => m.status === "completed").length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard icon={<Users className="w-5 h-5" />} label="Teams still in" value={stillIn} hint={`${teams.length} registered`} accentColor="red" />
        <KPICard icon={<GitBranch className="w-5 h-5" />} label="Current round" value={round?.name ?? "—"} accentColor="blue" />
        <KPICard icon={<Trophy className="w-5 h-5" />} label="Matches played" value={played} accentColor="yellow" />
        <KPICard icon={<Radio className="w-5 h-5" />} label="Live now" value={live.length} accentColor="green" />
      </div>

      {/* The operator's next action, stated plainly. On tournament day this
          is the only part of the dashboard that matters. */}
      <div className="card-base border-l-4 border-l-ludo-flame p-5">
        <h2 className="text-sm font-bold text-ink flex items-center gap-2">
          {complete ? (
            <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-ludo-lemon-ink" />
          ) : (
            <CircleAlert aria-hidden="true" className="w-4 h-4 text-ludo-flame-ink" />
          )}
          What to do next
        </h2>

        {!scheduled ? (
          <>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              {round?.name} is drawn but not every match has a table and a
              kickoff time yet. Teams see nothing until the round is published.
            </p>
            <Link
              href="/admin/fixtures"
              className="mt-3 inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-ludo-flame-solid text-white text-sm font-semibold hover:bg-ludo-flame-solid-hover transition-colors"
            >
              <Calendar aria-hidden="true" className="w-4 h-4" />
              Assign tables &amp; times
            </Link>
          </>
        ) : !round?.published ? (
          <>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Every {round?.name} match is assigned. Publishing notifies all the
              teams involved and makes the fixtures public.
            </p>
            <Button
              variant="primary"
              size="md"
              className="mt-3"
              onClick={() => publishRound(tournament.currentRound)}
            >
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
              Publish {round?.name} &amp; notify teams
            </Button>
          </>
        ) : !complete ? (
          <>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              {round?.name} is published. Start each match and record who
              advanced from the live control panel.
            </p>
            <Link
              href="/admin/live"
              className="mt-3 inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-ludo-flame-solid text-white text-sm font-semibold hover:bg-ludo-flame-solid-hover transition-colors"
            >
              <Radio aria-hidden="true" className="w-4 h-4" />
              Open live control
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Every {round?.name} result is in. Advancing draws the next round
              from the winners.
            </p>
            <Button variant="primary" size="md" className="mt-3" onClick={advanceRound}>
              <Shuffle aria-hidden="true" className="w-4 h-4" />
              Advance to the next round
            </Button>
          </>
        )}
      </div>

      {live.length > 0 && (
        <Panel
          title="Live right now"
          icon={<Radio aria-hidden="true" className="w-4 h-4 text-ludo-flame-ink" />}
          action={
            <Link href="/admin/live" className="text-[11px] font-semibold text-ludo-flame-ink hover:underline">
              Control
            </Link>
          }
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {live.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                teams={teams}
                roundName={tournament.rounds[m.roundIndex]?.name ?? ""}
                venue={tournament.venue}
              />
            ))}
          </div>
        </Panel>
      )}

      <Panel
        title={`${round?.name ?? "Current round"} — ${inRound.length} matches`}
        icon={<Calendar aria-hidden="true" className="w-4 h-4 text-ludo-indigo-ink" />}
        action={<StatusBadge status={round?.published ? "published" : "draft"} />}
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {inRound.map((m) => (
            <MatchCard key={m.id} match={m} teams={teams} roundName={round?.name ?? ""}
            venue={tournament.venue} />
          ))}
        </div>
      </Panel>
    </div>
  )
}

function CompletePhase() {
  const { tournament, teams } = useTournament()
  const champion = teams.find((t) => t.id === tournament?.championId)

  return (
    <div className="card-base border-2 border-ludo-mango bg-ludo-mango/10 p-8 text-center">
      <Crown aria-hidden="true" className="w-12 h-12 mx-auto text-ludo-mango-ink" />
      <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mt-2">
        Tournament complete
      </p>
      <h2 className="text-3xl font-extrabold text-ink tracking-tight mt-1">
        {champion?.name ?? "Champion"}
      </h2>
      <p className="text-xs text-ink-muted mt-2">
        Every round is finished. The full bracket stays available under Bracket.
      </p>
      <Link
        href="/admin/bracket"
        className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-ludo-mango-solid text-white text-sm font-semibold hover:bg-ludo-mango-solid-hover transition-colors"
      >
        <GitBranch aria-hidden="true" className="w-4 h-4" />
        View the bracket
      </Link>
    </div>
  )
}

export function AdminDashboard() {
  const { ready, tournament } = useTournament()

  if (!ready) {
    return (
      <AdminPage title="Dashboard">
        <div className="skeleton h-40 rounded-2xl" />
      </AdminPage>
    )
  }

  return (
    <AdminPage
      title="Dashboard"
      description={
        tournament
          ? `${tournament.name} · ${tournament.venue}`
          : "Set up a tournament to get started."
      }
      actions={tournament ? <StatusBadge status={tournament.phase} size="md" /> : undefined}
    >
      {!tournament ? (
        <CreateTournament />
      ) : tournament.phase === "setup" ? (
        <SetupPhase />
      ) : tournament.phase === "running" ? (
        <RunningPhase />
      ) : (
        <CompletePhase />
      )}
    </AdminPage>
  )
}
