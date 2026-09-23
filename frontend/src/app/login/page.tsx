"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, LogIn, ArrowLeft, Shield } from "lucide-react"
import { BRAND } from "@/lib/constants"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<"team" | "admin">("team")

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-surface px-4 py-8">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ludo-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ludo-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 animate-fade-in-up">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="card-base border-t-4 border-t-ludo-red p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto">
              <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                <div className="bg-ludo-red" />
                <div className="bg-ludo-yellow" />
                <div className="bg-ludo-blue" />
                <div className="bg-ludo-green" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-ink tracking-tight">
              Welcome to {BRAND.name}
            </h1>
            <p className="text-xs text-ink-muted">
              Login to your tournament portal
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex rounded-xl bg-ink-faint/8 p-1 border border-border">
            <button
              onClick={() => setRole("team")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === "team"
                  ? "bg-surface-raised text-ludo-red shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Team Login
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === "admin"
                  ? "bg-surface-raised text-ludo-blue shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Login
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {role === "team" ? (
              <div className="space-y-1.5">
                <label htmlFor="team-code" className="text-xs font-semibold text-ink">
                  Team Code
                </label>
                <input
                  id="team-code"
                  type="text"
                  placeholder="e.g., T001"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ludo-red/30 focus:border-ludo-red/50 transition-all"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-ink">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@playora.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ludo-blue/30 focus:border-ludo-blue/50 transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-ink">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border border-border bg-surface text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 transition-all ${
                    role === "team"
                      ? "focus:ring-ludo-red/30 focus:border-ludo-red/50"
                      : "focus:ring-ludo-blue/30 focus:border-ludo-blue/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer ${
                role === "team"
                  ? "bg-ludo-red hover:bg-ludo-red-dark"
                  : "bg-ludo-blue hover:bg-ludo-blue-dark"
              }`}
              id="login-submit"
            >
              <LogIn className="w-4 h-4" />
              {role === "team" ? "Login to Team Portal" : "Login to Admin Panel"}
            </button>
          </form>

          {/* Helper Text */}
          <p className="text-[11px] text-ink-muted text-center">
            {role === "team"
              ? "Use the Team Code and password provided by the tournament admin."
              : "Admin credentials are managed by the Ludo Head / Super Admin."}
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-ink-faint">
          © {BRAND.year} {BRAND.name}. {BRAND.footer}.
        </p>
      </div>
    </main>
  )
}
