import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { cn, getInitials } from "@/lib/utils"

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
  const hasPhoto = Boolean(photo) && photo !== "/placeholder-avatar.svg"
  const hasLinkedIn = Boolean(linkedin) && linkedin !== "#"

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border border-t-4 bg-surface-raised overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl h-full",
        isPrimary ? "border-t-ludo-flame max-w-lg mx-auto" : "border-t-ludo-indigo",
      )}
    >
      <div
        className={cn(
          "p-6 text-center flex flex-col gap-4 h-full",
          isPrimary ? "sm:p-10" : "sm:p-8",
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "relative mx-auto rounded-full overflow-hidden border-4 border-surface-raised shadow-lg bg-ink-faint/10 shrink-0",
            isPrimary ? "w-36 h-36 sm:w-48 sm:h-48" : "w-28 h-28 sm:w-32 sm:h-32",
          )}
        >
          {hasPhoto ? (
            <Image
              src={photo}
              alt={`Portrait of ${name}`}
              fill
              // Tells the optimiser the real rendered size instead of
              // shipping a 960px-wide source for a 144px circle.
              sizes={isPrimary ? "192px" : "128px"}
              className="object-cover object-center"
              priority={isPrimary}
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center text-3xl font-extrabold",
                isPrimary ? "text-ludo-flame/40" : "text-ludo-indigo/40",
              )}
              aria-hidden="true"
            >
              {getInitials(name)}
            </div>
          )}
        </div>

        {/* Name & titles */}
        <div className="space-y-1">
          <h3
            className={cn(
              "font-extrabold tracking-tight text-ink",
              isPrimary ? "text-2xl" : "text-xl",
            )}
          >
            {name}
          </h3>
          <p
            className={cn(
              "text-xs sm:text-sm font-semibold",
              isPrimary ? "text-ludo-flame-ink" : "text-ludo-indigo-ink",
            )}
          >
            {title}
          </p>
          <p className="text-xs font-medium text-ink-muted">{role}</p>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed text-balance">
          {bio}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-1.5 list-none">
            {skills.map((skill) => (
              <li
                key={skill}
                className="px-3 py-1 text-[11px] font-medium rounded-full bg-ink-faint/10 text-ink-muted border border-border"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}

        {/* LinkedIn — pinned to the bottom so cards in a row line up */}
        {hasLinkedIn && (
          <div className="mt-auto pt-4 border-t border-border flex items-center justify-center">
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold shadow transition-colors",
                isPrimary
                  ? "bg-ludo-flame-solid hover:bg-ludo-flame-solid-hover"
                  : "bg-ludo-indigo-solid hover:bg-ludo-indigo-solid-hover",
              )}
            >
              <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94Z" />
              </svg>
              <span>
                Connect
                <span className="sr-only"> with {name}</span> on LinkedIn
              </span>
              <ExternalLink aria-hidden="true" className="w-3 h-3 opacity-80" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
