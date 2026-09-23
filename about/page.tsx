"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  UtensilsCrossed,
  ArrowLeft,
  Linkedin,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-20 px-4 md:px-6 py-3 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">MessMeter</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/feedback">
            <Button size="sm" className="rounded-xl text-xs font-medium">
              Rate Food
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-3xl mx-auto px-4 py-10 md:py-16 w-full space-y-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Leadership & Engineering</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">The Brilliant Minds Behind MessMeter</h1>
        </div>

        {/* Profile Card matching user requested design */}
        <div className="relative border-t-4 border-t-indigo-600 rounded-2xl border border-border bg-card p-6 sm:p-10 text-center max-w-lg mx-auto shadow-md space-y-5">
          
          {/* Centered Circular Avatar (Enlarged & Perfectly Centered) */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden mx-auto border-4 border-card shadow-lg bg-muted">
            <Image
              src="/abdur-rafay.jpg"
              alt="Abdur Rafay Baig"
              fill
              className="object-cover object-center scale-105"
              priority
            />
          </div>

          {/* Name & Role */}
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Abdur Rafay Baig
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Chief Operating Officer (COO) @ Tynovate
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              UI/UX Designer & Backend Architect
            </p>
          </div>

          {/* Bio Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-2 text-balance">
            Crafted the intuitive user interfaces & designed the robust server infrastructure, database architecture, and real-time food feedback monitoring system that powers MessMeter's seamless operations under Tynovate.
          </p>

          {/* Technology / Skill Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-secondary text-secondary-foreground border border-border/40">
              UI/UX Design
            </span>
            <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-secondary text-secondary-foreground border border-border/40">
              Backend Architect
            </span>
            <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-secondary text-secondary-foreground border border-border/40">
              Next.js 16
            </span>
            <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-secondary text-secondary-foreground border border-border/40">
              TypeScript
            </span>
            <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-secondary text-secondary-foreground border border-border/40">
              Supabase SQL
            </span>
            <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-secondary text-secondary-foreground border border-border/40">
              API Systems
            </span>
          </div>

          {/* LinkedIn Direct Button */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-center">
            <a
              href="https://www.linkedin.com/in/irafaybaig/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              Connect on LinkedIn
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* What is MessMeter? */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-bold text-foreground tracking-tight text-center">About MessMeter by Tynovate</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-center max-w-xl mx-auto">
            MessMeter is a clean hostel food quality monitoring system. Built under the leadership of Tynovate, it bridges communication between hostel residents and mess administration.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Card className="border-border bg-card/60">
              <CardContent className="p-4 space-y-1">
                <ShieldCheck className="w-5 h-5 text-primary mb-1" />
                <h3 className="font-bold text-foreground text-xs">Anonymous Rating</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Students rate Breakfast, Lunch, and Dinner in under 30 seconds anonymously.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/60">
              <CardContent className="p-4 space-y-1">
                <BarChart3 className="w-5 h-5 text-amber-500 mb-1" />
                <h3 className="font-bold text-foreground text-xs">Live Scores</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Taste, Hygiene, Quantity, and Overall satisfaction scores update automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/60">
              <CardContent className="p-4 space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
                <h3 className="font-bold text-foreground text-xs">Mess Action</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Admins get trend reports to fix low-rated meals and improve hostel dining.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="p-5 rounded-2xl border border-primary/20 bg-primary/5 text-center space-y-3">
          <h3 className="text-sm font-bold text-foreground">Ready to Rate Today's Food?</h3>
          <div className="flex items-center justify-center gap-3">
            <Link href="/feedback">
              <Button size="sm" className="rounded-xl font-medium px-4 text-xs">
                Rate Today's Meal
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="rounded-xl font-medium px-4 text-xs">
                Back to Home
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Clean Footer */}
      <footer className="px-4 py-5 border-t border-border bg-card mt-auto text-center text-xs text-muted-foreground">
        <p className="font-medium text-foreground">
          MessMeter · Developed by <a href="https://www.linkedin.com/in/irafaybaig/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Abdur Rafay Baig</a> (COO @ Tynovate)
        </p>
      </footer>
    </main>
  )
}
