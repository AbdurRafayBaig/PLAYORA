"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ReactNode } from "react"

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      // Follow the device by default. A hall full of phones on auto-dark
      // should not all be forced into a theme we picked for them.
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
