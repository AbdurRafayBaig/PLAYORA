"use client"

import { useId, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye, EyeOff, LogIn, ArrowLeft, Shield, Users, Loader2, AlertCircle,
} from "lucide-react"
import { BRAND, currentYear } from "@/lib/constants"
import { LudoMark } from "@/components/layout/LudoMark"
import { cn } from "@/lib/utils"

type Role = "team" | "admin"

/**
 * Demo credentials. Replace this whole block with a POST to the Django
 * `/api/auth/login/` endpoint — the form, validation and pending states
 * already assume an async call.
 */
const DEMO = {
  team: { identifier: "T001", password: "playora" },
  admin: { identifier: "admin@playora.app", password: "playora" },
}

export default function LoginPage() {
  const router = useRouter()
  const formId = useId()

  const [role, setRole] = useState<Role>("team")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const isTeam = role === "team"
  const accent = isTeam ? "red" : "blue"

  function switchRole(next: Role) {
    setRole(next)
    setError(null)
    setIdentifier("")
    setPassword("")
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const id = identifier.trim()

    if (!id) {
      setError(isTeam ? "Enter your team code." : "Enter your email address.")
      return
    }
    if (!isTeam && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) {
      setError("Enter a valid email address.")
      return
    }
    if (!password) {
      setError("Enter your password.")
      return
    }

    setPending(true)

    // Stands in for the network round trip so the pending state is real.
    await new Promise((resolve) => setTimeout(resolve, 600))

    const expected = DEMO[role]
    if (
      id.toLowerCase() !== expected.identifier.toLowerCase() ||
      password !== expected.password
    ) {
      setPending(false)
      setError(
        `Those credentials were not recognised. Try the demo login shown below.`,
      )
      return
    }

    router.push(isTeam ? "/team" : "/admin")
  }

  return (
    <main
      id="main-content"
      className="min-h-dvh flex flex-col items-center justify-center bg-surface px-4 py-10"
    >
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ludo-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ludo-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 animate-fade-in-up">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4" />
          Back to Home
        </Link>

        <div
          className={cn(
            "card-base border-t-4 p-6 sm:p-8 space-y-6",
            isTeam ? "border-t-ludo-red" : "border-t-ludo-blue",
          )}
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <LudoMark className="w-14 h-14 mx-auto rounded-2xl" />
            <h1 className="text-2xl font-extrabold text-ink tracking-tight">
              Welcome to {BRAND.name}
            </h1>
            <p className="text-xs text-ink-muted">Log in to your tournament portal</p>
          </div>

          {/* Role selector */}
          <div
            role="radiogroup"
            aria-label="Portal type"
            className="flex rounded-xl bg-ink-faint/10 p-1 border border-border"
          >
            {(
              [
                { value: "team", label: "Team Login", icon: Users },
                { value: "admin", label: "Admin Login", icon: Shield },
              ] as const
            ).map(({ value, label, icon: Icon }) => {
              const selected = role === value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => switchRole(value)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                    selected
                      ? value === "team"
                        ? "bg-surface-raised text-ludo-red-ink shadow-sm"
                        : "bg-surface-raised text-ludo-blue-ink shadow-sm"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  <Icon aria-hidden="true" className="w-3.5 h-3.5" />
                  {label}
                </button>
              )
            })}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Identifier */}
            <div className="space-y-1.5">
              <label
                htmlFor={`${formId}-identifier`}
                className="block text-xs font-semibold text-ink"
              >
                {isTeam ? "Team Code" : "Email Address"}
              </label>
              <input
                // Remounts on role change so the browser does not offer an
                // email autofill for the team-code field and vice versa.
                key={role}
                id={`${formId}-identifier`}
                name={isTeam ? "team-code" : "email"}
                type={isTeam ? "text" : "email"}
                inputMode={isTeam ? "text" : "email"}
                autoComplete={isTeam ? "username" : "email"}
                autoCapitalize={isTeam ? "characters" : "none"}
                autoCorrect="off"
                spellCheck={false}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${formId}-error` : undefined}
                placeholder={isTeam ? "e.g. T001" : "admin@playora.app"}
                className={cn(
                  // 16px text: anything smaller makes iOS Safari zoom the
                  // whole page in when the field is focused.
                  "w-full px-4 py-3 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 transition-shadow",
                  accent === "red"
                    ? "focus:ring-ludo-red/40 focus:border-ludo-red/50"
                    : "focus:ring-ludo-blue/40 focus:border-ludo-blue/50",
                )}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor={`${formId}-password`}
                className="block text-xs font-semibold text-ink"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id={`${formId}-password`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${formId}-error` : undefined}
                  placeholder="Enter your password"
                  className={cn(
                    "w-full px-4 py-3 pr-14 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 transition-shadow",
                    accent === "red"
                      ? "focus:ring-ludo-red/40 focus:border-ludo-red/50"
                      : "focus:ring-ludo-blue/40 focus:border-ludo-blue/50",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink hover:bg-ink-faint/10 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="w-4 h-4" />
                  ) : (
                    <Eye aria-hidden="true" className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error — announced, not just coloured */}
            {error && (
              <p
                id={`${formId}-error`}
                role="alert"
                className="flex items-start gap-2 text-xs text-ludo-red-ink bg-ludo-red/10 border border-ludo-red/20 rounded-xl px-3 py-2.5"
              >
                <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 mt-px" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-colors shadow-lg cursor-pointer disabled:opacity-70 disabled:cursor-wait",
                isTeam
                  ? "bg-ludo-red-solid hover:bg-ludo-red-solid-hover"
                  : "bg-ludo-blue-solid hover:bg-ludo-blue-solid-hover",
              )}
            >
              {pending ? (
                <>
                  <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn aria-hidden="true" className="w-4 h-4" />
                  {isTeam ? "Login to Team Portal" : "Login to Admin Panel"}
                </>
              )}
            </button>
          </form>

          {/* Demo credentials — this is a public preview with no backend yet,
              so leaving visitors unable to get in would be the bigger flaw. */}
          <div className="rounded-xl border border-dashed border-border bg-ink-faint/5 px-4 py-3 space-y-1">
            <p className="text-[11px] font-bold text-ink">Demo credentials</p>
            <p className="text-[11px] text-ink-muted">
              {isTeam ? "Team code" : "Email"}:{" "}
              <code className="font-mono text-ink">{DEMO[role].identifier}</code>
              {" · "}Password: <code className="font-mono text-ink">{DEMO[role].password}</code>
            </p>
            <button
              type="button"
              onClick={() => {
                setIdentifier(DEMO[role].identifier)
                setPassword(DEMO[role].password)
                setError(null)
              }}
              className="text-[11px] font-semibold text-ludo-blue-ink hover:underline cursor-pointer"
            >
              Fill demo credentials
            </button>
          </div>

          <p className="text-[11px] text-ink-muted text-center">
            {isTeam
              ? "Use the team code and password provided by the tournament admin."
              : "Admin credentials are managed by the Ludo Head / Super Admin."}
          </p>
        </div>

        <p className="text-center text-xs text-ink-faint">
          © {currentYear()} {BRAND.name}. {BRAND.footer}.
        </p>
      </div>
    </main>
  )
}
