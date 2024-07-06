"use client"

import { useCvDataStore } from "@/lib/stores/cv-data-store"
import { Template001 } from "@/components/cv-templates/template001"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
})

export default function ShowPdfPage() {
  const { personal, skills, experience, education, languages, passions } = useCvDataStore()
  const [renderPDF, setRenderPDF] = useState<React.ReactNode | null>(null)

  useEffect(() => {
    const cvData = { personal, skills, experience, education, languages, passions }
    setRenderPDF(
      <PDFViewer width="100%" height="100%" className="h-screen">
        <Template001 cvData={cvData} />
      </PDFViewer>
    )
  }, [education, experience, languages, passions, personal, skills])

  return (
    <main className="flex h-[calc(100vh-var(--navbar-height)-var(--footer-min-height))] flex-col items-center justify-center">
      {renderPDF}
    </main>
  )
}
