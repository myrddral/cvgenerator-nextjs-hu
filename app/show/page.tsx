"use client"
import { useCvDataStore } from "@/lib/stores/cv-data-store"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useAsyncErrors } from "@/hooks/use-async-errors"
import Loader from "@/components/ui/loader"

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <Loader orientation="vertical" text="Betöltés..." size="lg" />,
})

export default function ShowPdfPage() {
  const cvData = useCvDataStore()
  const [renderPDF, setRenderPDF] = useState<React.ReactNode | null>(null)
  const { throwAsyncError } = useAsyncErrors()

  useEffect(() => {
    const loadTemplateWithData = async () => {
      const templateModule = await import("@/components/cv-templates/template001")
      const Template001 = templateModule.Template001

      setRenderPDF(
        <PDFViewer width="100%" height="100%" className="flex-1">
          <Template001 cvData={cvData} />
        </PDFViewer>
      )
    }

    loadTemplateWithData()
  }, [cvData, throwAsyncError])

  return renderPDF ? (
    <div className="flex w-full max-w-screen-lg flex-1 flex-col overflow-clip rounded-lg">{renderPDF}</div>
  ) : (
    <Loader orientation="vertical" text="Önéletrajz generálása..." size="lg" />
  )
}
