import type { RouteParamType } from "@/form-generator/form-generator.types"

import { sectionMap } from "@/form-generator/generator-sections"
import NotFound from "@/app/not-found"
import { SectionWrapper } from "@/components/section-wrapper"

export async function generateStaticParams() {
  return Array.from(sectionMap.keys()).map((routeParam) => ({
    section: routeParam,
  }))
}

// Helper function to type guard
function isRouteParamType(value: string): value is RouteParamType {
  return sectionMap.has(value as RouteParamType)
}

export default function SectionPage({ params }: { params: { section: string } }) {
  // Ensure params.section is a RouteParamType
  const sectionName = (isRouteParamType(params.section) ? params.section : "") as RouteParamType

  if (!sectionName) return <NotFound />

  // Get the current section object's props. Non-null assertion is safe here because we've already checked if the section is valid
  const { fields, isMultiEntry, title, sub } = sectionMap.get(sectionName)!

  return (
    <SectionWrapper
      sectionName={sectionName}
      isMultiEntry={isMultiEntry}
      fields={fields}
      title={title}
      sub={sub}
    />
  )
}
