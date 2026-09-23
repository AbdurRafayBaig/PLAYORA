"use client"

import { useSyncExternalStore, type ReactNode } from "react"
import {
  buildRounds,
  generatePassword,
  generateTeamCode,
  isRoundComplete,
  pairTeams,
  shuffle,
  winnersOf,
} from "./engine"
import type { Match, Player, Team, TeamNotice, TournamentState } from "./types"

/* ═══════════════════════════════════════════════════════════
   Tournament store

   ── Read this before running a real tournament ──
   State lives in this browser's localStorage. Two consequences the UI is
   honest about, and that only the Django backend can fix:

   1. A team login created on the admin's laptop does not exist on a
      captain's phone. Cross-device access needs a server.
   2. The team password is checked in the browser, so it is readable from
      the JS bundle. This is a demo gate, not authentication.

   Implementation note: the state is a module-level value read through
   `useSyncExternalStore` rather than `useState` + a hydrating effect.
   Reading localStorage in an effect and calling setState is a cascading
   render (and a React 19 lint error); `useSyncExternalStore` is the
   primitive built for exactly this — server snapshot is empty, client
   snapshot is whatever was persisted, and React reconciles the two.

   Every action below maps one-to-one onto a REST endpoint, and the bracket
   maths already lives in `engine.ts` as pure functions, so porting this to
   the API is a change of transport rather than a rewrite.
   ═══════════════════════════════════════════════════════════ */

const STORAGE_KEY = "playora:tournament:v1"

const EMPTY: TournamentState = {
  tournament: null,
  teams: [],
  matches: [],
  notices: [],
  signedInTeamId: null,
  adminSignedIn: false,
}

let state: TournamentState = EMPTY
let hydrated = false
const listeners = new Set<() => void>()

function load(): TournamentState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<TournamentState>
    return {
      tournament: parsed.tournament ?? null,
      teams: parsed.teams ?? [],
      matches: parsed.matches ?? [],
      notices: parsed.notices ?? [],
      signedInTeamId: parsed.signedInTeamId ?? null,
      adminSignedIn: parsed.adminSignedIn ?? false,
    }
  } catch {
    // Corrupt or blocked storage should not take the whole app down.
    return EMPTY
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* Private mode — the session still works, it just will not persist. */
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

function getSnapshot(): TournamentState {
  if (!hydrated) {
    state = load()
    hydrated = true
  }
  return state
}

function getServerSnapshot(): TournamentState {
  return EMPTY
}

/** Single write path, so what is persisted can never drift from what renders. */
function commit(next: (prev: TournamentState) => TournamentState) {
  const value = next(getSnapshot())
  if (value === state) return
  state = value
  persist()
  listeners.forEach((l) => l())
}

let noticeSeq = 0
function notice(
  teamId: string | null,
  title: string,
  body: string,
  tone: TeamNotice["tone"] = "info",
): TeamNotice {
  noticeSeq += 1
  return {
    id: `N-${Date.now().toString(36)}-${noticeSeq}`,
    teamId,
    title,
    body,
    at: new Date().toISOString(),
    tone,
    read: false,
  }
}

/* ── Actions ─────────────────────────────────────────────── */

export function createTournament({ name, venue }: { name: string; venue: string }) {
  commit((prev) => ({
    ...EMPTY,
    adminSignedIn: prev.adminSignedIn,
    tournament: {
      name: name.trim() || "Ludo Championship",
      venue: venue.trim() || "Cafe",
      phase: "setup",
      createdAt: new Date().toISOString(),
      rounds: [],
      currentRound: 0,
      championId: null,
    },
  }))
}

export function resetEverything() {
  // Wiping the tournament should not also kick the organiser out of the
  // console they are standing in.
  commit((prev) => ({ ...EMPTY, adminSignedIn: prev.adminSignedIn }))
}

export function addTeam({ name, players }: { name: string; players: Player[] }): Team | null {
  let created: Team | null = null
  commit((prev) => {
    if (!prev.tournament || prev.tournament.phase !== "setup") return prev
    const trimmed = name.trim()
    if (!trimmed) return prev
    if (prev.teams.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) return prev

    const code = generateTeamCode(new Set(prev.teams.map((t) => t.code)))
    created = {
      id: `T-${code.slice(3)}`,
      code,
      password: generatePassword(8),
      name: trimmed,
      players: players
        .map((p) => ({ name: p.name.trim(), phone: p.phone.trim() }))
        .filter((p) => p.name),
      status: "active",
      eliminatedInRound: null,
      registeredAt: new Date().toISOString(),
    }
    return { ...prev, teams: [...prev.teams, created] }
  })
  return created
}

export function removeTeam(id: string) {
  commit((prev) => {
    // Removing a team after the draw would invalidate the bracket.
    if (prev.tournament?.phase !== "setup") return prev
    return { ...prev, teams: prev.teams.filter((t) => t.id !== id) }
  })
}

export function regeneratePassword(id: string): string {
  const next = generatePassword(8)
  commit((prev) => ({
    ...prev,
    teams: prev.teams.map((t) => (t.id === id ? { ...t, password: next } : t)),
  }))
  return next
}

export function drawFirstRound() {
  commit((prev) => {
    if (!prev.tournament || prev.tournament.phase !== "setup") return prev
    if (prev.teams.length < 2) return prev

    return {
      ...prev,
      tournament: {
        ...prev.tournament,
        phase: "running",
        rounds: buildRounds(prev.teams.length),
        currentRound: 0,
      },
      matches: pairTeams(shuffle(prev.teams.map((t) => t.id)), 0, "M"),
    }
  })
}

export function scheduleMatch(id: string, patch: { table?: string; startsAt?: string }) {
  commit((prev) => {
    const match = prev.matches.find((m) => m.id === id)
    if (!match || match.status === "bye") return prev

    const next = { ...match, ...patch }
    const ready = next.table !== "" && next.startsAt !== ""
    const isPublished = Boolean(prev.tournament?.rounds[match.roundIndex]?.published)

    // Once a round is published, teams have been told where and when to be.
    // Emptying a field would leave them looking at a fixture with no table,
    // so a published match can be changed but not un-set.
    if (isPublished && !ready) return prev

    const changed =
      next.table !== match.table || next.startsAt !== match.startsAt
    if (!changed) return prev

    const notices: TeamNotice[] =
      isPublished && match.status !== "completed"
        ? [match.teamAId, match.teamBId]
            .filter((t): t is string => Boolean(t))
            .map((teamId) =>
              notice(
                teamId,
                "Your fixture changed",
                `Updated details: table ${next.table}. Check My Matches for the new kickoff time.`,
                "warning",
              ),
            )
        : []

    return {
      ...prev,
      matches: prev.matches.map((m) =>
        m.id !== id
          ? m
          : {
              ...next,
              status:
                m.status === "live" || m.status === "completed"
                  ? m.status
                  : ready
                    ? "scheduled"
                    : "unscheduled",
            },
      ),
      notices: [...notices, ...prev.notices],
    }
  })
}

export function publishRound(roundIndex: number) {
  commit((prev) => {
    if (!prev.tournament) return prev
    const round = prev.tournament.rounds[roundIndex]
    if (!round || round.published) return prev

    const notices: TeamNotice[] = []
    for (const m of prev.matches.filter((x) => x.roundIndex === roundIndex)) {
      for (const teamId of [m.teamAId, m.teamBId]) {
        if (!teamId) continue
        notices.push(
          m.status === "bye"
            ? notice(
                teamId,
                `${round.name} — you have a bye`,
                "An odd number of teams reached this round, so you advance without playing.",
                "success",
              )
            : notice(
                teamId,
                `${round.name} fixture published`,
                "Your match is set. Check My Matches for the table and kickoff time.",
                "info",
              ),
        )
      }
    }

    return {
      ...prev,
      tournament: {
        ...prev.tournament,
        rounds: prev.tournament.rounds.map((r) =>
          r.index === roundIndex
            ? { ...r, published: true, publishedAt: new Date().toISOString() }
            : r,
        ),
      },
      notices: [...notices, ...prev.notices],
    }
  })
}

export function startMatch(id: string) {
  commit((prev) => ({
    ...prev,
    matches: prev.matches.map((m) =>
      m.id === id && m.status === "scheduled"
        ? { ...m, status: "live", startedAt: new Date().toISOString() }
        : m,
    ),
  }))
}

export function recordWinner(matchId: string, winnerId: string) {
  commit((prev) => {
    const match = prev.matches.find((m) => m.id === matchId)
    if (!match || match.status === "bye") return prev
    const loserId = match.teamAId === winnerId ? match.teamBId : match.teamAId

    return {
      ...prev,
      matches: prev.matches.map((m) =>
        m.id === matchId
          ? { ...m, status: "completed", winnerId, completedAt: new Date().toISOString() }
          : m,
      ),
      teams: prev.teams.map((t) =>
        t.id === loserId
          ? { ...t, status: "eliminated", eliminatedInRound: match.roundIndex }
          : t,
      ),
      notices: loserId
        ? [
            notice(
              loserId,
              "Match result recorded",
              "Your run ends here. Thanks for playing — the full bracket stays available.",
              "warning",
            ),
            notice(
              winnerId,
              "You won — through to the next round",
              "Your next fixture appears once the organiser publishes the round.",
              "success",
            ),
            ...prev.notices,
          ]
        : prev.notices,
    }
  })
}

export function advanceRound() {
  commit((prev) => {
    if (!prev.tournament) return prev
    const current = prev.tournament.currentRound
    if (!isRoundComplete(prev.matches, current)) return prev

    const winners = winnersOf(prev.matches, current)

    if (winners.length === 1) {
      const championId = winners[0]
      return {
        ...prev,
        tournament: { ...prev.tournament, phase: "complete", championId },
        teams: prev.teams.map((t) =>
          t.id === championId ? { ...t, status: "champion" } : t,
        ),
        notices: [
          notice(championId, "Champions!", "You have won the tournament. Congratulations.", "success"),
          ...prev.notices,
        ],
      }
    }

    const nextIndex = current + 1
    const alreadyDrawn = prev.matches.some((m) => m.roundIndex === nextIndex)
    return {
      ...prev,
      tournament: { ...prev.tournament, currentRound: nextIndex },
      matches: alreadyDrawn
        ? prev.matches
        : [...prev.matches, ...pairTeams(winners, nextIndex, "M")],
    }
  })
}

export function signInTeam(code: string, password: string): Team | null {
  const wanted = code.trim().toUpperCase()
  const team = getSnapshot().teams.find(
    (t) => t.code.toUpperCase() === wanted && t.password === password,
  )
  if (!team) return null
  commit((prev) => ({ ...prev, signedInTeamId: team.id }))
  return team
}

export function signOutTeam() {
  commit((prev) => ({ ...prev, signedInTeamId: null }))
}

export function signInAdmin() {
  commit((prev) => ({ ...prev, adminSignedIn: true }))
}

export function signOutAdmin() {
  commit((prev) => ({ ...prev, adminSignedIn: false }))
}

/** Called when a captain opens their notifications list. */
export function markNoticesRead(teamId: string) {
  commit((prev) => {
    if (!prev.notices.some((n) => !n.read && (n.teamId === null || n.teamId === teamId))) {
      return prev
    }
    return {
      ...prev,
      notices: prev.notices.map((n) =>
        n.teamId === null || n.teamId === teamId ? { ...n, read: true } : n,
      ),
    }
  })
}

/* ── Hooks ───────────────────────────────────────────────── */

const ACTIONS = {
  createTournament,
  resetEverything,
  addTeam,
  removeTeam,
  regeneratePassword,
  drawFirstRound,
  scheduleMatch,
  publishRound,
  startMatch,
  recordWinner,
  advanceRound,
  signInTeam,
  signOutTeam,
  signInAdmin,
  signOutAdmin,
  markNoticesRead,
} as const

/** True only after the client snapshot has replaced the server one. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}

export function useTournament() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const ready = useHydrated()
  return { ...snapshot, ready, ...ACTIONS }
}

export function useSignedInTeam(): Team | null {
  const { teams, signedInTeamId } = useTournament()
  return teams.find((t) => t.id === signedInTeamId) ?? null
}

export function usePublishedMatches(): Match[] {
  const { tournament, matches } = useTournament()
  if (!tournament) return []
  const open = new Set(tournament.rounds.filter((r) => r.published).map((r) => r.index))
  return matches.filter((m) => open.has(m.roundIndex))
}

/**
 * Kept so the root layout does not need to change if this later becomes a
 * context-backed store again (for example once an API client needs config).
 */
export function TournamentProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
