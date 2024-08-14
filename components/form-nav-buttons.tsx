"use client"
import type { RouteParamType } from "@/form-generator/form-generator.types"

import { useFormNavigation } from "@/hooks/use-form-navigation"
import { Button } from "./ui/button"

export function FormNavButtons({ routeParam }: { routeParam: RouteParamType }) {
  const { handleBackStep, handleForwardStep } = useFormNavigation(routeParam)
  return (
    <div className="mt-12 flex justify-center gap-10 max-sm:mt-8">
      <Button type="button" variant={"navPrev"} className="group relative px-10" onClick={handleBackStep}>
        Vissza
      </Button>
      <Button type="button" variant={"navNext"} className="group relative px-10" onClick={handleForwardStep}>
        Tovább
      </Button>
    </div>
  )
}
