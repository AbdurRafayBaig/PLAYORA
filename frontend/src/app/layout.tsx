import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { TournamentProvider } from "@/lib/tournament/store"
import { BRAND, SITE_URL } from "@/lib/constants"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "PLAYORA runs a single-elimination Ludo tournament end to end: team registration and logins, the knockout draw, table and kickoff assignment, live matches and the bracket.",
  applicationName: BRAND.name,
  keywords: [
    "tournament management",
    "sports portal",
    "ludo tournament",
    "match tracking",
    "live scores",
    "knockout bracket",
    "fixtures",
    "PLAYORA",
  ],
  authors: [{ name: "Abdur Rafay Baig", url: "https://www.linkedin.com/in/irafaybaig/" }],
  creator: "Abdur Rafay Baig",
  publisher: "Tynovate",
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "Follow live matches, fixtures, the knockout bracket and results for the Ludo Championship — all in one tournament portal.",
    type: "website",
    siteName: BRAND.name,
    locale: "en_PK",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${BRAND.name} — ${BRAND.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "Follow live matches, fixtures, the knockout bracket and results for the Ludo Championship.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Pinch-to-zoom stays available: capping it is an accessibility failure for
  // anyone who needs to magnify a score or a fixture time.
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF8EC" },
    { media: "(prefers-color-scheme: dark)", color: "#140B1F" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <TournamentProvider>{children}</TournamentProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
