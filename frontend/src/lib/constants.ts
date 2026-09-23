/* ═══════════════════════════════════════════════
   PLAYORA — Constants & Configuration
   ═══════════════════════════════════════════════ */

// ── Ludo board palette (mirrors the CSS tokens in globals.css) ──
export const COLORS = {
  flame: '#FF5C23', // Atomic Orange
  mango: '#FFCE6B', // Melted Mango
  indigo: '#4B3FCF', // Indigo Flame
  orchid: '#E46CFF', // Electric Orchid
  lemon: '#F5FF67', // Lemon Glitch
  ice: '#C8F3FF', // Ice Cream Blue
  plum: '#2E0F35', // Deep Plum
  void: '#1C2459', // Blueberry Void
  vanilla: '#FFF4D6', // Vanilla
} as const

export type LudoColor = 'flame' | 'mango' | 'indigo' | 'orchid' | 'lemon' | 'muted'

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
  { label: 'Bracket', href: '/bracket', icon: 'GitBranch' },
  { label: 'Results', href: '/results', icon: 'Trophy' },
  { label: 'About', href: '/about', icon: 'Users' },
  { label: 'Contact', href: '/contact', icon: 'MessageCircle' },
]

/**
 * Admin navigation.
 *
 * Deliberately short. An earlier version listed fourteen sections, of which
 * eight were screens with no behaviour behind them — a menu that advertises
 * features the product does not have wastes the operator's time on
 * tournament day. Every entry here does something.
 */
export const ADMIN_NAV_GROUPS: readonly NavGroup[] = [
  {
    group: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' }],
  },
  {
    group: 'Run the tournament',
    items: [
      { label: 'Teams & Logins', href: '/admin/teams', icon: 'Users' },
      { label: 'Fixtures', href: '/admin/fixtures', icon: 'Calendar' },
      { label: 'Live Control', href: '/admin/live', icon: 'Radio' },
      { label: 'Bracket', href: '/admin/bracket', icon: 'GitBranch' },
    ],
  },
  {
    group: 'Setup',
    items: [{ label: 'Settings', href: '/admin/settings', icon: 'Settings' }],
  },
]

export const ADMIN_NAV: readonly NavItem[] = ADMIN_NAV_GROUPS.flatMap((g) => g.items)

// ── Team Portal Navigation ──
// Teams monitor; they do not edit. Every destination here is read-only.
export const TEAM_NAV: readonly NavItem[] = [
  { label: 'Home', href: '/team', icon: 'Home' },
  { label: 'My Team', href: '/team/profile', icon: 'Users' },
  { label: 'My Matches', href: '/team/matches', icon: 'Swords' },
  { label: 'Bracket', href: '/team/bracket', icon: 'GitBranch' },
  { label: 'Notifications', href: '/team/notifications', icon: 'Bell' },
  { label: 'Account', href: '/team/account', icon: 'Settings' },
]

export const TEAM_BOTTOM_NAV: readonly NavItem[] = [
  { label: 'Home', href: '/team', icon: 'Home' },
  { label: 'Matches', href: '/team/matches', icon: 'Swords' },
  { label: 'Bracket', href: '/team/bracket', icon: 'GitBranch' },
  { label: 'My Team', href: '/team/profile', icon: 'Users' },
  { label: 'Account', href: '/team/account', icon: 'Settings' },
]

// ── The team behind PLAYORA (About page) ──
// Ordered by scope of ownership. `focus` is what each person is actually
// responsible for; `skills` is the toolset. Keeping those separate stops the
// cards reading as a list of buzzwords.
export const TEAM_MEMBERS = [
  {
    name: 'Abdur Rafay Baig',
    role: 'Full Team Lead Architect',
    title: 'Backend and frontend — end to end',
    bio: 'Leads PLAYORA and built it. Designed the knockout engine and data model, the REST contract the Django service implements, and the entire interface from the design tokens upward.',
    photo: '/abdur-rafay.jpeg',
    linkedin: 'https://www.linkedin.com/in/irafaybaig/',
    focus: [
      'Tournament engine — bracket generation, bye handling, round progression',
      'Data model and the REST contract for the Django service',
      'Design system, component library and the full interface',
      'Accessibility and performance standards across the product',
    ],
    skills: ['Next.js', 'TypeScript', 'Django', 'PostgreSQL', 'REST', 'WebSockets', 'UI/UX'],
    isPrimary: true,
  },
  {
    name: 'Ammar Ahmad',
    role: 'Backend Architect',
    title: 'Data and services',
    bio: 'Owns the server side PLAYORA runs on — the schema, the API surface, and the integrity rules that keep a match result from ever contradicting the bracket.',
    photo: '/placeholder-avatar.svg',
    linkedin: '',
    focus: [
      'Database schema and migrations',
      'REST endpoints and authentication',
      'Match-state integrity and audit trail',
      'Real-time channel for live scores',
    ],
    skills: ['Django', 'PostgreSQL', 'REST', 'WebSockets'],
    isPrimary: false,
  },
  {
    name: 'Wajdan Ali',
    role: 'Mobile Optimization',
    title: 'Device and field experience',
    bio: 'Makes PLAYORA work on the phone in a captain’s hand and the referee’s screen beside the table — the two places it is actually used on tournament day.',
    photo: '/placeholder-avatar.svg',
    linkedin: '',
    focus: [
      'Responsive layouts down to 320px',
      'Touch targets, safe-area handling and one-handed reach',
      'On-court referee and scoring views',
      'Cross-device testing and load performance',
    ],
    skills: ['Responsive Design', 'Mobile UX', 'Performance', 'QA'],
    isPrimary: false,
  },
] as const

// ── Contact ──
export const CONTACT = {
  email: 'f233046@cfd.nu.edu.pk',
  phone: '0300 7562623',
  /** E.164 without the +, for tel: and wa.me links. */
  phoneLink: '923007562623',
  venue: 'Cafe',
  hours: '10:00 AM – 6:00 PM',
} as const

// ── Brand ──
export const BRAND = {
  name: 'PLAYORA',
  tagline: 'Ludo Tournament Management Portal',
  fullName: 'PLAYORA — Ludo Tournament Management Portal',
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

/**
 * Admin sign-in for this preview build.
 *
 * Kept in env, not in the repo, because the brief was explicit about not
 * publishing credentials to GitHub. `.env.example` documents the keys with
 * placeholder values; put the real ones in `.env.local` (gitignored) and in
 * the host's environment settings.
 *
 * This is still a client-side check and therefore readable by anyone who
 * opens devtools. It gates a demo, not a real console — move it to the
 * Django session/JWT endpoint before this runs a live tournament.
 */
export const ADMIN_LOGIN = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '',
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '',
} as const
