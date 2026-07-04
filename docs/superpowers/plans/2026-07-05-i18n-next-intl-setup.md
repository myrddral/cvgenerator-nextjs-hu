# next-intl Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up next-intl so the app is routed under `/en` and `/hu`, with a locale switcher in the navbar. Replacing hardcoded UI strings is a separate follow-up — this plan only builds the infra and fixes the two places that already have locale-aware logic (`config/site.ts`, `template001.tsx`).

**Architecture:** Standard next-intl App Router setup: `middleware.ts` negotiates/redirects locale, all routes move under `app/[locale]/`, `app/[locale]/layout.tsx` becomes the root layout (wraps in `NextIntlClientProvider`). `messages/en.json` / `messages/hu.json` hold message keys — only what's needed for the new `LocaleSwitcher` component, per the design spec's scope cut. `app/global-error.tsx` stays at the true root (Next.js requirement — it must render outside any layout that could itself fail).

**Tech Stack:** next-intl (App Router, middleware-based routing), existing Radix `Select` primitive for the switcher UI.

## Global Constraints

- Locales: `["en", "hu"]`, default `"en"` (spec: 2026-07-05-i18n-next-intl-setup-design.md).
- URL-based routing via next-intl middleware — no cookie-only/client-only switching.
- Keep `components/cv-templates/translations.ts`'s plain-object pattern for react-pdf content; do not attempt `NextIntlClientProvider`/`useTranslations` inside the PDF render tree.
- Package manager is `bun` (see `package.json` scripts, `bun.lock`).
- Out of scope: replacing hardcoded strings elsewhere in the app, and the `date-fns` `hu` locale in `form-generator/field-factory-wrapper.tsx`.

---

### Task 1: Routing infra — install next-intl, add config, move routes under `app/[locale]/`

**Files:**
- Modify: `package.json` (add `next-intl` dependency)
- Modify: `next.config.ts` (wrap config with `createNextIntlPlugin`)
- Create: `middleware.ts`
- Create: `i18n/routing.ts`
- Create: `i18n/navigation.ts`
- Create: `i18n/request.ts`
- Create: `messages/en.json`
- Create: `messages/hu.json`
- Move: `app/layout.tsx` → `app/[locale]/layout.tsx` (modified)
- Move: `app/page.tsx` → `app/[locale]/page.tsx`
- Move: `app/page.test.tsx` → `app/[locale]/page.test.tsx`
- Move: `app/loading.tsx` → `app/[locale]/loading.tsx`
- Move: `app/not-found.tsx` → `app/[locale]/not-found.tsx`
- Move: `app/privacy/page.tsx` → `app/[locale]/privacy/page.tsx`
- Move: `app/terms/page.tsx` → `app/[locale]/terms/page.tsx`
- Move: `app/attribution/page.tsx` → `app/[locale]/attribution/page.tsx`
- Move: `app/show/page.tsx` → `app/[locale]/show/page.tsx`
- Move: `app/show/error.tsx` → `app/[locale]/show/error.tsx`
- Move: `app/create/page.tsx` → `app/[locale]/create/page.tsx`
- Move: `app/create/layout.tsx` → `app/[locale]/create/layout.tsx`
- Move: `app/create/error.tsx` → `app/[locale]/create/error.tsx`
- Move: `app/create/[section]/page.tsx` → `app/[locale]/create/[section]/page.tsx`
- Move: `app/dev/components-list/page.tsx` → `app/[locale]/dev/components-list/page.tsx`
- Unchanged (stay at true root): `app/global-error.tsx`, `app/globals.css`, `app/favicon.ico`
- Modify: `config/site.ts` (drop `locale` and `htmlLang` fields — computed inline in the new layout instead)

**Interfaces:**
- Produces: `routing` export (`{ locales: ["en", "hu"], defaultLocale: "en" }`) from `i18n/routing.ts`, consumed by `middleware.ts`, `i18n/navigation.ts`, `i18n/request.ts`, and Task 3's `LocaleSwitcher`.
- Produces: `Link`, `usePathname`, `useRouter` from `i18n/navigation.ts` (locale-aware wrappers), consumed by Task 3.
- Produces: `app/[locale]/layout.tsx` accepting `params: Promise<{ locale: string }>`, rendering `<html lang={locale}>` and wrapping children in `NextIntlClientProvider`.

- [ ] **Step 1: Install next-intl**

Run: `bun add next-intl`
Expected: `next-intl` added to `dependencies` in `package.json` and `bun.lock` updated.

- [ ] **Step 2: Create routing config**

`i18n/routing.ts`:
```ts
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "hu"],
  defaultLocale: "en",
})
```

- [ ] **Step 3: Create locale-aware navigation helpers**

`i18n/navigation.ts`:
```ts
import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
```

- [ ] **Step 4: Create request config**

`i18n/request.ts`:
```ts
import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 5: Create message files**

`messages/en.json`:
```json
{
  "LocaleSwitcher": {
    "label": "Switch language"
  }
}
```

`messages/hu.json`:
```json
{
  "LocaleSwitcher": {
    "label": "Nyelv váltása"
  }
}
```

- [ ] **Step 6: Create middleware**

`middleware.ts` (project root, alongside `next.config.ts`):
```ts
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
```

- [ ] **Step 7: Wire next-intl plugin into next.config.ts**

Modify `next.config.ts`:
```ts
import type { NextConfig } from 'next'
import withBundleAnalyzer from "@next/bundle-analyzer"
import createNextIntlPlugin from "next-intl/plugin"

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
})

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  turbopack: {
    // ...
  },
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
}

export default withNextIntl(bundleAnalyzer(nextConfig))
```

- [ ] **Step 8: Move all routes under `app/[locale]/`**

```bash
mkdir -p "app/[locale]"
git mv app/layout.tsx "app/[locale]/layout.tsx"
git mv app/page.tsx "app/[locale]/page.tsx"
git mv app/page.test.tsx "app/[locale]/page.test.tsx"
git mv app/loading.tsx "app/[locale]/loading.tsx"
git mv app/not-found.tsx "app/[locale]/not-found.tsx"
git mv app/privacy "app/[locale]/privacy"
git mv app/terms "app/[locale]/terms"
git mv app/attribution "app/[locale]/attribution"
git mv app/show "app/[locale]/show"
git mv app/create "app/[locale]/create"
git mv app/dev "app/[locale]/dev"
```

`app/global-error.tsx`, `app/globals.css`, and `app/favicon.ico` are NOT moved — they must stay at the true root.

- [ ] **Step 9: Update `app/[locale]/layout.tsx` for async locale params + NextIntlClientProvider**

Replace the file's content:
```tsx
import type { Metadata } from "next"
import type { PropsWithChildren } from "react"

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/providers/theme-provider"
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

  return {
    title: {
      default: siteConfig.name,
      template: `%s - ${siteConfig.name}`,
    },
    metadataBase: new URL(siteConfig.url),
    description: siteConfig.description,
    openGraph: {
      type: "website",
      locale: locale === "hu" ? "hu_HU" : "en_US",
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
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-[100dvh] flex-col bg-background font-sans text-foreground antialiased",
          fontSans.variable
        )}
      >
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
        <SpeedInsights />
        <Analytics />
        <GridBackground />
      </body>
    </html>
  )
}
```

- [ ] **Step 10: Remove now-unused fields from `config/site.ts`**

```ts
export const siteConfig = {
  name: "cv/gen - Önéletrajz Generátor",
  description: "Generálj egyszerűen és gyorsan, ízlésesen formázott önéletrajzot!",
  url: "https://cvgenerator-nextjs-hu.vercel.app",
  creator: "Attila Béli - https://www.attilabeli.com",
  ogImage: "/cv_gen_og_image_light.webp",
}

export type SiteConfig = typeof siteConfig
```

- [ ] **Step 11: Update jest moduleNameMapper for the new app subpath (if needed) and run full test suite**

Run: `bun run test:ci`
Expected: PASS (no test currently exercises `app/[locale]/page.tsx` beyond the commented-out suite in `page.test.tsx`, so this should be a clean pass with 0 or skip-only results). If jest fails to resolve `@/app/*` imports, add `"^@/app/(.*)$": "<rootDir>/app/$1"` is already broad enough since it maps `@/app/*` to `<rootDir>/app/*` regardless of the `[locale]` segment inside — no mapper change should be required.

- [ ] **Step 12: Typecheck and build**

Run: `bun run typecheck && bun run build`
Expected: both PASS with no errors. Build output should show routes prefixed under `/en` and `/hu` (e.g. `/en`, `/hu`, `/en/show`, `/hu/show`, etc.) plus the standalone `/_not-found`.

- [ ] **Step 13: Manual verification**

Run: `bun run dev`, then in another terminal:
```bash
curl -sI http://localhost:3000/ | head -5
curl -sI http://localhost:3000/en | head -5
curl -sI http://localhost:3000/hu/show | head -5
```
Expected: `/` returns a 307/308 redirect to `/en` (or `/hu` depending on `Accept-Language`), `/en` and `/hu/show` return 200.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: route app under [locale] via next-intl middleware"
```

---

### Task 2: Wire locale into `config/site.ts`-adjacent logic and the PDF template

**Files:**
- Modify: `app/[locale]/show/page.tsx`
- Modify: `components/cv-templates/template001.tsx:28-33`

**Interfaces:**
- Consumes: `routing.locales` type from Task 1's `i18n/routing.ts` (for the locale param type).
- Produces: `Template001` now takes a `locale: "hu" | "en"` prop instead of hardcoding it — no other task depends on this, it's the last hardcoded-locale spot flagged in the design spec.

- [ ] **Step 1: Make `Template001` accept `locale` as a prop**

In `components/cv-templates/template001.tsx`, replace:
```tsx
export const Template001 = ({ cvData }: { cvData: CvDataState }) => {
  const locale: "hu" | "en" = "hu"
```
with:
```tsx
export const Template001 = ({
  cvData,
  locale,
}: {
  cvData: CvDataState
  locale: "hu" | "en"
}) => {
```

- [ ] **Step 2: Pass the URL locale through from the show page**

In `app/[locale]/show/page.tsx`, the component currently hardcodes `"hu"` in two places (`generateDocTitle` call and would now also need to pass to `Template001`). Read the locale from the route params and thread it through:

Note: `"use client"` pages in Next.js App Router still receive `params` as a Promise as of Next 16 — since this is a Client Component, `params` cannot be awaited directly in the function body; resolve it in a `useEffect` + `.then()` after mount instead.

Replace the full contents of `app/[locale]/show/page.tsx` with:

```tsx
"use client"
import type { CvDataState } from "@/lib/stores/cv-data-store.types"

import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/loader"
import { useCvDataStore, useCvDataStoreApi } from "@/providers/cv-data-store-provider"
import dynamic from "next/dynamic"
import { type ComponentType, type ReactElement, type ReactNode, useEffect, useState } from "react"
import { generateDocTitle } from "@/lib/utils"
// import { useAsyncErrors } from "@/hooks/use-async-errors"

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <Loader orientation="vertical" size="lg" text="Betöltés..." />,
})

type PDFDownloadLinkRenderProps = {
  loading: boolean
  error: Error | null
}

const PDFDownloadLinkUntyped = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
  ssr: false,
})

const PDFDownloadLink = PDFDownloadLinkUntyped as unknown as ComponentType<{
  document: ReactElement
  fileName?: string
  children: (params: PDFDownloadLinkRenderProps) => ReactNode
}>

interface DownloadButtonProps {
  Document: ({ cvData, locale }: { cvData: CvDataState; locale: "hu" | "en" }) => ReactElement
  cvData: CvDataState
  fileName: string
  locale: "hu" | "en"
}

const DownloadButton = ({ Document, cvData, fileName, locale }: DownloadButtonProps) => (
  <PDFDownloadLink document={<Document cvData={cvData} locale={locale} />} fileName={`${fileName}.pdf`}>
    {({ loading, error }) => {
      if (error) {
        console.error(error)
        return <div>Hiba történt a letöltés során</div>
      }
      return (
        <Button size={"lg"} variant={"default"} className="mb-1.5 w-44">
          {loading ? <Loader size="icon" /> : "PDF letöltése"}
        </Button>
      )
    }}
  </PDFDownloadLink>
)

export default function ShowPdfPage({ params }: { params: Promise<{ locale: "hu" | "en" }> }) {
  const cvData = useCvDataStore((state) => state)
  const cvDataStoreApi = useCvDataStoreApi()
  const [isHydrated, setIsHydrated] = useState(() => cvDataStoreApi.persist?.hasHydrated() ?? false)
  const [pdfResult, setPdfResult] = useState<React.ReactNode | null>(null)
  const [locale, setLocale] = useState<"hu" | "en">("hu")
  const isMobileDevice = () => window.innerWidth < 400
  // const { throwAsyncError } = useAsyncErrors()

  useEffect(() => {
    params.then((p) => setLocale(p.locale))
  }, [params])

  // the store hydrates from sessionStorage asynchronously, so building the PDF
  // before hydration finishes would render it once with empty data and then
  // again with the real data - react-pdf's internal renderer can't handle
  // updating an already-mounted document with a drastically different shape.
  // isHydrated is initialized lazily from hasHydrated() (a plain flag read, no
  // sessionStorage access) so this effect only needs to subscribe for the
  // not-yet-hydrated case, avoiding a synchronous setState-in-effect.
  // persist is undefined during server-side prerendering, since sessionStorage
  // isn't a global there and zustand skips wiring up persist without storage.
  useEffect(() => {
    if (isHydrated) return

    return cvDataStoreApi.persist?.onFinishHydration(() => setIsHydrated(true))
  }, [cvDataStoreApi, isHydrated])

  useEffect(() => {
    if (!isHydrated) return

    const loadTemplateWithData = async () => {
      const templateModule = await import("@/components/cv-templates/template001")
      const Template001 = templateModule.Template001
      const fileName = generateDocTitle(cvData.personal.firstName, cvData.personal.lastName, locale)

      // displaying the pdf viewer on mobile devices is not supported - it will be displayed as a download button for now
      setPdfResult(
        isMobileDevice() ? (
          <DownloadButton Document={Template001} cvData={cvData} fileName={fileName} locale={locale} />
        ) : (
          <PDFViewer width="100%" height="100%" className="flex-1">
            <Template001 cvData={cvData} locale={locale} />
          </PDFViewer>
        )
      )
    }

    loadTemplateWithData()
  }, [cvData, isHydrated, locale])

  return pdfResult ? (
    <div className="flex-center w-full max-w-screen-lg flex-1 overflow-clip rounded-lg">
      {isMobileDevice() ? (
        <>
          <h3 className="mb-8 text-center text-3xl font-bold leading-none tracking-wider text-shadow-lg">
            Elkészült az önéletrajzod!
          </h3>
          <p className="mb-4 text-center text-shadow-lg">A letöltéshez kattints az alábbi gombra</p>
        </>
      ) : null}
      {pdfResult}
    </div>
  ) : (
    <Loader orientation="vertical" size="lg" text="Önéletrajz generálása..." />
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `bun run typecheck`
Expected: PASS, no type errors in `template001.tsx` or `show/page.tsx`.

- [ ] **Step 4: Manual verification**

Run: `bun run dev`, visit `http://localhost:3000/hu/show` and `http://localhost:3000/en/show` with some CV data filled in (via `/create`). Confirm the PDF preview loads in both, and the downloaded filename's date formatting matches the route's locale (inspect via the existing commented-out behavior in `generateDocTitle`/`formatDate` — hu uses `.` date separators, en uses month names, per `lib/utils.ts`).

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/show/page.tsx components/cv-templates/template001.tsx
git commit -m "feat: derive PDF template locale from the URL instead of hardcoding hu"
```

---

### Task 3: Locale switcher in the navbar

**Files:**
- Create: `components/locale-switcher.tsx`
- Create: `components/locale-switcher.test.tsx`
- Modify: `components/navbar.tsx`

**Interfaces:**
- Consumes: `Link`/`usePathname`/`useRouter` from `i18n/navigation.ts` (Task 1), `routing.locales` from `i18n/routing.ts` (Task 1), `useLocale` and `useTranslations` from `next-intl`.
- Produces: `LocaleSwitcher` default export, a client component with no required props — consumed only by `components/navbar.tsx`.

- [ ] **Step 1: Write the failing test**

`components/locale-switcher.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const push = jest.fn()

jest.mock("next-intl", () => ({
  useLocale: () => "en",
}))

jest.mock("@/i18n/navigation", () => ({
  usePathname: () => "/show",
  useRouter: () => ({ push }),
}))

import LocaleSwitcher from "./locale-switcher"

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    push.mockClear()
  })

  test("renders the current locale", () => {
    render(<LocaleSwitcher />)
    expect(screen.getByRole("combobox")).toHaveTextContent("EN")
  })

  test("navigates to the same path with the new locale on selection", async () => {
    render(<LocaleSwitcher />)
    await userEvent.click(screen.getByRole("combobox"))
    await userEvent.click(screen.getByRole("option", { name: "HU" }))
    expect(push).toHaveBeenCalledWith("/show", { locale: "hu" })
  })
})
```

Check if `@testing-library/user-event` is installed:
Run: `grep user-event package.json`
Expected: if absent, install it first with `bun add -D @testing-library/user-event` before running the test.

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test -- components/locale-switcher.test.tsx`
Expected: FAIL — `Cannot find module './locale-switcher'`.

- [ ] **Step 3: Implement `LocaleSwitcher`**

`components/locale-switcher.tsx`:
```tsx
"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const localeLabels: Record<(typeof routing.locales)[number], string> = {
  en: "EN",
  hu: "HU",
}

export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Select
      value={locale}
      onValueChange={(nextLocale) => {
        router.push(pathname, { locale: nextLocale as (typeof routing.locales)[number] })
      }}
    >
      <SelectTrigger className="w-16" aria-label="Switch language">
        <SelectValue>{localeLabels[locale as (typeof routing.locales)[number]]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((l) => (
          <SelectItem key={l} value={l}>
            {localeLabels[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test -- components/locale-switcher.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Add the switcher to the navbar**

Modify `components/navbar.tsx`:
```tsx
import NavbarNavitems from "./navbar-navitems"
import { ModeToggle } from "./mode-toggle"
import LocaleSwitcher from "./locale-switcher"
import Link from "next/link"
import Logo from "./ui/logo"

export default function Navbar() {
  return (
    <header className="pos-center container fixed z-10 flex h-navbar items-center justify-between gap-4 shadow-inner outline outline-1 outline-muted brightness-75 backdrop-blur 2xl:rounded-b-lg">
      <Link href="/" className="w-28">
        <Logo />
      </Link>
      <div className="flex items-center gap-2">
        <NavbarNavitems />
        <LocaleSwitcher />
        {process.env.NODE_ENV === "development" ? <ModeToggle /> : null}
      </div>
    </header>
  )
}
```

- [ ] **Step 6: Run full test suite**

Run: `bun run test:ci`
Expected: PASS.

- [ ] **Step 7: Typecheck and build**

Run: `bun run typecheck && bun run build`
Expected: both PASS.

- [ ] **Step 8: Manual verification**

Run: `bun run dev`, visit `http://localhost:3000/en`, click the language switcher in the navbar, select HU. Confirm the URL changes to `/hu` (preserving the rest of the path if navigating from a subpage like `/en/show` → `/hu/show`) and the page still renders.

- [ ] **Step 9: Commit**

```bash
git add components/locale-switcher.tsx components/locale-switcher.test.tsx components/navbar.tsx
git commit -m "feat: add locale switcher to navbar"
```
