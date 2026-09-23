import Link from "next/link"
import { Heart, ExternalLink } from "lucide-react"
import { BRAND, PUBLIC_NAV } from "@/lib/constants"

export function PlayoraFooter() {
  return (
    <footer className="border-t border-border bg-surface-raised mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                  <div className="bg-ludo-red" />
                  <div className="bg-ludo-yellow" />
                  <div className="bg-ludo-blue" />
                  <div className="bg-ludo-green" />
                </div>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-ink">
                {BRAND.name}
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed max-w-xs">
              {BRAND.tagline}. A complete tournament operations system for managing teams, fixtures, live matches, standings, and progression.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {PUBLIC_NAV.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-muted hover:text-ludo-red transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
              Portals
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-ink-muted hover:text-ludo-red transition-colors duration-200">
                  Team Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-ink-muted hover:text-ludo-red transition-colors duration-200">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-ink-muted hover:text-ludo-red transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-ink-muted hover:text-ludo-red transition-colors duration-200">
                  Contact & Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Built With */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
              Technology
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {['Next.js', 'TypeScript', 'Tailwind', 'Django', 'PostgreSQL'].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-ink-faint/10 text-ink-muted border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-muted">
            © {BRAND.year} {BRAND.name}. {BRAND.footer}.
          </p>
          <p className="text-xs text-ink-muted flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-ludo-red fill-ludo-red" /> by{" "}
            <a
              href="https://www.linkedin.com/in/irafaybaig/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ludo-blue hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              Abdur Rafay Baig
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
