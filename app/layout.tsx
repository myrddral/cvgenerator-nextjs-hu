import type { Metadata } from "next"
import type { PropsWithChildren } from "react"

import { fontDisplay, fontMono, fontSans } from "@/lib/fonts"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: "noindex, nofollow",
  authors: [
    {
      name: "Attila Béli",
      url: "https://github.com/myrddral",
    },
  ],
  creator: "Attila Béli",
}

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang={siteConfig.htmlLang} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen max-w-screen-2xl mx-auto bg-background pt-16 font-sans text-foreground antialiased",
          fontSans.variable,
          fontDisplay.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="theme"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
