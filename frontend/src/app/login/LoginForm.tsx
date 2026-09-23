"use client"

import { useId, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye, EyeOff, LogIn, ArrowLeft, Shield, Users, Loader2, CircleAlert,
} from "lucide-react"
import { ADMIN_LOGIN, BRAND, currentYear } from "@/lib/constants"
import { LudoMark } from "@/components/layout/LudoMark"
import { useTournament } from "@/lib/tournament/store"
import { cn } from "@/lib/utils"

type Role = "team" | "admin"

export function LoginForm() {
  const router = useRouter()
  const formId = useId()
  const { signInTeam, signInAdmin, teams } = useTournament()

  const [role, setRole] = useState<Role>("team")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const isTeam = role === "team"

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
      setError(isTeam ? "Enter your team ID." : "Enter your email address.")
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
    // Stands in for the network round trip, so the pending state is real
    // rather than decorative.
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (isTeam) {
      if (teams.length === 0) {
        setPending(false)
        setError(
          "No teams are registered yet. The organiser creates team logins when they register you.",
        )
        return
      }
      const team = signInTeam(id, password)
      if (!team) {
        setPending(false)
        setError("That team ID and password do not match. Check with the organiser.")
        return
      }
      router.push("/team")
      return
    }

    if (!ADMIN_LOGIN.email || !ADMIN_LOGIN.password) {
      setPending(false)
      setError(
        "Admin sign-in is not configured. Set NEXT_PUBLIC_ADMIN_EMAIL and NEXT_PUBLIC_ADMIN_PASSWORD in the environment.",
      )
      return
    }
    if (
      id.toLowerCase() !== ADMIN_LOGIN.email.toLowerCase() ||
      password !== ADMIN_LOGIN.password
    ) {
      setPending(false)
      setError("Those admin credentials were not recognised.")
      return
    }
    signInAdmin()
    router.push("/admin")
  }

  const ring = isTeam
    ? "focus:ring-ludo-flame/50 focus:border-ludo-flame/60"
    : "focus:ring-ludo-indigo/50 focus:border-ludo-indigo/60"

  return (
    <div className="w-full max-w-md space-y-5">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ludo-vanilla/70 hover:text-ludo-vanilla transition-colors"
      >
        <ArrowLeft aria-hidden="true" className="w-4 h-4" />
        Back to Home
      </Link>

      <div
        className={cn(
          "rounded-2xl border-t-4 border border-border/60 bg-surface-raised shadow-elevated p-6 sm:p-8 space-y-6",
          isTeam ? "border-t-ludo-flame" : "border-t-ludo-indigo",
        )}
      >
        <div className="text-center space-y-2">
          <LudoMark className="w-14 h-14 mx-auto rounded-2xl" />
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            Welcome to {BRAND.name}
          </h1>
          <p className="text-xs text-ink-muted">Sign in to your tournament portal</p>
        </div>

        <div
          role="radiogroup"
          aria-label="Portal type"
          className="flex rounded-xl bg-ink-faint/10 p-1 border border-border"
        >
          {(
            [
              { value: "team", label: "Team", icon: Users },
              { value: "admin", label: "Admin", icon: Shield },
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
                      ? "bg-surface-raised text-ludo-flame-ink shadow-sm"
                      : "bg-surface-raised text-ludo-indigo-ink shadow-sm"
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
          <div className="space-y-1.5">
            <label
              htmlFor={`${formId}-identifier`}
              className="block text-xs font-semibold text-ink"
            >
              {isTeam ? "Team ID" : "Email address"}
            </label>
            <input
              // Remounts on role change so the browser does not offer an
              // email autofill for the team-ID field and vice versa.
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
              placeholder={isTeam ? "e.g. TM-7KQ4" : "you@example.com"}
              className={cn(
                // 16px text: anything smaller makes iOS Safari zoom the whole
                // page in when the field is focused.
                "w-full px-4 py-3 rounded-xl border border-border bg-surface text-base sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 transition-shadow",
                ring,
              )}
            />
          </div>

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
                  ring,
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

          {error && (
            <p
              id={`${formId}-error`}
              role="alert"
              className="flex items-start gap-2 text-xs text-ludo-flame-ink bg-ludo-flame/10 border border-ludo-flame/25 rounded-xl px-3 py-2.5"
            >
              <CircleAlert aria-hidden="true" className="w-4 h-4 shrink-0 mt-px" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-colors shadow-lg cursor-pointer disabled:opacity-70 disabled:cursor-wait",
              isTeam
                ? "bg-ludo-flame-solid hover:bg-ludo-flame-solid-hover"
                : "bg-ludo-indigo-solid hover:bg-ludo-indigo-solid-hover",
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
                {isTeam ? "Sign in to Team Portal" : "Sign in to Admin Panel"}
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-ink-muted text-center leading-relaxed">
          {isTeam
            ? "Use the team ID and password the organiser gave you at registration. Lost them? Ask at the desk — they can reissue in seconds."
            : "Admin credentials are configured in the deployment environment, not stored in the repository."}
        </p>
      </div>

      <p className="text-center text-xs text-ludo-vanilla/45">
        © {currentYear()} {BRAND.name}. {BRAND.footer}.
      </p>
    </div>
  )
}
