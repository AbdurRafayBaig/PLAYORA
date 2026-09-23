/* ═══════════════════════════════════════════════
   PLAYORA — Demo Tournament Dataset
   ───────────────────────────────────────────────
   One source of truth for the whole app while the Django API is being
   built. Every page reads from here, so the numbers on the landing page,
   the standings table, the admin console and the team portal agree with
   each other instead of each inventing their own teams.

   Swapping this for the real API is a matter of replacing the exported
   selectors below with fetches — the page components never touch the
   arrays directly.
   ═══════════════════════════════════════════════ */

import type {
  Announcement,
  AuditEntry,
  Dispute,
  Match,
  Notification,
  Player,
  PortalUser,
  Team,
  Venue,
} from './types'

export const TOURNAMENT = {
  name: 'Ludo Championship 2026',
  organiser: 'Sports Society',
  season: '2026',
  stage: 'Quarter Finals',
  status: 'active' as const,
  format: 'Single elimination · 2 players per team',
  startedOn: '2026-02-14',
}

/* ── Teams ─────────────────────────────────────────────────── */
export const TEAMS: Team[] = [
  { id: 'T001', code: 'T001', name: 'Thunder Hawks',  initials: 'TH', captain: 'Ali Khan',       status: 'qualified',  played: 4, wins: 4, losses: 0, points: 12, trend: 'same', form: ['W', 'W', 'W', 'W'], registeredOn: '2026-02-01' },
  { id: 'T002', code: 'T002', name: 'Phoenix Squad',  initials: 'PS', captain: 'Sara Iqbal',     status: 'qualified',  played: 4, wins: 3, losses: 1, points: 9,  trend: 'up',   form: ['W', 'W', 'L', 'W'], registeredOn: '2026-02-01' },
  { id: 'T003', code: 'T003', name: 'Silver Wolves',  initials: 'SW', captain: 'Hamza Raza',     status: 'qualified',  played: 4, wins: 3, losses: 1, points: 9,  trend: 'down', form: ['L', 'W', 'W', 'W'], registeredOn: '2026-02-02' },
  { id: 'T004', code: 'T004', name: 'Royal Knights',  initials: 'RK', captain: 'Bilal Ahmed',    status: 'qualified',  played: 4, wins: 2, losses: 2, points: 6,  trend: 'up',   form: ['W', 'L', 'W', 'L'], registeredOn: '2026-02-02' },
  { id: 'T005', code: 'T005', name: 'Golden Eagles',  initials: 'GE', captain: 'Zainab Malik',   status: 'active',     played: 4, wins: 2, losses: 2, points: 6,  trend: 'down', form: ['L', 'W', 'L', 'W'], registeredOn: '2026-02-03' },
  { id: 'T006', code: 'T006', name: 'Iron Titans',    initials: 'IT', captain: 'Faisal Nadeem',  status: 'active',     played: 4, wins: 2, losses: 2, points: 6,  trend: 'same', form: ['W', 'L', 'L', 'W'], registeredOn: '2026-02-03' },
  { id: 'T007', code: 'T007', name: 'Blue Dragons',   initials: 'BD', captain: 'Ayesha Noor',    status: 'eliminated', played: 4, wins: 1, losses: 3, points: 3,  trend: 'down', form: ['L', 'L', 'W', 'L'], registeredOn: '2026-02-04' },
  { id: 'T008', code: 'T008', name: 'Storm Riders',   initials: 'SR', captain: 'Umar Sheikh',    status: 'eliminated', played: 4, wins: 1, losses: 3, points: 3,  trend: 'down', form: ['L', 'W', 'L', 'L'], registeredOn: '2026-02-04' },
]

/* ── Players ───────────────────────────────────────────────── */
export const PLAYERS: Player[] = [
  { id: 'P01', name: 'Ali Khan',      teamId: 'T001', role: 'Captain', email: 'ali.khan@example.com',     phone: '+92 300 1234567', matchesPlayed: 4 },
  { id: 'P02', name: 'Usman Ahmed',   teamId: 'T001', role: 'Member',  email: 'usman.ahmed@example.com',  phone: '+92 311 1234567', matchesPlayed: 4 },
  { id: 'P03', name: 'Sara Iqbal',    teamId: 'T002', role: 'Captain', email: 'sara.iqbal@example.com',   phone: '+92 321 2345678', matchesPlayed: 4 },
  { id: 'P04', name: 'Nida Hussain',  teamId: 'T002', role: 'Member',  email: 'nida.h@example.com',       phone: '+92 333 2345678', matchesPlayed: 3 },
  { id: 'P05', name: 'Hamza Raza',    teamId: 'T003', role: 'Captain', email: 'hamza.raza@example.com',   phone: '+92 301 3456789', matchesPlayed: 4 },
  { id: 'P06', name: 'Daniyal Shah',  teamId: 'T003', role: 'Member',  email: 'daniyal.s@example.com',    phone: '+92 345 3456789', matchesPlayed: 4 },
  { id: 'P07', name: 'Bilal Ahmed',   teamId: 'T004', role: 'Captain', email: 'bilal.a@example.com',      phone: '+92 302 4567890', matchesPlayed: 4 },
  { id: 'P08', name: 'Taha Siddiqui', teamId: 'T004', role: 'Member',  email: 'taha.s@example.com',       phone: '+92 346 4567890', matchesPlayed: 4 },
  { id: 'P09', name: 'Zainab Malik',  teamId: 'T005', role: 'Captain', email: 'zainab.m@example.com',     phone: '+92 303 5678901', matchesPlayed: 4 },
  { id: 'P10', name: 'Hira Aslam',    teamId: 'T005', role: 'Member',  email: 'hira.a@example.com',       phone: '+92 347 5678901', matchesPlayed: 4 },
  { id: 'P11', name: 'Faisal Nadeem', teamId: 'T006', role: 'Captain', email: 'faisal.n@example.com',     phone: '+92 304 6789012', matchesPlayed: 4 },
  { id: 'P12', name: 'Rehan Javed',   teamId: 'T006', role: 'Member',  email: 'rehan.j@example.com',      phone: '+92 348 6789012', matchesPlayed: 4 },
  { id: 'P13', name: 'Ayesha Noor',   teamId: 'T007', role: 'Captain', email: 'ayesha.n@example.com',     phone: '+92 305 7890123', matchesPlayed: 4 },
  { id: 'P14', name: 'Kamran Butt',   teamId: 'T007', role: 'Member',  email: 'kamran.b@example.com',     phone: '+92 349 7890123', matchesPlayed: 4 },
  { id: 'P15', name: 'Umar Sheikh',   teamId: 'T008', role: 'Captain', email: 'umar.s@example.com',       phone: '+92 306 8901234', matchesPlayed: 4 },
  { id: 'P16', name: 'Areeba Tariq',  teamId: 'T008', role: 'Member',  email: 'areeba.t@example.com',     phone: '+92 350 8901234', matchesPlayed: 4 },
]

/* ── Matches ───────────────────────────────────────────────── */
export const MATCHES: Match[] = [
  /* Quarter Finals — in progress */
  { id: 'QF-1', round: 'Quarter Final', roundShort: 'QF-1', teamA: 'Thunder Hawks', teamB: 'Storm Riders',  scoreA: 2, scoreB: 1, status: 'live',      venue: 'Main Hall', table: 'T1', time: '2:30 PM',  day: 'Today' },
  { id: 'QF-2', round: 'Quarter Final', roundShort: 'QF-2', teamA: 'Phoenix Squad', teamB: 'Royal Knights', scoreA: 1, scoreB: 1, status: 'live',      venue: 'Main Hall', table: 'T2', time: '2:30 PM',  day: 'Today' },
  { id: 'QF-3', round: 'Quarter Final', roundShort: 'QF-3', teamA: 'Silver Wolves', teamB: 'Golden Eagles', status: 'checkin',   venue: 'Room 201',  table: 'T3', time: '3:30 PM',  day: 'Today' },
  { id: 'QF-4', round: 'Quarter Final', roundShort: 'QF-4', teamA: 'Iron Titans',   teamB: 'Blue Dragons',  status: 'scheduled', venue: 'Room 201',  table: 'T4', time: '4:00 PM',  day: 'Today' },

  /* Round 2 — done */
  { id: 'R2-1', round: 'Round 2', roundShort: 'R2-1', teamA: 'Thunder Hawks', teamB: 'Golden Eagles', scoreA: 3, scoreB: 1, status: 'completed', winner: 'A', venue: 'Main Hall', table: 'T1', time: '1:00 PM',  day: 'Today' },
  { id: 'R2-2', round: 'Round 2', roundShort: 'R2-2', teamA: 'Phoenix Squad', teamB: 'Blue Dragons',  scoreA: 3, scoreB: 2, status: 'completed', winner: 'A', venue: 'Main Hall', table: 'T2', time: '1:00 PM',  day: 'Today' },
  { id: 'R2-3', round: 'Round 2', roundShort: 'R2-3', teamA: 'Silver Wolves', teamB: 'Storm Riders',  scoreA: 3, scoreB: 0, status: 'completed', winner: 'A', venue: 'Room 201', table: 'T3', time: '11:00 AM', day: 'Today' },
  { id: 'R2-4', round: 'Round 2', roundShort: 'R2-4', teamA: 'Iron Titans',   teamB: 'Royal Knights', scoreA: 1, scoreB: 3, status: 'completed', winner: 'B', venue: 'Room 201', table: 'T4', time: '11:00 AM', day: 'Today' },

  /* Round 1 — done */
  { id: 'R1-1', round: 'Round 1', roundShort: 'R1-1', teamA: 'Thunder Hawks', teamB: 'Blue Dragons',  scoreA: 3, scoreB: 1, status: 'completed', winner: 'A', venue: 'Main Hall', table: 'T1', time: '2:00 PM',  day: 'Yesterday' },
  { id: 'R1-2', round: 'Round 1', roundShort: 'R1-2', teamA: 'Golden Eagles', teamB: 'Phoenix Squad', scoreA: 1, scoreB: 3, status: 'completed', winner: 'B', venue: 'Main Hall', table: 'T2', time: '2:00 PM',  day: 'Yesterday' },
  { id: 'R1-3', round: 'Round 1', roundShort: 'R1-3', teamA: 'Silver Wolves', teamB: 'Iron Titans',   scoreA: 3, scoreB: 2, status: 'completed', winner: 'A', venue: 'Room 201', table: 'T3', time: '12:00 PM', day: 'Yesterday' },
  { id: 'R1-4', round: 'Round 1', roundShort: 'R1-4', teamA: 'Royal Knights', teamB: 'Storm Riders',  scoreA: 3, scoreB: 1, status: 'completed', winner: 'A', venue: 'Room 201', table: 'T4', time: '12:00 PM', day: 'Yesterday' },

  /* Semi Finals — pending the QF results */
  { id: 'SF-1', round: 'Semi Final', roundShort: 'SF-1', teamA: 'Thunder Hawks', teamB: 'Silver Wolves', status: 'scheduled', venue: 'Main Hall', table: 'T1', time: '3:00 PM', day: 'Tomorrow' },
  { id: 'SF-2', round: 'Semi Final', roundShort: 'SF-2', teamA: 'Phoenix Squad', teamB: 'Royal Knights', status: 'scheduled', venue: 'Main Hall', table: 'T2', time: '3:00 PM', day: 'Tomorrow' },
]

/* ── Venues ────────────────────────────────────────────────── */
export const VENUES: Venue[] = [
  { id: 'V1', name: 'Main Hall',    location: 'Academic Block A, Ground Floor', tables: 4, tablesInUse: 2, status: 'open' },
  { id: 'V2', name: 'Room 201',     location: 'Academic Block B, 2nd Floor',    tables: 4, tablesInUse: 0, status: 'open' },
  { id: 'V3', name: 'Sports Annex', location: 'Behind the Gymnasium',           tables: 2, tablesInUse: 0, status: 'closed' },
]

/* ── Announcements ─────────────────────────────────────────── */
export const ANNOUNCEMENTS: Announcement[] = [
  { id: 'A1', title: 'Semi-Final fixtures published',      body: 'Semi-Final pairings are now live on the fixtures page. Both matches start at 3:00 PM tomorrow in the Main Hall.',        audience: 'All teams', sentAt: '10 minutes ago', pinned: true },
  { id: 'A2', title: 'Check-in window shortened to 10 min', body: 'From the Quarter Finals onward, teams must check in 10 minutes before kickoff. Late teams forfeit by walkover.',         audience: 'All teams', sentAt: '2 hours ago',   pinned: true },
  { id: 'A3', title: 'Room 201 tables recalibrated',        body: 'Tables T3 and T4 were re-levelled during the lunch break. Report any issues to the floor referee before starting.',      audience: 'Referees',  sentAt: 'Yesterday',     pinned: false },
  { id: 'A4', title: 'Round 2 results locked',             body: 'All Round 2 results have been verified and locked. The dispute window for those matches is now closed.',                  audience: 'All teams', sentAt: 'Yesterday',     pinned: false },
]

/* ── Disputes ──────────────────────────────────────────────── */
export const DISPUTES: Dispute[] = [
  { id: 'D-104', matchId: 'R2-4', raisedBy: 'Iron Titans',   reason: 'Final token count contested — scorer recorded 1-3, team claims 2-3.', status: 'reviewing', raisedAt: '35 minutes ago' },
  { id: 'D-103', matchId: 'R2-2', raisedBy: 'Blue Dragons',  reason: 'Opponent restarted a turn after the dice was already cast.',           status: 'open',      raisedAt: '1 hour ago' },
  { id: 'D-102', matchId: 'R1-3', raisedBy: 'Iron Titans',   reason: 'Match started 12 minutes late; requested time adjustment.',            status: 'resolved',  raisedAt: 'Yesterday' },
  { id: 'D-101', matchId: 'R1-4', raisedBy: 'Storm Riders',  reason: 'Requested a referee change for the following round.',                  status: 'rejected',  raisedAt: 'Yesterday' },
]

/* ── Audit log ─────────────────────────────────────────────── */
export const AUDIT_LOG: AuditEntry[] = [
  { id: 'L-512', actor: 'Ludo Head',        action: 'Result submitted',  target: 'Match R2-4 — Royal Knights won 3-1', at: '2 minutes ago',  severity: 'info' },
  { id: 'L-511', actor: 'Tournament Admin', action: 'Teams imported',    target: '3 teams via CSV upload',             at: '15 minutes ago', severity: 'info' },
  { id: 'L-510', actor: 'Ludo Head',        action: 'Fixtures generated', target: 'Quarter Final round (4 matches)',   at: '1 hour ago',     severity: 'info' },
  { id: 'L-509', actor: 'Super Admin',      action: 'Override applied',  target: 'Match R1-3 result corrected 3-2',    at: '2 hours ago',    severity: 'warning' },
  { id: 'L-508', actor: 'Referee · Main',   action: 'Match paused',      target: 'Match QF-2 — table dispute',         at: '2 hours ago',    severity: 'warning' },
  { id: 'L-507', actor: 'Super Admin',      action: 'Role granted',      target: 'Referee access for Hamza Raza',      at: 'Yesterday',      severity: 'critical' },
  { id: 'L-506', actor: 'Tournament Admin', action: 'Venue closed',      target: 'Sports Annex marked unavailable',    at: 'Yesterday',      severity: 'info' },
]

/* ── Portal users ──────────────────────────────────────────── */
export const PORTAL_USERS: PortalUser[] = [
  { id: 'U1', name: 'Abdur Rafay Baig', email: 'admin@playora.app',    role: 'Super Admin',       lastActive: 'Active now',   active: true },
  { id: 'U2', name: 'Ludo Head',        email: 'head@playora.app',     role: 'Tournament Admin',  lastActive: '5 minutes ago', active: true },
  { id: 'U3', name: 'Hamza Raza',       email: 'referee1@playora.app', role: 'Referee',           lastActive: '20 minutes ago', active: true },
  { id: 'U4', name: 'Nida Hussain',     email: 'referee2@playora.app', role: 'Referee',           lastActive: 'Yesterday',     active: true },
  { id: 'U5', name: 'Ali Khan',         email: 'ali.khan@example.com', role: 'Team Captain',      lastActive: '1 hour ago',    active: true },
  { id: 'U6', name: 'Umar Sheikh',      email: 'umar.s@example.com',   role: 'Team Captain',      lastActive: '3 days ago',    active: false },
]

/* ── Team-portal notifications (signed in as Thunder Hawks) ─── */
export const NOTIFICATIONS: Notification[] = [
  { id: 'N1', title: 'Semi-Final scheduled',   body: 'You face Silver Wolves tomorrow at 3:00 PM — Main Hall, Table T1.',              at: '10 minutes ago', read: false, tone: 'info' },
  { id: 'N2', title: 'Quarter Final underway', body: 'Your match against Storm Riders is live. Current score: 2-1.',                    at: '25 minutes ago', read: false, tone: 'success' },
  { id: 'N3', title: 'Check-in reminder',      body: 'Check-in now closes 10 minutes before kickoff. Late arrivals forfeit the match.', at: '2 hours ago',    read: true,  tone: 'warning' },
  { id: 'N4', title: 'Round 2 result verified', body: 'Your 3-1 win over Golden Eagles has been verified and locked.',                  at: 'Yesterday',      read: true,  tone: 'success' },
]

/* The team whose portal is being previewed. */
export const SIGNED_IN_TEAM_ID = 'T001'

/* ═══════════════════════════════════════════════
   Selectors — the only thing pages should import
   ═══════════════════════════════════════════════ */

export const getTeam = (id: string) => TEAMS.find((t) => t.id === id)

export const getTeamByName = (name: string) => TEAMS.find((t) => t.name === name)

export const getSignedInTeam = () => getTeam(SIGNED_IN_TEAM_ID) ?? TEAMS[0]

export const getPlayersForTeam = (teamId: string) =>
  PLAYERS.filter((p) => p.teamId === teamId)

export const getLiveMatches = () => MATCHES.filter((m) => m.status === 'live')

export const getCompletedMatches = () =>
  MATCHES.filter((m) => m.status === 'completed')

export const getUpcomingMatches = () =>
  MATCHES.filter((m) => ['scheduled', 'checkin', 'ready'].includes(m.status))

export const getMatchesForTeam = (teamName: string) =>
  MATCHES.filter((m) => m.teamA === teamName || m.teamB === teamName)

/** Standings are always derived, never stored, so they cannot drift. */
export const getStandings = () =>
  [...TEAMS].sort(
    (a, b) => b.points - a.points || b.wins - a.wins || a.name.localeCompare(b.name),
  )

/** Round order for grouped fixture views — newest stage first. */
export const ROUND_ORDER = [
  'Semi Final',
  'Quarter Final',
  'Round 2',
  'Round 1',
] as const

export const getMatchesByRound = () =>
  ROUND_ORDER.map((round) => ({
    round,
    matches: MATCHES.filter((m) => m.round === round),
  })).filter((group) => group.matches.length > 0)

/** Headline numbers for the landing page and the admin dashboard. */
export const getTournamentStats = () => {
  const live = getLiveMatches().length
  const completed = getCompletedMatches().length
  const upcoming = getUpcomingMatches()
  return {
    teams: TEAMS.length,
    players: PLAYERS.length,
    matchesPlayed: completed,
    liveNow: live,
    upcoming: upcoming.length,
    matchesToday: MATCHES.filter((m) => m.day === 'Today').length,
    nextMatchIn: upcoming.length > 0 ? '15m' : '—',
  }
}
