import Link from "next/link"
import { type ComponentProps, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "sm" | "md"

const variants: Record<Variant, string> = {
  primary: "bg-ludo-red text-white hover:bg-ludo-red-dark shadow-sm",
  secondary:
    "bg-surface-raised text-ink border border-border hover:bg-ink-faint/10",
  ghost: "text-ink-muted hover:text-ink hover:bg-ink-faint/10",
  danger: "bg-ludo-red/10 text-ludo-red-ink border border-ludo-red/25 hover:bg-ludo-red/15",
}

const sizes: Record<Size, string> = {
  // Both clear the 44px minimum touch target once padding and line height
  // are counted, which the old 28px icon buttons did not.
  sm: "px-3 py-2.5 text-xs gap-1.5",
  md: "px-5 py-3 text-sm gap-2",
}

const base =
  "inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"

export function Button({
  variant = "secondary",
  size = "sm",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type="button"
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  href,
  variant = "secondary",
  size = "sm",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & {
  href: string
  variant?: Variant
  size?: Size
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  )
}
