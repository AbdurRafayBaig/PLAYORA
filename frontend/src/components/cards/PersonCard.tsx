import Image from "next/image"
import { ExternalLink } from "lucide-react"

interface PersonCardProps {
  name: string
  role: string
  title: string
  bio: string
  photo: string
  linkedin: string
  skills: readonly string[]
  isPrimary?: boolean
}

export function PersonCard({
  name,
  role,
  title,
  bio,
  photo,
  linkedin,
  skills,
  isPrimary = false,
}: PersonCardProps) {
  const accentColor = isPrimary ? "ludo-red" : "ludo-blue"

  return (
    <div
      className={`relative rounded-2xl border bg-surface-raised overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl ${
        isPrimary
          ? "border-t-4 border-t-ludo-red border-border max-w-lg mx-auto"
          : "border-t-4 border-t-ludo-blue border-border"
      }`}
    >
      <div className={`p-6 sm:p-8 text-center space-y-4 ${isPrimary ? "sm:p-10" : ""}`}>
        {/* Avatar */}
        <div
          className={`relative mx-auto rounded-full overflow-hidden border-4 border-surface-raised shadow-lg bg-ink-faint/10 ${
            isPrimary ? "w-44 h-44 sm:w-52 sm:h-52" : "w-32 h-32 sm:w-36 sm:h-36"
          }`}
        >
          {photo && photo !== "/placeholder-avatar.svg" ? (
            <Image
              src={photo}
              alt={name}
              fill
              className="object-cover object-center scale-105"
              priority={isPrimary}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-3xl font-extrabold ${
              isPrimary ? "text-ludo-red/30" : "text-ludo-blue/30"
            }`}>
              {name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
          )}
        </div>

        {/* Name & Titles */}
        <div className="space-y-1">
          <h2 className={`font-extrabold tracking-tight text-ink ${isPrimary ? "text-2xl" : "text-xl"}`}>
            {name}
          </h2>
          <p className={`text-xs sm:text-sm font-semibold ${
            isPrimary ? "text-ludo-red" : "text-ludo-blue"
          }`}>
            {title}
          </p>
          <p className="text-xs font-medium text-ink-muted">
            {role}
          </p>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed text-balance px-2">
          {bio}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-[11px] font-medium rounded-full bg-ink-faint/8 text-ink-muted border border-border/40"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* LinkedIn */}
        {linkedin && linkedin !== "#" && (
          <div className="pt-3 border-t border-border/60 flex items-center justify-center">
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow hover:opacity-90 transition-all ${
                isPrimary ? "bg-ludo-red hover:bg-ludo-red-dark" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94Z"/>
              </svg>
              Connect on LinkedIn
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
