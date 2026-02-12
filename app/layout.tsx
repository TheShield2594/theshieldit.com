import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Script from "next/script"
import "./globals.css"

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: "The Shield IT - Free Online IT & Privacy Tools",
  description:
    "Free online tools for IT and privacy: QR code generator, password strength tester, privacy tools, and more. No sign-up required. All tools run in your browser.",
  keywords:
    "IT tools, QR code generator, password strength tester, privacy tools, online tools, free tools, developer tools, security tools",
  authors: [{ name: "Brandon Shields" }],
  openGraph: {
    type: "website",
    url: "https://theshieldit.com/",
    title: "The Shield IT - Free Online IT & Privacy Tools",
    description:
      "Free online tools for IT and privacy. QR codes, password testing, and more. No sign-up, runs in your browser.",
    siteName: "The Shield IT",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Shield IT - Free Online IT & Privacy Tools",
    description:
      "Free online tools for IT and privacy. QR codes, password testing, and more. No sign-up, runs in your browser.",
  },
}

export const viewport: Viewport = {
  themeColor: "#060a12",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-dvh`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        {children}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="f727bfa2-17ee-4141-82d3-a9b15d813fb6"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
