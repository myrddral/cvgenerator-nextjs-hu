"use client"
import type { RouteParamType } from "@/form-generator/form-generator.types"

import { routeParams } from "@/form-generator/generator-sections"
import { useRouter } from "@/i18n/navigation"
import { useCvId } from "./use-cv-id"

/**
 * This hook is used to navigate between sections in the form.
 * It handles the forward and backward navigation based on the current route parameter,
 * carrying the `?cv=` query param along on every navigation.
 *
 * @param routeParam - The current route parameter.
 * @returns An object with two functions: handleForwardStep and handleBackStep.
 */
export const useFormNavigation = (routeParam: RouteParamType) => {
  const router = useRouter()
  const cvId = useCvId()
  const suffix = cvId ? `?cv=${cvId}` : ""

  const handleForwardStep = () => {
    const nextSectionIndex = routeParams.indexOf(routeParam) + 1
    const nextSection = routeParams[nextSectionIndex]
    if (nextSection) {
      router.push(`/create/${nextSection}${suffix}`)
    } else router.push(`/show${suffix}`)
  }

  const handleBackStep = () => {
    const prevSectionIndex = routeParams.indexOf(routeParam) - 1
    const prevSection = routeParams[prevSectionIndex]
    if (prevSection) {
      router.push(`/create/${prevSection}${suffix}`)
    } else router.push(`/create/email${suffix}`)
  }

  return { handleForwardStep, handleBackStep }
}
