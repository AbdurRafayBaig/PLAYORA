/* ═══════════════════════════════════════════════
   PLAYORA — Constants & Configuration
   ═══════════════════════════════════════════════ */

// ── Ludo Color Palette ──
export const COLORS = {
  red:    { hex: '#E53935', light: '#FF6F60', dark: '#AB000D' },
  yellow: { hex: '#FBC02D', light: '#FFF263', dark: '#C49000' },
  green:  { hex: '#43A047', light: '#76D275', dark: '#00701A' },
  blue:   { hex: '#1E88E5', light: '#6AB7FF', dark: '#005CB2' },
  ink:    '#17202A',
  muted:  '#667085',
  surface:'#F7F8FA',
  white:  '#FFFFFF',
} as const;

// ── Match Status Configuration ──
export const MATCH_STATUS = {
  scheduled:  { label: 'Scheduled',  color: 'blue',   icon: 'Calendar' },
  checkin:    { label: 'Check-in',   color: 'yellow', icon: 'UserCheck' },
  ready:      { label: 'Ready',      color: 'yellow', icon: 'CheckCircle' },
  live:       { label: 'LIVE',       color: 'red',    icon: 'Radio' },
  paused:     { label: 'Paused',     color: 'yellow', icon: 'Pause' },
  completed:  { label: 'Completed',  color: 'green',  icon: 'Trophy' },
  cancelled:  { label: 'Cancelled',  color: 'muted',  icon: 'XCircle' },
  postponed:  { label: 'Postponed',  color: 'muted',  icon: 'Clock' },
  walkover:   { label: 'Walkover',   color: 'yellow', icon: 'AlertTriangle' },
} as const;

// ── Tournament Status ──
export const TOURNAMENT_STATUS = {
  draft:     { label: 'Draft',       color: 'muted' },
  active:    { label: 'Active',      color: 'green' },
  paused:    { label: 'Paused',      color: 'yellow' },
  completed: { label: 'Completed',   color: 'blue' },
  archived:  { label: 'Archived',    color: 'muted' },
} as const;

// ── Team Status ──
export const TEAM_STATUS = {
  active:        { label: 'Active',        color: 'green' },
  qualified:     { label: 'Qualified',     color: 'green' },
  eliminated:    { label: 'Eliminated',    color: 'red' },
  disqualified:  { label: 'Disqualified',  color: 'red' },
  bye:           { label: 'Bye',           color: 'yellow' },
} as const;

// ── Public Navigation ──
export const PUBLIC_NAV = [
  { label: 'Home',       href: '/',          icon: 'Home' },
  { label: 'Live',       href: '/live',       icon: 'Radio' },
  { label: 'Fixtures',   href: '/fixtures',   icon: 'Calendar' },
  { label: 'Standings',  href: '/standings',  icon: 'BarChart3' },
  { label: 'Results',    href: '/results',    icon: 'Trophy' },
  { label: 'About',      href: '/about',      icon: 'Users' },
  { label: 'Contact',    href: '/contact',    icon: 'MessageCircle' },
] as const;

// ── Admin Sidebar Navigation ──
export const ADMIN_NAV = [
  { label: 'Dashboard',       href: '/admin',              icon: 'LayoutDashboard' },
  { label: 'Tournaments',     href: '/admin/tournaments',  icon: 'Trophy' },
  { label: 'Teams',           href: '/admin/teams',        icon: 'Users' },
  { label: 'Players',         href: '/admin/players',      icon: 'UserCircle' },
  { label: 'Fixtures',        href: '/admin/fixtures',     icon: 'Calendar' },
  { label: 'Live Matches',    href: '/admin/live',         icon: 'Radio' },
  { label: 'Standings',       href: '/admin/standings',    icon: 'BarChart3' },
  { label: 'Venues & Tables', href: '/admin/venues',       icon: 'MapPin' },
  { label: 'Disputes',        href: '/admin/disputes',     icon: 'AlertTriangle' },
  { label: 'Announcements',   href: '/admin/announcements',icon: 'Megaphone' },
  { label: 'Reports',         href: '/admin/reports',      icon: 'FileText' },
  { label: 'Users & Roles',   href: '/admin/users',        icon: 'Shield' },
  { label: 'Audit Log',       href: '/admin/audit',        icon: 'ScrollText' },
  { label: 'Settings',        href: '/admin/settings',     icon: 'Settings' },
] as const;

// ── Team Portal Navigation ──
export const TEAM_NAV = [
  { label: 'Home',           href: '/team',               icon: 'Home' },
  { label: 'My Team',        href: '/team/profile',       icon: 'Users' },
  { label: 'My Matches',     href: '/team/matches',       icon: 'Swords' },
  { label: 'Results',        href: '/team/results',       icon: 'Trophy' },
  { label: 'Standing',       href: '/team/standing',      icon: 'BarChart3' },
  { label: 'Notifications',  href: '/team/notifications', icon: 'Bell' },
  { label: 'Account',        href: '/team/account',       icon: 'Settings' },
] as const;

// ── Team Members (About Us Page) ──
export const TEAM_MEMBERS = [
  {
    name: 'Abdur Rafay Baig',
    role: 'Founder & Lead Architect',
    title: 'COO @ Tynovate',
    bio: 'Designed the full-stack architecture, intuitive UI/UX, database schema, and real-time tournament engine that powers PLAYORA. The driving force behind every technical decision.',
    photo: '/abdur-rafay.jpeg',
    linkedin: 'https://www.linkedin.com/in/irafaybaig/',
    skills: ['System Architecture', 'UI/UX Design', 'Next.js', 'TypeScript', 'Django', 'PostgreSQL', 'API Design', 'WebSockets'],
    isPrimary: true,
  },
  {
    name: 'Team Member',
    role: 'Frontend Engineer',
    title: 'Developer @ Tynovate',
    bio: 'Brings the visual designs to life with pixel-perfect component implementation, responsive layouts, and smooth micro-interactions across the PLAYORA platform.',
    photo: '/placeholder-avatar.svg',
    linkedin: '#',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Animations'],
    isPrimary: false,
  },
  {
    name: 'Team Member',
    role: 'Backend Engineer',
    title: 'Developer @ Tynovate',
    bio: 'Builds the robust API layer, tournament logic engine, real-time match tracking, and secure authentication system that keeps PLAYORA running seamlessly.',
    photo: '/placeholder-avatar.svg',
    linkedin: '#',
    skills: ['Django', 'PostgreSQL', 'REST APIs', 'WebSockets'],
    isPrimary: false,
  },
] as const;

// ── Brand ──
export const BRAND = {
  name: 'PLAYORA',
  tagline: 'Sports Tournament Management Portal',
  fullName: 'PLAYORA — Sports Tournament Management Portal',
  footer: 'Developed under Tynovate',
  year: new Date().getFullYear(),
} as const;
