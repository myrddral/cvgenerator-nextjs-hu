import type { RouteParamType } from "@/form-generator/generator-sections"

import { FormStepCard } from "@/components/ui/formstep-card"
import FormGenerator from "@/form-generator/form-generator"
import { sectionMap } from "@/form-generator/generator-sections"
import NotFound from "@/app/not-found"

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
  const section = (isRouteParamType(params.section) ? params.section : "") as RouteParamType

  if (!section) return <NotFound />

  // Get the current section object's props. Non-null assertion is safe here because we've already checked if the section is valid
  const { fields, isMultiEntry, routeParam, title, sub } = sectionMap.get(section)!
  return (
    <FormStepCard title={title} sub={sub} className="mb-8">
      <FormGenerator fields={fields} routeParam={routeParam} isMultiEntry={isMultiEntry} />
    </FormStepCard>
  )
}
