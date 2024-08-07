import type { Metadata } from "next"
import type { PropsWithChildren } from "react"

import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { CvDataStoreProvider } from "@/components/providers/cv-data-store-provider"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from "@/config/site"
import { fontDisplay, fontSans } from "@/lib/fonts"
import MainContainer from "../components/main-container"
import { GridBackground } from "@/components/grid-background"
import { cn } from "@/lib/utils"
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
          "flex min-h-[100dvh] flex-col bg-background font-sans text-foreground antialiased",
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="theme"
          // enableSystem
          disableTransitionOnChange
        >
          <CvDataStoreProvider>
            <Navbar />
            <MainContainer>{children}</MainContainer>
            <Footer />
            <Toaster />
          </CvDataStoreProvider>
        </ThemeProvider>
        <SpeedInsights />
        <GridBackground />
      </body>
    </html>
  )
}
