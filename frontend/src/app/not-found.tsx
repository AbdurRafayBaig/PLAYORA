import Link from "next/link"
import { Home, Radio, Calendar, BarChart3, Compass } from "lucide-react"
import { BRAND } from "@/lib/constants"

export const metadata = {
  title: "Page not found",
  description: "That page does not exist on PLAYORA.",
}

const SUGGESTIONS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Live Matches", href: "/live", icon: Radio },
  { label: "Fixtures", href: "/fixtures", icon: Calendar },
  { label: "Standings", href: "/standings", icon: BarChart3 },
]

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="w-full max-w-lg space-y-6">
        {/* A Ludo board square, one token short of home. */}
        <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden shadow-lg">
          <div className="w-full h-full grid grid-cols-2 grid-rows-2">
            <div className="bg-ludo-red" />
            <div className="bg-ludo-yellow" />
            <div className="bg-ludo-blue" />
            <div className="bg-ludo-green" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-6xl sm:text-7xl font-extrabold tracking-tight text-gradient-ludo">
            404
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
            This square is off the board
          </h1>
          <p className="text-sm text-ink-muted max-w-sm mx-auto leading-relaxed">
            The page you are looking for does not exist, or it moved when the
            fixtures were regenerated.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SUGGESTIONS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="card-base p-4 flex flex-col items-center gap-2 text-xs font-semibold text-ink"
            >
              <Icon aria-hidden="true" className="w-5 h-5 text-ludo-blue" />
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-ludo-red text-white font-bold text-sm shadow-lg hover:bg-ludo-red-dark transition-colors"
        >
          <Compass aria-hidden="true" className="w-4 h-4" />
          Back to {BRAND.name}
        </Link>
      </div>
    </main>
  )
}
