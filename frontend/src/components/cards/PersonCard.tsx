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

function LinkedInLink({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
    >
      {/* lucide v1 dropped brand marks, so this one is inline. */}
      <svg aria-hidden="true" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94Z" />
      </svg>
      <span>
        LinkedIn
        <span className="sr-only"> profile for {name}</span>
      </span>
      <ExternalLink aria-hidden="true" className="w-2.5 h-2.5 opacity-60" />
    </a>
  )
}

function Portrait({
  photo,
  name,
  size,
  accentText,
}: {
  photo: string
  name: string
  size: "lg" | "sm"
  accentText: string
}) {
  const hasPhoto = Boolean(photo) && photo !== "/placeholder-avatar.svg"
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-ink-faint/10 ring-1 ring-border",
        size === "lg" ? "w-32 h-32 sm:w-36 sm:h-36 rounded-3xl" : "w-16 h-16 rounded-2xl",
      )}
    >
      {hasPhoto ? (
        <Image
          src={photo}
          alt={`Portrait of ${name}`}
          fill
          sizes={size === "lg" ? "144px" : "64px"}
          className="object-cover object-center"
          priority={size === "lg"}
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "w-full h-full flex items-center justify-center font-extrabold",
            size === "lg" ? "text-3xl" : "text-lg",
            accentText,
          )}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}

function OwnsList({ focus, dot }: { focus: readonly string[]; dot: string }) {
  return (
    <div className="text-left">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-2">
        Owns
      </h4>
      <ul className="space-y-1.5">
        {focus.map((item) => (
          <li key={item} className="text-xs text-ink-muted leading-relaxed flex gap-2">
            <span aria-hidden="true" className={cn("mt-1.5 w-1 h-1 rounded-full shrink-0", dot)} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Tools({ skills, center }: { skills: readonly string[]; center?: boolean }) {
  return (
    <div className={cn("mt-auto pt-4 border-t border-border w-full", center && "text-center")}>
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-2">
        Tools
      </h4>
      <ul className={cn("flex flex-wrap gap-1.5", center && "justify-center")}>
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
  )
}

/**
 * Team member card, in two shapes.
 *
 * `isPrimary` renders a tall, narrow, centred card — portrait on top, then
 * name and role, then the detail stacked beneath. Growing downward rather
 * than sideways keeps the lead card from turning into a wide banner that
 * dwarfs the two below it.
 *
 * The rest are compact: portrait beside the name, detail underneath, sized
 * to sit two-up.
 *
 * Body copy stays left-aligned in both. Centred paragraphs give the eye no
 * consistent starting edge and are measurably slower to read.
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
  const hasLinkedIn = Boolean(linkedin) && linkedin !== "#"
  const accentBar = isPrimary ? "bg-ludo-flame" : "bg-ludo-indigo"
  const accentText = isPrimary ? "text-ludo-flame-ink" : "text-ludo-indigo-ink"

  if (isPrimary) {
    return (
      <article className="relative card-base overflow-hidden max-w-md mx-auto h-full flex flex-col">
        <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1", accentBar)} />

        <div className="p-6 sm:p-8 flex flex-col items-center gap-5 h-full">
          <Portrait photo={photo} name={name} size="lg" accentText={accentText} />

          <div className="text-center">
            <p className="inline-flex items-center px-2.5 py-1 mb-2 rounded-full bg-ludo-flame/15 text-ludo-flame-ink text-[10px] font-bold uppercase tracking-wider">
              Project lead
            </p>
            <h3 className="text-2xl font-extrabold tracking-tight text-ink leading-tight">
              {name}
            </h3>
            <p className={cn("text-sm font-semibold mt-1", accentText)}>{role}</p>
            <p className="text-xs text-ink-muted mt-1">{title}</p>
            {hasLinkedIn && (
              <div className="mt-3">
                <LinkedInLink href={linkedin} name={name} />
              </div>
            )}
          </div>

          <p className="text-sm text-ink-muted leading-relaxed text-left">{bio}</p>

          {focus && focus.length > 0 && <OwnsList focus={focus} dot={accentBar} />}

          {skills.length > 0 && <Tools skills={skills} center />}
        </div>
      </article>
    )
  }

  return (
    <article className="relative card-base overflow-hidden h-full flex flex-col">
      <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1", accentBar)} />

      <div className="p-6 flex flex-col gap-5 h-full">
        <div className="flex items-start gap-4">
          <Portrait photo={photo} name={name} size="sm" accentText={accentText} />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-extrabold tracking-tight text-ink leading-tight">
              {name}
            </h3>
            <p className={cn("text-sm font-semibold mt-0.5", accentText)}>{role}</p>
            <p className="text-xs text-ink-muted mt-0.5">{title}</p>
            {hasLinkedIn && (
              <div className="mt-2">
                <LinkedInLink href={linkedin} name={name} />
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed">{bio}</p>

        {focus && focus.length > 0 && <OwnsList focus={focus} dot={accentBar} />}

        {skills.length > 0 && <Tools skills={skills} />}
      </div>
    </article>
  )
}
