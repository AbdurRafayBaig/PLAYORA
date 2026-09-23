import type { MetadataRoute } from "next"
import { BRAND } from "@/lib/constants"

/**
 * Installable web app. Teams and referees keep this open on a phone for a
 * whole tournament day, so it is worth making it add-to-home-screen ready.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} — ${BRAND.tagline}`,
    short_name: BRAND.name,
    description:
      "Live matches, fixtures, standings and results for the Ludo Championship.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F7F8FA",
    theme_color: "#E53935",
    categories: ["sports", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops icons to the launcher shape; this one keeps the mark
      // inside the safe zone so it is not sliced into a circle.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Live Matches", short_name: "Live", url: "/live" },
      { name: "Standings", short_name: "Table", url: "/standings" },
      { name: "Fixtures", short_name: "Fixtures", url: "/fixtures" },
    ],
  }
}
