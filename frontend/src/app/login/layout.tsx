import type { Metadata } from "next"

// The login page itself is a client component and cannot export metadata,
// so the route's layout carries it.
export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to the PLAYORA team portal or admin console to manage your tournament.",
  robots: { index: false, follow: false },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
