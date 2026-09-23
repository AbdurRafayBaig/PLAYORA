"use client"

import { useSyncExternalStore, type ReactNode } from "react"
import {
  generatePassword,
  generateTeamCode,
  isRoundComplete,
  pairTeams,
  shuffle,
  undoBlockedReason,
  roundLabel,
  unpairedIn,
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

/**
 * Register a team.
 *
 * Allowed while the tournament is running, not only during setup. Late
 * entrants turn up — someone arrives after the draw, or a round comes out
 * odd and the organiser would rather add a team than hand out a bye. A team
 * added mid-tournament joins the current round unpaired, and the organiser
 * decides who it plays.
 */
export function addTeam({ name, players }: { name: string; players: Player[] }): Team | null {
  let created: Team | null = null
  commit((prev) => {
    if (!prev.tournament || prev.tournament.phase === "complete") return prev
    const trimmed = name.trim()
    if (!trimmed) return prev
    if (prev.teams.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) return prev

    const running = prev.tournament.phase === "running"
    const joinRound = running ? prev.tournament.currentRound : 0

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
      joinedInRound: joinRound,
      registeredAt: new Date().toISOString(),
    }

    return {
      ...prev,
      teams: [...prev.teams, created],
      tournament: running
        ? {
            ...prev.tournament,
            rounds: prev.tournament.rounds.map((r) =>
              r.index === joinRound
                ? { ...r, entrants: [...r.entrants, created!.id] }
                : r,
            ),
          }
        : prev.tournament,
    }
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
    // The captain is the one who has to act on this, so tell them rather
    // than leaving them to discover it at the next sign-in.
    notices: [
      notice(
        id,
        "Your password was changed",
        "The organiser issued you a new password. Ask at the desk for it — your old one no longer works.",
        "warning",
      ),
      ...prev.notices,
    ],
  }))
  return next
}

/**
 * Draw the opening round.
 *
 * `random` shuffles the field. `seeded` keeps registration order as the
 * seeding and pairs strongest against weakest, so the two teams the
 * organiser rates highest cannot meet in round one — and the bye, if the
 * field is odd, goes to the top seed rather than to whoever the shuffle
 * happened to leave over.
 */
export function drawFirstRound(mode: "random" | "seeded" = "random") {
  commit((prev) => {
    if (!prev.tournament || prev.tournament.phase !== "setup") return prev
    if (prev.teams.length < 2) return prev

    const ids = prev.teams.map((t) => t.id)
    const order = mode === "seeded" ? ids : shuffle(ids)

    return {
      ...prev,
      tournament: {
        ...prev.tournament,
        phase: "running",
        // Only the opening round is created here. The rest are drawn as the
        // previous one finishes, so a late entrant changes the path from
        // that point instead of invalidating a precomputed bracket.
        rounds: [{ index: 0, entrants: ids, published: false, publishedAt: null }],
        currentRound: 0,
        drawMode: mode,
      },
      matches: pairTeams(order, 0, "M", mode === "seeded" ? "seeded" : "sequential"),
    }
  })
}

/* ── Manual control over the current round ───────────────────
   Automatic pairing is a starting point, not a rule. The organiser can take
   a match apart, pair any two waiting teams, and choose who sits out.
   ───────────────────────────────────────────────────────────── */

/** Break a match back into two waiting teams. */
export function unpairMatch(matchId: string) {
  commit((prev) => {
    const match = prev.matches.find((m) => m.id === matchId)
    if (!match) return prev
    // Unpairing something already played would erase a result silently.
    if (match.status === "live" || match.status === "completed") return prev
    return { ...prev, matches: prev.matches.filter((m) => m.id !== matchId) }
  })
}

/** Pair two waiting teams in the current round. */
export function createMatch(teamAId: string, teamBId: string) {
  commit((prev) => {
    if (!prev.tournament || teamAId === teamBId) return prev
    const roundIndex = prev.tournament.currentRound
    const round = prev.tournament.rounds[roundIndex]
    if (!round) return prev

    const waiting = new Set(unpairedIn(round, prev.matches))
    if (!waiting.has(teamAId) || !waiting.has(teamBId)) return prev

    return {
      ...prev,
      matches: [
        ...prev.matches,
        {
          id: `M-R${roundIndex + 1}-X${Date.now().toString(36).slice(-4)}`,
          roundIndex,
          teamAId,
          teamBId,
          table: "",
          startsAt: "",
          status: "unscheduled" as const,
          winnerId: null,
          startedAt: null,
          completedAt: null,
        },
      ],
    }
  })
}

/**
 * Give the bye to a specific team.
 *
 * Passing `null` removes the bye, putting that team back in the pool to be
 * paired. Only one bye can exist in a round.
 */
export function setBye(teamId: string | null) {
  commit((prev) => {
    if (!prev.tournament) return prev
    const roundIndex = prev.tournament.currentRound
    const round = prev.tournament.rounds[roundIndex]
    if (!round) return prev

    const withoutBye = prev.matches.filter(
      (m) => !(m.roundIndex === roundIndex && m.status === "bye"),
    )
    if (teamId === null) return { ...prev, matches: withoutBye }

    const waiting = new Set(unpairedIn({ ...round }, withoutBye))
    if (!waiting.has(teamId)) return prev

    return {
      ...prev,
      matches: [
        ...withoutBye,
        {
          id: `M-R${roundIndex + 1}-BYE`,
          roundIndex,
          teamAId: teamId,
          teamBId: null,
          table: "—",
          startsAt: "",
          status: "bye" as const,
          winnerId: teamId,
          startedAt: null,
          completedAt: new Date().toISOString(),
        },
      ],
    }
  })
}

/** Throw the current round's pairings away and draw them again. */
export function redrawCurrentRound(mode: "random" | "seeded" = "random") {
  commit((prev) => {
    if (!prev.tournament) return prev
    const roundIndex = prev.tournament.currentRound
    const round = prev.tournament.rounds[roundIndex]
    if (!round) return prev

    // Refuse once anything in the round has been played, or the result
    // would vanish along with the pairing.
    const started = prev.matches.some(
      (m) =>
        m.roundIndex === roundIndex &&
        (m.status === "live" || m.status === "completed"),
    )
    if (started) return prev

    const order = mode === "seeded" ? round.entrants : shuffle(round.entrants)
    return {
      ...prev,
      matches: [
        ...prev.matches.filter((m) => m.roundIndex !== roundIndex),
        ...pairTeams(order, roundIndex, "M", mode === "seeded" ? "seeded" : "sequential"),
      ],
      tournament: {
        ...prev.tournament,
        rounds: prev.tournament.rounds.map((r) =>
          r.index === roundIndex ? { ...r, published: false, publishedAt: null } : r,
        ),
      },
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
                `${roundLabel(round)} — you have a bye`,
                "An odd number of teams reached this round, so you advance without playing.",
                "success",
              )
            : notice(
                teamId,
                `${roundLabel(round)} fixture published`,
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

/**
 * Take back a recorded result.
 *
 * Refereeing mistakes happen, and without this the only remedy was wiping
 * the whole tournament. Refused once the next round exists, because the
 * loser's place in the bracket has already been handed to someone else —
 * `revertLastAdvance` is the escape hatch for that.
 */
export function undoResult(matchId: string) {
  commit((prev) => {
    if (undoBlockedReason(prev.matches, matchId) !== null) return prev
    const match = prev.matches.find((m) => m.id === matchId)
    if (!match || !match.winnerId) return prev

    const loserId = match.teamAId === match.winnerId ? match.teamBId : match.teamAId
    const ready = match.table !== "" && match.startsAt !== ""

    return {
      ...prev,
      matches: prev.matches.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: ready ? "scheduled" : "unscheduled",
              winnerId: null,
              startedAt: null,
              completedAt: null,
            }
          : m,
      ),
      teams: prev.teams.map((t) =>
        t.id === loserId ? { ...t, status: "active", eliminatedInRound: null } : t,
      ),
      notices: loserId
        ? [
            notice(
              loserId,
              "A result was corrected",
              "The organiser took back the result of your match. You are back in the draw while it is replayed or re-entered.",
              "warning",
            ),
            ...prev.notices,
          ]
        : prev.notices,
    }
  })
}

/**
 * Step the tournament back one round.
 *
 * Deletes the round that was just drawn and returns to the previous one,
 * so a result recorded in error can be corrected even after advancing. Also
 * un-crowns a champion.
 */
export function revertLastAdvance() {
  commit((prev) => {
    if (!prev.tournament) return prev
    const t = prev.tournament

    if (t.phase === "complete" && t.championId) {
      return {
        ...prev,
        tournament: { ...t, phase: "running", championId: null },
        teams: prev.teams.map((x) =>
          x.id === t.championId ? { ...x, status: "active" } : x,
        ),
      }
    }

    if (t.currentRound === 0) return prev
    const dropped = t.currentRound

    return {
      ...prev,
      matches: prev.matches.filter((m) => m.roundIndex < dropped),
      tournament: {
        ...t,
        currentRound: dropped - 1,
        rounds: t.rounds.filter((r) => r.index < dropped),
      },
      // Teams knocked out in the round we are dropping are back in.
      teams: prev.teams.map((x) =>
        x.eliminatedInRound === dropped - 1
          ? { ...x, status: "active", eliminatedInRound: null }
          : x,
      ),
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
    const existing = prev.tournament.rounds.find((r) => r.index === nextIndex)

    return {
      ...prev,
      tournament: {
        ...prev.tournament,
        currentRound: nextIndex,
        rounds: existing
          ? prev.tournament.rounds
          : [
              ...prev.tournament.rounds,
              { index: nextIndex, entrants: winners, published: false, publishedAt: null },
            ],
      },
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
  undoResult,
  revertLastAdvance,
  advanceRound,
  unpairMatch,
  createMatch,
  setBye,
  redrawCurrentRound,
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
