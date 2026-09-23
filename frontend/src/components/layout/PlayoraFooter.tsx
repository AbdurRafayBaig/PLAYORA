import Link from "next/link"
import { Heart, ExternalLink } from "lucide-react"
import { BRAND, PUBLIC_NAV, currentYear } from "@/lib/constants"
import { LudoMark } from "@/components/layout/LudoMark"

const PORTAL_LINKS = [
  { label: "Team Login", href: "/login" },
  { label: "Admin Dashboard", href: "/login" },
  { label: "About Us", href: "/about" },
  { label: "Contact & Rules", href: "/contact" },
]

const TECH = ["Next.js", "TypeScript", "Tailwind", "Django", "PostgreSQL"]

export function PlayoraFooter() {
  return (
    <footer className="border-t border-border bg-surface-raised mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <LudoMark className="w-8 h-8 rounded-lg shrink-0" />
              <span className="text-lg font-extrabold tracking-tight text-ink">
                {BRAND.name}
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed max-w-xs">
              {BRAND.tagline}. Runs a single-elimination Ludo championship end
              to end — registration, the draw, live matches and the bracket.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-labelledby="footer-quick-links">
            <h2
              id="footer-quick-links"
              className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3"
            >
              Quick Links
            </h2>
            <ul className="space-y-2">
              {PUBLIC_NAV.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-muted hover:text-ludo-flame-ink transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Portals */}
          <nav aria-labelledby="footer-portals">
            <h2
              id="footer-portals"
              className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3"
            >
              Portals
            </h2>
            <ul className="space-y-2">
              {PORTAL_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-muted hover:text-ludo-flame-ink transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Technology */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
              Technology
            </h2>
            <ul className="flex flex-wrap gap-1.5">
              {TECH.map((tech) => (
                <li
                  key={tech}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-ink-faint/10 text-ink-muted border border-border"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <a
              href={BRAND.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
            >
              {/* lucide v1 dropped brand marks, so this one is inline. */}
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>
              </svg>
              Source on GitHub
              <ExternalLink aria-hidden="true" className="w-2.5 h-2.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-xs text-ink-muted">
            © {currentYear()} {BRAND.name}. {BRAND.footer}.
          </p>
          <p className="text-xs text-ink-muted flex items-center gap-1 flex-wrap justify-center">
            Built with
            <Heart aria-label="love" className="w-3 h-3 text-ludo-flame fill-ludo-flame" />
            by
            <a
              href="https://www.linkedin.com/in/irafaybaig/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ludo-indigo-ink hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              Abdur Rafay Baig
              <ExternalLink aria-hidden="true" className="w-2.5 h-2.5 opacity-60" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
