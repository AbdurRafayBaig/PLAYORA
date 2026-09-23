import { type ReactNode } from "react"
import { PageHeader } from "@/components/ui/PageHeader"

interface AdminPageProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

/**
 * Consistent chrome for every admin route: one max width, one gutter scale,
 * one header block. The dashboard previously hard-coded its own padding,
 * which would have drifted the moment a second page copied it.
 */
export function AdminPage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: AdminPageProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={actions}
      />
      <div className="space-y-6">{children}</div>
    </div>
  )
}

/**
 * Banner for features that are designed but not yet wired to the API, so a
 * visitor is told what they are looking at instead of assuming it is broken.
 */
export function PreviewNotice({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] text-ink-muted bg-ludo-blue/5 border border-ludo-blue/20 rounded-xl px-3.5 py-2.5 leading-relaxed">
      {children}
    </p>
  )
}
