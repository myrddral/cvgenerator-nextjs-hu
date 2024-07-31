import type { RouteParamType } from "@/form-generator/generator-sections"

import { FormStepCard } from "@/components/ui/formstep-card"
import FormGenerator from "@/form-generator/form-generator"
import { sectionMap } from "@/form-generator/generator-sections"

export async function generateStaticParams() {
  return Array.from(sectionMap.keys()).map((routeParam) => ({
    section: routeParam,
  }))
}

// Helper function to type guard
function isRouteParamType(value: any): value is RouteParamType {
  return sectionMap.has(value as RouteParamType)
}

export default function SectionPage({ params }: { params: { section: string } }) {
  // Ensure params.section is a RouteParamType
  const section = (isRouteParamType(params.section) ? params.section : "") as RouteParamType

  if (!section) return null

  // Get the current section object. Non-null assertion is safe here because we've already checked if the section is valid
  const sectionObject = sectionMap.get(section)!
  return (
    <FormStepCard title={sectionObject?.title} sub={sectionObject?.sub} className="mb-8">
      <FormGenerator {...sectionObject} />
    </FormStepCard>
  )
}
