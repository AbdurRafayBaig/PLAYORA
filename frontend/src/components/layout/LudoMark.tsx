import { cn } from "@/lib/utils"

/**
 * The PLAYORA mark: a Ludo board seen from above.
 *
 * Four home bases in the corners, the cross-shaped track running between
 * them as negative space, and the centre goal as a diamond. Kept in sync
 * with the generated favicon and OG image — same geometry, same colours.
 *
 * Inline SVG rather than an <img>: crisp at any size, no extra request, and
 * it cannot render as a broken image if the asset is missing.
 */
export function LudoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <rect width="64" height="64" rx="15" fill="#1C2459" />
      <rect x="6" y="6" width="22" height="22" rx="6" fill="#FF5C23" />
      <rect x="36" y="6" width="22" height="22" rx="6" fill="#FFCE6B" />
      <rect x="6" y="36" width="22" height="22" rx="6" fill="#4B3FCF" />
      <rect x="36" y="36" width="22" height="22" rx="6" fill="#E46CFF" />
      <path d="M32 22 L42 32 L32 42 L22 32 Z" fill="#FFF4D6" />
      <circle cx="32" cy="32" r="3.2" fill="#1C2459" />
    </svg>
  )
}
