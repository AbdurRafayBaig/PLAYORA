export default function Loading() {
  return (
    <div
      className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-label="Loading PLAYORA"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-8 w-56" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
