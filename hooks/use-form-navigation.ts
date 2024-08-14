"use client"
import type { RouteParamType } from "@/form-generator/form-generator.types"

import { routeParams } from "@/form-generator/generator-sections"
import { useRouter } from "next/navigation"

/*
 * This hook is used to navigate between sections in the form.
 * It handles the forward and backward navigation based on the current route parameter.
 *
 * @param routeParam - The current route parameter.
 * @returns An object with two functions: handleForwardStep and handleBackStep.
 */
export const useFormNavigation = (routeParam: RouteParamType) => {
  const router = useRouter()

  const handleForwardStep = () => {
    const nextSectionIndex = routeParams.indexOf(routeParam) + 1
    const nextSection = routeParams[nextSectionIndex]
    if (nextSection) {
      router.push(`/create/${nextSection}`)
    } else router.push("/show")
  }

  const handleBackStep = () => {
    const prevSectionIndex = routeParams.indexOf(routeParam) - 1
    const prevSection = routeParams[prevSectionIndex]
    if (prevSection) {
      router.push(`/create/${prevSection}`)
    } else router.push("/create/email")
  }

  return { handleForwardStep, handleBackStep }
}
