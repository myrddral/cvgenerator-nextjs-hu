"use client"
import { useCvDataStore } from "@/lib/stores/cv-data-store"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useAsyncErrors } from "@/hooks/use-async-errors"

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
})

export default function ShowPdfPage() {
  const cvData = useCvDataStore()
  const [renderPDF, setRenderPDF] = useState<React.ReactNode | null>(null)
  const { throwAsyncError } = useAsyncErrors()

  useEffect(() => {
    const loadTemplateWithData = async () => {
      const templateModule = await import("@/components/cv-templates/template001")
      const Template001 = templateModule.Template001

      const { personal } = cvData
      if (!personal.email) {
        //TODO: Check wether its necessary to improve error handling for this case
        throwAsyncError("Nem lehet legenerálni a PDF dokumentumot, mert az adatok hiányosak/sérültek!")
      }

      setRenderPDF(
        <PDFViewer width="100%" height="100%" className="h-screen">
          <Template001 cvData={cvData} />
        </PDFViewer>
      )
    }

    loadTemplateWithData()
  }, [cvData, throwAsyncError])

  return (
    <main className="flex h-[calc(100vh-var(--navbar-height)-var(--footer-min-height))] flex-col items-center justify-center">
      {renderPDF}
    </main>
  )
}
