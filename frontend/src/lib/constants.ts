/* ═══════════════════════════════════════════════
   PLAYORA — Constants & Configuration
   ═══════════════════════════════════════════════ */

// ── Ludo Color Palette (mirrors the CSS tokens in globals.css) ──
export const COLORS = {
  red: { hex: '#E53935', light: '#FF6F60', dark: '#AB000D' },
  yellow: { hex: '#FBC02D', light: '#FFF263', dark: '#B37F00' },
  green: { hex: '#43A047', light: '#76D275', dark: '#00701A' },
  blue: { hex: '#1E88E5', light: '#6AB7FF', dark: '#005CB2' },
  ink: '#17202A',
  muted: '#4B5563',
  surface: '#F7F8FA',
  white: '#FFFFFF',
} as const

export type LudoColor = 'red' | 'yellow' | 'green' | 'blue' | 'muted'

// ── Match Status Configuration ──
export const MATCH_STATUS = {
  scheduled: { label: 'Scheduled', color: 'blue', icon: 'Calendar' },
  checkin: { label: 'Check-in', color: 'yellow', icon: 'UserCheck' },
  ready: { label: 'Ready', color: 'yellow', icon: 'CheckCircle' },
  live: { label: 'LIVE', color: 'red', icon: 'Radio' },
  paused: { label: 'Paused', color: 'yellow', icon: 'Pause' },
  completed: { label: 'Completed', color: 'green', icon: 'Trophy' },
  cancelled: { label: 'Cancelled', color: 'muted', icon: 'XCircle' },
  postponed: { label: 'Postponed', color: 'muted', icon: 'Clock' },
  walkover: { label: 'Walkover', color: 'yellow', icon: 'AlertTriangle' },
} as const

// ── Tournament Status ──
export const TOURNAMENT_STATUS = {
  draft: { label: 'Draft', color: 'muted' },
  active: { label: 'Active', color: 'green' },
  paused: { label: 'Paused', color: 'yellow' },
  completed: { label: 'Completed', color: 'blue' },
  archived: { label: 'Archived', color: 'muted' },
} as const

// ── Team Status ──
export const TEAM_STATUS = {
  active: { label: 'Active', color: 'green' },
  qualified: { label: 'Qualified', color: 'green' },
  eliminated: { label: 'Eliminated', color: 'red' },
  disqualified: { label: 'Disqualified', color: 'red' },
  bye: { label: 'Bye', color: 'yellow' },
} as const

// ── Navigation ──
export interface NavItem {
  label: string
  href: string
  /** Key into each shell's local lucide icon map. */
  icon: string
}

export interface NavGroup {
  group: string
  items: readonly NavItem[]
}

export const PUBLIC_NAV: readonly NavItem[] = [
  { label: 'Home', href: '/', icon: 'Home' },
  { label: 'Live', href: '/live', icon: 'Radio' },
  { label: 'Fixtures', href: '/fixtures', icon: 'Calendar' },
  { label: 'Standings', href: '/standings', icon: 'BarChart3' },
  { label: 'Results', href: '/results', icon: 'Trophy' },
  { label: 'About', href: '/about', icon: 'Users' },
  { label: 'Contact', href: '/contact', icon: 'MessageCircle' },
]

// ── Admin Sidebar Navigation ──
// Grouped so a 14-item sidebar reads as three short lists instead of one
// long scroll.
export const ADMIN_NAV_GROUPS: readonly NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
      { label: 'Tournaments', href: '/admin/tournaments', icon: 'Trophy' },
    ],
  },
  {
    group: 'Competition',
    items: [
      { label: 'Teams', href: '/admin/teams', icon: 'Users' },
      { label: 'Players', href: '/admin/players', icon: 'UserCircle' },
      { label: 'Fixtures', href: '/admin/fixtures', icon: 'Calendar' },
      { label: 'Live Matches', href: '/admin/live', icon: 'Radio' },
      { label: 'Standings', href: '/admin/standings', icon: 'BarChart3' },
      { label: 'Venues & Tables', href: '/admin/venues', icon: 'MapPin' },
    ],
  },
  {
    group: 'Operations',
    items: [
      { label: 'Disputes', href: '/admin/disputes', icon: 'AlertTriangle' },
      { label: 'Announcements', href: '/admin/announcements', icon: 'Megaphone' },
      { label: 'Reports', href: '/admin/reports', icon: 'FileText' },
      { label: 'Users & Roles', href: '/admin/users', icon: 'Shield' },
      { label: 'Audit Log', href: '/admin/audit', icon: 'ScrollText' },
      { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
    ],
  },
]

export const ADMIN_NAV: readonly NavItem[] = ADMIN_NAV_GROUPS.flatMap((g) => g.items)

// ── Team Portal Navigation ──
export const TEAM_NAV: readonly NavItem[] = [
  { label: 'Home', href: '/team', icon: 'Home' },
  { label: 'My Team', href: '/team/profile', icon: 'Users' },
  { label: 'My Matches', href: '/team/matches', icon: 'Swords' },
  { label: 'Results', href: '/team/results', icon: 'Trophy' },
  { label: 'Standing', href: '/team/standing', icon: 'BarChart3' },
  { label: 'Notifications', href: '/team/notifications', icon: 'Bell' },
  { label: 'Account', href: '/team/account', icon: 'Settings' },
]

// The five that fit a phone's bottom bar. Notifications and My Team live in
// the top bar and the home screen respectively.
export const TEAM_BOTTOM_NAV: readonly NavItem[] = [
  { label: 'Home', href: '/team', icon: 'Home' },
  { label: 'Matches', href: '/team/matches', icon: 'Swords' },
  { label: 'Results', href: '/team/results', icon: 'Trophy' },
  { label: 'Standing', href: '/team/standing', icon: 'BarChart3' },
  { label: 'Account', href: '/team/account', icon: 'Settings' },
]

// ── Team Members (About Us page) ──
export const TEAM_MEMBERS = [
  {
    name: 'Abdur Rafay Baig',
    role: 'Founder & Lead Architect',
    title: 'COO @ Tynovate',
    bio: 'Designed the full-stack architecture, intuitive UI/UX, database schema, and real-time tournament engine that powers PLAYORA. The driving force behind every technical decision.',
    photo: '/abdur-rafay.jpeg',
    linkedin: 'https://www.linkedin.com/in/irafaybaig/',
    skills: [
      'System Architecture',
      'UI/UX Design',
      'Next.js',
      'TypeScript',
      'Django',
      'PostgreSQL',
      'API Design',
      'WebSockets',
    ],
    isPrimary: true,
  },
  {
    name: 'Hassaan Ahmad',
    role: 'CEO & Founder',
    title: 'Tynovate',
    bio: 'Sets the product vision and leads partnerships with the Sports Society, shaping how PLAYORA is run on tournament day.',
    photo: '/placeholder-avatar.svg',
    linkedin: '',
    skills: ['Product Vision', 'Partnerships', 'Operations'],
    isPrimary: false,
  },
  {
    name: 'Zoraiz',
    role: 'Product & Operations Lead',
    title: 'Tynovate',
    bio: 'Runs tournament operations end to end — fixture planning, referee coordination, and the feedback loop that keeps the platform grounded in how matches actually run.',
    photo: '/placeholder-avatar.svg',
    linkedin: '',
    skills: ['Tournament Ops', 'Scheduling', 'QA'],
    isPrimary: false,
  },
] as const

// ── Contact details ──
export const CONTACT = {
  email: 'ludo@sportssociety.edu',
  whatsapp: '+92 300 000 0000',
  // E.164 without the +, for wa.me deep links.
  whatsappLink: '923000000000',
  venue: 'University Main Hall',
  hours: '10:00 AM – 6:00 PM',
} as const

// ── Brand ──
export const BRAND = {
  name: 'PLAYORA',
  tagline: 'Sports Tournament Management Portal',
  fullName: 'PLAYORA — Sports Tournament Management Portal',
  footer: 'Developed under Tynovate',
  repo: 'https://github.com/AbdurRafayBaig/PLAYORA',
} as const

/**
 * Current year, read at render time rather than at module load.
 *
 * On statically generated pages this still resolves at build time, but as a
 * function it also returns the right answer when a page is rendered
 * dynamically or on the client — which the old module-level constant could
 * not do, since it was baked in the moment the bundle was imported.
 */
export const currentYear = () => new Date().getFullYear()

// ── Deployment ──
// Set NEXT_PUBLIC_SITE_URL in the host's env (Vercel/Netlify) so canonical
// URLs, Open Graph images and the sitemap point at the real domain.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://playora.vercel.app'
