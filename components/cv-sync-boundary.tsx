"use client"
import type { PropsWithChildren } from "react"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useEffect, useRef } from "react"
import { useRouter } from "@/i18n/navigation"
import { useCvId } from "@/hooks/use-cv-id"
import { useCvDataStoreApi } from "@/providers/cv-data-store-provider"
import type { Id } from "@/convex/_generated/dataModel"
import {
  deserializePersonal,
  deserializeExperienceList,
  deserializeEducationList,
} from "@/lib/cv-sync"

export function CvSyncBoundary({ children }: PropsWithChildren) {
  const router = useRouter()
  const cvId = useCvId()
  const cv = useQuery(api.cvs.get, cvId ? { cvId: cvId as Id<"cvs"> } : "skip")
  const storeApi = useCvDataStoreApi()
  const hydratedForCvId = useRef<string | null>(null)

  useEffect(() => {
    if (!cvId) {
      router.replace("/cvs")
    }
  }, [cvId, router])

  useEffect(() => {
    if (!cv || !cvId || hydratedForCvId.current === cvId) return
    hydratedForCvId.current = cvId

    storeApi.setState({
      personal: deserializePersonal(cv.personal, cv.pictureUrl),
      links: {
        linkedin: cv.links?.linkedin ?? "",
        github: cv.links?.github ?? "",
        portfolio: cv.links?.portfolio ?? "",
        webpage: cv.links?.webpage ?? "",
      },
      skills: cv.skills ?? { occupation: "", skillsList: "" },
      experience: deserializeExperienceList(cv.experience),
      education: deserializeEducationList(cv.education),
      languages: cv.languages ?? [],
      interests: cv.interests ?? { interestsList: "" },
      completedSections: cv.completedSections,
    })
  }, [cv, cvId, storeApi])

  return children
}
