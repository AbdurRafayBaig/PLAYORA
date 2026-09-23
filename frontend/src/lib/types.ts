/* ═══════════════════════════════════════════════
   PLAYORA — Domain Types
   Shared by the public hub, the admin console and the team portal so
   every surface agrees on what a match or a team actually is.
   ═══════════════════════════════════════════════ */

export type MatchStatus =
  | 'scheduled'
  | 'checkin'
  | 'ready'
  | 'live'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'postponed'
  | 'walkover'

export type TeamStatus =
  | 'active'
  | 'qualified'
  | 'eliminated'
  | 'disqualified'
  | 'bye'

export type TournamentStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived'

export type DisputeStatus = 'open' | 'reviewing' | 'resolved' | 'rejected'

export type Trend = 'up' | 'down' | 'same'

export interface Player {
  id: string
  name: string
  teamId: string
  role: 'Captain' | 'Member'
  email: string
  phone: string
  matchesPlayed: number
}

export interface Team {
  id: string
  code: string
  name: string
  initials: string
  captain: string
  status: TeamStatus
  played: number
  wins: number
  losses: number
  points: number
  trend: Trend
  /** Most recent first: 'W' | 'L' | 'B' (bye). */
  form: string[]
  registeredOn: string
}

export interface Match {
  id: string
  round: string
  roundShort: string
  teamA: string
  teamB: string
  scoreA?: number
  scoreB?: number
  status: MatchStatus
  winner?: 'A' | 'B' | null
  venue: string
  table: string
  /** Human-readable kickoff, already localised for the venue. */
  time: string
  day: 'Today' | 'Tomorrow' | 'Yesterday'
}

export interface Venue {
  id: string
  name: string
  location: string
  tables: number
  tablesInUse: number
  status: 'open' | 'closed'
}

export interface Announcement {
  id: string
  title: string
  body: string
  audience: 'All teams' | 'Admins' | 'Referees'
  sentAt: string
  pinned: boolean
}

export interface Dispute {
  id: string
  matchId: string
  raisedBy: string
  reason: string
  status: DisputeStatus
  raisedAt: string
}

export interface AuditEntry {
  id: string
  actor: string
  action: string
  target: string
  at: string
  severity: 'info' | 'warning' | 'critical'
}

export interface PortalUser {
  id: string
  name: string
  email: string
  role: 'Super Admin' | 'Tournament Admin' | 'Referee' | 'Team Captain'
  lastActive: string
  active: boolean
}

export interface Notification {
  id: string
  title: string
  body: string
  at: string
  read: boolean
  tone: 'info' | 'success' | 'warning'
}
