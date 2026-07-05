"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export interface ErrorDisplayProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function DisplayClientError({ error, reset }: ErrorDisplayProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const handleOpenDetails = () => setDetailsOpen(true)
  const handleErrorRecovery = () => reset()
  const t = useTranslations("ErrorPage")

  return (
    <Card className="max-sm:max-w-screen-xs max-h-[calc(100dvh-25dvh)] min-w-80 bg-transparent/30 max-md:max-w-screen-md lg:max-w-screen-lg">
      <CardHeader className="md:p-12 md:pb-4">
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col pt-0 md:p-12">
        <p className="mb-8">{t("description")}</p>
        {detailsOpen ? (
          <>
            <p>{t("detailsHeading")}</p>
            <pre className="mt-2 max-h-72 overflow-scroll rounded-lg bg-black p-4 text-xs">
              <p>message: {error.message}</p>
              <p>digest: {error.digest || "-"}</p>
              <p>stack: {error.stack}</p>
            </pre>
          </>
        ) : null}
        <div className="mt-8 flex justify-between">
          <Button onClick={handleErrorRecovery}>{t("back")}</Button>
          <Button onClick={handleOpenDetails} variant={"outline"}>
            {t("details")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
