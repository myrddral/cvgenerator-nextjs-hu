import type { RouteParamType } from "@/form-generator/form-generator.types"

import { getSectionMap, routeParams } from "@/form-generator/generator-sections"
import NotFound from "@/app/[locale]/not-found"
import { SectionWrapper } from "@/components/section-wrapper"
import { CvSyncBoundary } from "@/components/cv-sync-boundary"
import { getTranslations } from "next-intl/server"

export async function generateStaticParams() {
  return routeParams.map((routeParam) => ({
    section: routeParam,
  }))
}

// Helper function to type guard
function isRouteParamType(value: string): value is RouteParamType {
  return routeParams.includes(value as RouteParamType)
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  // Ensure params.section is a RouteParamType
  const sectionName = (isRouteParamType(section) ? section : "") as RouteParamType

  if (!sectionName) return <NotFound />

  const t = await getTranslations("CreateFlow")
  const sectionMap = getSectionMap(t)

  // Get the current section object's props. Non-null assertion is safe here because we've already checked if the section is valid
  const { fields, isMultiEntry, title, sub } = sectionMap.get(sectionName)!

  return (
    <CvSyncBoundary>
      <SectionWrapper
        sectionName={sectionName}
        isMultiEntry={isMultiEntry}
        fields={fields}
        title={title}
        sub={sub}
      />
    </CvSyncBoundary>
  )
}
