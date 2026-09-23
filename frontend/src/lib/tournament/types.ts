/* ═══════════════════════════════════════════════
   PLAYORA — Tournament domain
   ───────────────────────────────────────────────
   A single-elimination knockout. There is no points table: a league table
   is meaningless here because every team plays until it loses exactly once,
   so 3-points-per-win would leave whole rounds tied on identical totals.
   What matters is how deep a team got, which is what `Round` encodes.
   ═══════════════════════════════════════════════ */

export type Phase = 'setup' | 'running' | 'complete'

export type MatchStatus = 'unscheduled' | 'scheduled' | 'live' | 'completed' | 'bye'

export type TeamStatus = 'active' | 'eliminated' | 'champion'

export interface Player {
  name: string
  phone: string
}

export interface Team {
  id: string
  /** Login identifier handed to the captain at registration. */
  code: string
  /**
   * Login password, generated once when the admin adds the team.
   *
   * This is a demo-only credential held in the browser. It is not a
   * substitute for real authentication — see the note in `store.tsx`.
   */
  password: string
  name: string
  players: Player[]
  status: TeamStatus
  /** Index of the round in which the team lost. */
  eliminatedInRound: number | null
  /** Round the team entered at. 0 for everyone registered before the draw. */
  joinedInRound: number
  registeredAt: string
}

export interface Match {
  id: string
  roundIndex: number
  teamAId: string
  /** null for a bye — an odd round leaves one team without an opponent. */
  teamBId: string | null
  table: string
  /** ISO timestamp, or '' while unscheduled. */
  startsAt: string
  status: MatchStatus
  winnerId: string | null
  /** Set when the admin taps Start, so the UI can show elapsed time. */
  startedAt: string | null
  completedAt: string | null
}

export interface Round {
  index: number
  /**
   * The teams competing in this round.
   *
   * The source of truth, rather than a precomputed size. The organiser can
   * add a late entrant mid-tournament, unpair a match and repair it
   * differently, or hand the bye to a particular team — so the field for a
   * round is not knowable when the tournament is drawn. Any team in here
   * without a match is "unpaired" and waiting to be given one.
   */
  entrants: string[]
  /** Fixtures stay hidden from teams until the admin publishes the round. */
  published: boolean
  publishedAt: string | null
}

export interface Tournament {
  name: string
  venue: string
  phase: Phase
  createdAt: string
  rounds: Round[]
  currentRound: number
  championId: string | null
  /** How the opening round was drawn; shown on the bracket for transparency. */
  drawMode?: 'random' | 'seeded'
}

export interface TeamNotice {
  id: string
  teamId: string | null
  title: string
  body: string
  at: string
  tone: 'info' | 'success' | 'warning'
  read: boolean
}

export interface TournamentState {
  tournament: Tournament | null
  teams: Team[]
  matches: Match[]
  notices: TeamNotice[]
  /** Team id of the captain currently signed into the team portal. */
  signedInTeamId: string | null
  /**
   * Whether the organiser has signed in.
   *
   * A client-side flag gating a client-side console — it keeps the panel
   * from being reachable by typing the URL, which is what it is for. It is
   * not a security boundary; that arrives with the Django session.
   */
  adminSignedIn: boolean
}
