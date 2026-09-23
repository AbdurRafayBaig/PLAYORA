import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "PLAYORA — Sports Tournament Management Portal",
    template: "%s | PLAYORA",
  },
  description:
    "PLAYORA is a complete sports tournament operations platform for managing teams, fixtures, live matches, standings, and progression. Built for Sports Society Ludo tournaments.",
  keywords: [
    "tournament management",
    "sports portal",
    "ludo tournament",
    "match tracking",
    "standings",
    "fixtures",
    "PLAYORA",
  ],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "PLAYORA — Sports Tournament Management Portal",
    description:
      "Complete tournament operations platform for teams, fixtures, live matches, and standings.",
    type: "website",
    siteName: "PLAYORA",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
