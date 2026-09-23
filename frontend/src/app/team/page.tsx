"use client"

import Link from "next/link"
import {
  Trophy, Swords, Calendar, BarChart3, ChevronRight,
  Clock, MapPin, Users, Radio,
} from "lucide-react"
import { MatchCard } from "@/components/cards/MatchCard"
import { StatusBadge } from "@/components/cards/StatusBadge"

export default function TeamHomePage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* ── Welcome Banner ── */}
      <div className="card-base overflow-hidden">
        <div className="relative p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-ludo-red/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Welcome Back</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
              Thunder Hawks 🦅
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge status="qualified" size="md" />
              <span className="text-xs text-ink-muted">Team Code: T001</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Matches Played", value: "4", icon: Swords, color: "text-ludo-red", border: "border-t-ludo-red" },
          { label: "Wins", value: "3", icon: Trophy, color: "text-ludo-green", border: "border-t-ludo-green" },
          { label: "Points", value: "9", icon: BarChart3, color: "text-ludo-blue", border: "border-t-ludo-blue" },
          { label: "Current Rank", value: "#2", icon: Trophy, color: "text-ludo-yellow", border: "border-t-ludo-yellow" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`card-base border-t-4 ${stat.border} p-4 text-center`}>
              <Icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
              <p className="text-xl font-extrabold text-ink">{stat.value}</p>
              <p className="text-[10px] font-medium text-ink-muted">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* ── Upcoming Match ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ludo-blue" />
            <h2 className="text-sm font-bold text-ink">Next Match</h2>
          </div>
          <Link href="/team/matches" className="text-[11px] font-semibold text-ludo-blue hover:underline inline-flex items-center gap-0.5">
            All Matches <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <MatchCard
          id="M005"
          teamA="Thunder Hawks"
          teamB="Silver Wolves"
          status="scheduled"
          venue="Main Hall"
          table="T1"
          time="Tomorrow, 3:00 PM"
          round="Semi Final"
        />
      </div>

      {/* ── Recent Results ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-ludo-green" />
            <h2 className="text-sm font-bold text-ink">Recent Results</h2>
          </div>
          <Link href="/team/results" className="text-[11px] font-semibold text-ludo-green hover:underline inline-flex items-center gap-0.5">
            All Results <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          <MatchCard
            id="M006"
            teamA="Thunder Hawks"
            teamB="Iron Titans"
            status="completed"
            winner="A"
            venue="Room 201"
            table="T3"
            time="Today, 1:00 PM"
            round="Quarter Final"
          />
        </div>
      </div>

      {/* ── Team Members ── */}
      <div className="card-base overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-ink-muted" />
            <h3 className="text-sm font-bold text-ink">Team Members</h3>
          </div>
          <Link href="/team/profile" className="text-[11px] font-semibold text-ludo-red hover:underline cursor-pointer">
            Edit
          </Link>
        </div>
        <div className="divide-y divide-border">
          {[
            { name: "Ali Khan", role: "Captain", email: "ali@example.com", phone: "0300-0000000" },
            { name: "Usman Ahmed", role: "Member", email: "usman@example.com", phone: "0311-1111111" },
          ].map((member) => (
            <div key={member.name} className="px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-ludo-red/10 flex items-center justify-center text-xs font-bold text-ludo-red">
                {member.name.split(" ").map(w => w[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{member.name}</p>
                  {member.role === "Captain" && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-ludo-yellow/15 text-ludo-yellow-dark border border-ludo-yellow/20">
                      Captain
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-ink-muted">{member.email} • {member.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Notifications ── */}
      <div className="card-base p-4 space-y-2 border-l-4 border-l-ludo-blue">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ludo-blue" />
          <h3 className="text-xs font-bold text-ink">Latest Update</h3>
        </div>
        <p className="text-[11px] text-ink-muted leading-relaxed">
          Semi-Final fixtures have been published. Your match against Silver Wolves is scheduled for tomorrow at 3:00 PM in Main Hall, Table T1.
        </p>
      </div>
    </div>
  )
}
