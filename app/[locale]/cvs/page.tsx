"use client"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { withCvParam } from "@/hooks/use-cv-id"
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/confirm-dialog"
import Image from "next/image"
import type { Id } from "@/convex/_generated/dataModel"

export default function CvsPage() {
  const t = useTranslations("CvsPage")
  const router = useRouter()
  const cvs = useQuery(api.cvs.list, {})
  const createCv = useMutation(api.cvs.create)
  const removeCv = useMutation(api.cvs.remove)

  async function handleNewCv() {
    const cvId = await createCv({})
    router.push(withCvParam("/create", cvId))
  }

  return (
    <div className="flex w-full max-w-screen-md flex-1 flex-col gap-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={() => void handleNewCv()}>{t("newCv")}</Button>
      </div>

      {cvs?.length === 0 ? <p className="text-muted-foreground">{t("empty")}</p> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cvs?.map((cv) => (
          <Card key={cv._id} className="p-4">
            <CardHeader className="flex-row items-center gap-4 p-0">
              <div className="relative h-16 w-16 shrink-0 overflow-clip rounded-md">
                <Image
                  src={cv.pictureUrl ?? "/vecteezy_profile_placeholder.jpg"}
                  alt={cv.title}
                  fill
                  sizes="4rem"
                />
              </div>
              <div>
                <CardTitle>{cv.title || t("untitled")}</CardTitle>
                <CardSubtitle>{t("updatedAt", { date: new Date(cv.updatedAt).toLocaleDateString() })}</CardSubtitle>
              </div>
            </CardHeader>
            <CardContent className="flex justify-end gap-2 p-0 pt-4">
              <ConfirmDialog type="delete" onConfirmAction={() => void removeCv({ cvId: cv._id as Id<"cvs"> })}>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </ConfirmDialog>
              <Button size="sm" onClick={() => router.push(withCvParam("/create/personal", cv._id))}>
                {t("continue")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
