"use client"
import type { CvDataState } from "@/lib/stores/cv-data-store.types"

import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/loader"
import { useCvDataStore } from "@/providers/cv-data-store-provider"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { generateDocTitle } from "@/lib/utils"
// import { useAsyncErrors } from "@/hooks/use-async-errors"

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <Loader orientation="vertical" size="lg" text="Betöltés..." />,
})

const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
  ssr: false,
})

interface DownloadButtonProps {
  Document: ({ cvData }: { cvData: CvDataState }) => JSX.Element
  cvData: CvDataState
  fileName: string
}

const DownloadButton = ({ Document, cvData, fileName }: DownloadButtonProps) => (
  <PDFDownloadLink document={<Document cvData={cvData} />} fileName={`${fileName}.pdf`}>
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

export default function ShowPdfPage() {
  const cvData = useCvDataStore((state) => state)
  const [pdfResult, setPdfResult] = useState<React.ReactNode | null>(null)
  const isMobileDevice = () => window.innerWidth < 400
  // const { throwAsyncError } = useAsyncErrors()

  useEffect(() => {
    const loadTemplateWithData = async () => {
      const templateModule = await import("@/components/cv-templates/template001")
      const Template001 = templateModule.Template001
      const fileName = generateDocTitle(cvData.personal.firstName, cvData.personal.lastName, "hu")

      // displaying the pdf viewer on mobile devices is not supported - it will be displayed as a download button for now
      setPdfResult(
        isMobileDevice() ? (
          <DownloadButton Document={Template001} cvData={cvData} fileName={fileName} />
        ) : (
          <PDFViewer width="100%" height="100%" className="flex-1">
            <Template001 cvData={cvData} />
          </PDFViewer>
        )
      )
    }

    loadTemplateWithData()
  }, [cvData])

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
