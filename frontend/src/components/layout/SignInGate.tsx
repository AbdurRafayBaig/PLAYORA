"use client"

import Link from "next/link"
import { Lock, ArrowLeft, LogIn } from "lucide-react"
import { LudoMark } from "@/components/layout/LudoMark"

/**
 * Blocks a portal until its sign-in has happened.
 *
 * Rendered instead of the shell — not layered over it — so the navigation,
 * team names and tournament state of a console you have not signed into are
 * never painted at all.
 *
 * This is a client-side gate on a client-side app: it stops the console
 * being reachable by typing the URL, which is what it is for. Real
 * protection arrives with server-side sessions.
 */
export function SignInGate({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <main
      id="main-content"
      className="min-h-dvh flex flex-col items-center justify-center bg-surface px-4 py-10"
    >
      <div className="w-full max-w-sm card-base border-t-4 border-t-ludo-flame p-6 sm:p-8 text-center space-y-4">
        <LudoMark className="w-14 h-14 mx-auto rounded-2xl" />
        <span
          aria-hidden="true"
          className="w-10 h-10 mx-auto rounded-xl bg-ludo-flame/10 text-ludo-flame-ink flex items-center justify-center"
        >
          <Lock className="w-5 h-5" />
        </span>
        <h1 className="text-xl font-extrabold text-ink tracking-tight">{title}</h1>
        <p className="text-xs text-ink-muted leading-relaxed">{description}</p>

        <div className="pt-2 space-y-2">
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ludo-flame-solid text-white text-sm font-bold hover:bg-ludo-flame-solid-hover transition-colors"
          >
            <LogIn aria-hidden="true" className="w-4 h-4" />
            Go to sign in
          </Link>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface-raised text-ink text-sm font-semibold hover:bg-ink-faint/10 transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4" />
            Back to the public site
          </Link>
        </div>
      </div>
    </main>
  )
}
