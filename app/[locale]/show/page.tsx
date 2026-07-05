"use client"
import type { CvDataState } from "@/lib/stores/cv-data-store.types"

import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/loader"
import { useCvDataStore, useCvDataStoreApi } from "@/providers/cv-data-store-provider"
import dynamic from "next/dynamic"
import { type ComponentType, type ReactElement, type ReactNode, useEffect, useState } from "react"
import { generateDocTitle } from "@/lib/utils"
import { useTranslations } from "next-intl"
// import { useAsyncErrors } from "@/hooks/use-async-errors"

// dynamic()'s `loading` option is invoked outside this module's component tree, so
// useTranslations can't be called inline there - it needs its own component to call
// the hook from a proper render context.
function PdfViewerLoading() {
  const t = useTranslations("ShowPage")
  return <Loader orientation="vertical" size="lg" text={t("loading")} />
}

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <PdfViewerLoading />,
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

const DownloadButton = ({ Document, cvData, fileName, locale }: DownloadButtonProps) => {
  const t = useTranslations("ShowPage")

  return (
    <PDFDownloadLink document={<Document cvData={cvData} locale={locale} />} fileName={`${fileName}.pdf`}>
      {({ loading, error }) => {
        if (error) {
          console.error(error)
          return <div>{t("downloadError")}</div>
        }
        return (
          <Button size={"lg"} variant={"default"} className="mb-1.5 w-44">
            {loading ? <Loader size="icon" /> : t("downloadPdf")}
          </Button>
        )
      }}
    </PDFDownloadLink>
  )
}

export default function ShowPdfPage({ params }: { params: Promise<{ locale: "hu" | "en" }> }) {
  const t = useTranslations("ShowPage")
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
            {t("readyTitle")}
          </h3>
          <p className="mb-4 text-center text-shadow-lg">{t("readyDescription")}</p>
        </>
      ) : null}
      {pdfResult}
    </div>
  ) : (
    <Loader orientation="vertical" size="lg" text={t("generating")} />
  )
}
