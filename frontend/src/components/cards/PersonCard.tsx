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
  focus?: readonly string[]
  isPrimary?: boolean
}

/**
 * Team member card.
 *
 * Deliberately restrained: a left-aligned portrait beside the name, a single
 * accent hairline, and tools as quiet tags. The previous version centred
 * everything under a large circular avatar, which reads as a social profile
 * rather than an engineering credit — and centred body copy is harder to
 * scan than left-aligned.
 */
export function PersonCard({
  name,
  role,
  title,
  bio,
  photo,
  linkedin,
  skills,
  focus,
  isPrimary = false,
}: PersonCardProps) {
  const hasPhoto = Boolean(photo) && photo !== "/placeholder-avatar.svg"
  const hasLinkedIn = Boolean(linkedin) && linkedin !== "#"
  const accent = isPrimary ? "bg-ludo-flame" : "bg-ludo-indigo"

  return (
    <article className="relative card-base overflow-hidden h-full flex flex-col">
      <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1", accent)} />

      <div className={cn("p-6 flex flex-col gap-5 h-full", isPrimary && "sm:p-8")}>
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "relative shrink-0 rounded-2xl overflow-hidden bg-ink-faint/10 ring-1 ring-border",
              isPrimary ? "w-20 h-20 sm:w-24 sm:h-24" : "w-16 h-16",
            )}
          >
            {hasPhoto ? (
              <Image
                src={photo}
                alt={`Portrait of ${name}`}
                fill
                sizes={isPrimary ? "96px" : "64px"}
                className="object-cover object-center"
                priority={isPrimary}
              />
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  "w-full h-full flex items-center justify-center font-extrabold",
                  isPrimary ? "text-2xl" : "text-lg",
                  isPrimary ? "text-ludo-flame-ink" : "text-ludo-indigo-ink",
                )}
              >
                {getInitials(name)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "font-extrabold tracking-tight text-ink leading-tight",
                isPrimary ? "text-xl sm:text-2xl" : "text-lg",
              )}
            >
              {name}
            </h3>
            <p
              className={cn(
                "text-sm font-semibold mt-0.5",
                isPrimary ? "text-ludo-flame-ink" : "text-ludo-indigo-ink",
              )}
            >
              {role}
            </p>
            <p className="text-xs text-ink-muted mt-0.5">{title}</p>

            {hasLinkedIn && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
              >
                {/* lucide v1 dropped brand marks, so this one is inline. */}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94Z"/>
                </svg>
                <span>
                  LinkedIn
                  <span className="sr-only"> profile for {name}</span>
                </span>
                <ExternalLink aria-hidden="true" className="w-2.5 h-2.5 opacity-60" />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed">{bio}</p>

        {/* What they actually own, which is what a reader is here to learn. */}
        {focus && focus.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-2">
              Owns
            </h4>
            <ul className="space-y-1.5">
              {focus.map((item) => (
                <li key={item} className="text-xs text-ink-muted leading-relaxed flex gap-2">
                  <span
                    aria-hidden="true"
                    className={cn("mt-1.5 w-1 h-1 rounded-full shrink-0", accent)}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mt-auto pt-4 border-t border-border">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-2">
              Tools
            </h4>
            <ul className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-ink-faint/10 text-ink-muted border border-border"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}
