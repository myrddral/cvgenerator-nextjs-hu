"use client"
import type { RouteParamType } from "@/form-generator/generator-sections"

import { routeParams } from "@/form-generator/generator-sections"
import { useRouter } from "next/navigation"

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