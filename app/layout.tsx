import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { QuickAccessFab } from "@/components/quick-access-fab"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Daily Goals - Achieve More Every Day",
  description: "Set, track, and achieve your daily goals with AI-powered insights and beautiful analytics.",
  keywords: ["goals", "productivity", "daily goals", "task management", "achievement"],
  authors: [{ name: "Daily Goals Team" }],
  creator: "Daily Goals",
  publisher: "Daily Goals",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Daily Goals - Achieve More Every Day",
    description: "Set, track, and achieve your daily goals with AI-powered insights and beautiful analytics.",
    url: "/",
    siteName: "Daily Goals",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/landing-hero.webp",
        width: 1200,
        height: 630,
        alt: "Daily Goals - Achieve More Every Day",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Goals - Achieve More Every Day",
    description: "Set, track, and achieve your daily goals with AI-powered insights and beautiful analytics.",
    images: ["/images/landing-hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <QuickAccessFab />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
