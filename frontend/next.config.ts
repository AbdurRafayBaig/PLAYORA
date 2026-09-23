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
}

export default nextConfig
