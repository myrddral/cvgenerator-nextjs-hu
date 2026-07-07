import type { Metadata } from "next"
import type { PropsWithChildren } from "react"

// import { SpeedInsights } from "@vercel/speed-insights/next"
// import { Analytics } from "@vercel/analytics/react"
import { NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { ThemeProvider } from "@/providers/theme-provider"
import { ConvexClientProvider } from "@/providers/convex-client-provider"
import { CvDataStoreProvider } from "@/providers/cv-data-store-provider"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import MainContainer from "../../components/main-container"
import { GridBackground } from "@/components/grid-background"
import { cn } from "@/lib/utils"
import { routing } from "@/i18n/routing"
import "../globals.css"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  const name = t("name")
  const description = t("description")

  return {
    title: {
      default: name,
      template: `%s - ${name}`,
    },
    metadataBase: new URL(siteConfig.url),
    description,
    openGraph: {
      type: "website",
      locale: locale === "hu" ? "hu_HU" : "en_US",
      url: siteConfig.url,
      title: name,
      description,
      siteName: name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
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
}

export default async function RootLayout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <ConvexAuthNextjsServerProvider>
      <html lang={locale} suppressHydrationWarning>
        <body
          className={cn(
            "flex min-h-[100dvh] flex-col bg-background font-sans text-foreground antialiased",
            fontSans.variable
          )}
        >
          <ConvexClientProvider>
            <NextIntlClientProvider>
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
            </NextIntlClientProvider>
          </ConvexClientProvider>
          {/* <SpeedInsights /> */}
          {/* <Analytics /> */}
          <GridBackground />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
