import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Next Chapter - Athlete Career Platform",
  description: "Help NCAA athletes translate their athletic experience into thriving corporate careers. The career platform built for the 98% who don't go pro.",
  keywords: ["NCAA athletes", "career transition", "athlete careers", "resume builder", "sports careers"],
  openGraph: {
    title: "Next Chapter - Athlete Career Platform",
    description: "You spent 4 years becoming elite. Now become undeniable.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
