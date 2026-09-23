import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/constants"

/** Public pages only — the admin console and team portal are behind auth. */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/",          priority: 1.0, changeFrequency: "hourly" },
  { path: "/live",      priority: 0.9, changeFrequency: "hourly" },
  { path: "/fixtures",  priority: 0.8, changeFrequency: "daily" },
  { path: "/bracket",   priority: 0.8, changeFrequency: "hourly" },
  { path: "/results",   priority: 0.7, changeFrequency: "daily" },
  { path: "/about",     priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact",   priority: 0.5, changeFrequency: "monthly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
