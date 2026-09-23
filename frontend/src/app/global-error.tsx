"use client"

/**
 * Last-resort boundary: this replaces the whole document, so it cannot rely
 * on the root layout, the theme provider or the Tailwind-driven tokens. The
 * styles are inline on purpose.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          background: "#FDF8EC",
          color: "#2E0F35",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "26rem", textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              margin: "0 auto 1.25rem",
              borderRadius: 14,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
            }}
          >
            <span style={{ background: "#FF5C23" }} />
            <span style={{ background: "#FFCE6B" }} />
            <span style={{ background: "#4B3FCF" }} />
            <span style={{ background: "#E46CFF" }} />
          </div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
            PLAYORA could not start
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#5B4663", lineHeight: 1.6, margin: 0 }}>
            A critical error stopped the application from loading. Reloading
            usually fixes it.
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.6875rem", color: "#7C6784", marginTop: "0.75rem" }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: 16,
              border: "none",
              background: "#C2410C",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload PLAYORA
          </button>
        </div>
      </body>
    </html>
  )
}
