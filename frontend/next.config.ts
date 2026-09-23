import type { NextConfig } from "next"

/**
 * Security headers.
 *
 * No CSP here on purpose: Next injects inline scripts for hydration and
 * next-themes needs its blocking theme script, so a CSP worth having needs
 * nonces wired through middleware. Adding a permissive one would be
 * security theatre. These four are unambiguous wins.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
]

const nextConfig: NextConfig = {
  // Nothing gained by advertising the framework version.
  poweredByHeader: false,

  // Trailing-slash-free canonical URLs, matching the sitemap.
  trailingSlash: false,

  images: {
    // The team photos are local; AVIF/WebP keeps them small on mobile data.
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },

  /**
   * The points table became a knockout bracket, so these paths no longer
   * exist. They were live long enough to be linked and bookmarked, and a
   * 404 is a worse answer than the page that replaced them.
   */
  async redirects() {
    return [
      { source: "/standings", destination: "/bracket", permanent: true },
      { source: "/team/standing", destination: "/team/bracket", permanent: true },
      { source: "/team/results", destination: "/team/matches", permanent: true },
      { source: "/admin/standings", destination: "/admin/bracket", permanent: true },
      { source: "/admin/tournaments", destination: "/admin", permanent: true },
      { source: "/admin/players", destination: "/admin/teams", permanent: true },
      { source: "/admin/venues", destination: "/admin/settings", permanent: true },
      { source: "/admin/disputes", destination: "/admin", permanent: true },
      { source: "/admin/announcements", destination: "/admin", permanent: true },
      { source: "/admin/reports", destination: "/admin/bracket", permanent: true },
      { source: "/admin/users", destination: "/admin/teams", permanent: true },
      { source: "/admin/audit", destination: "/admin", permanent: true },
    ]
  },
}

export default nextConfig
