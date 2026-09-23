import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/constants"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Signed-in surfaces: nothing to index, and no reason to leak the
        // shape of the admin console into search results.
        disallow: ["/admin", "/admin/", "/team", "/team/", "/login"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
