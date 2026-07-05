import type { PropsWithChildren } from "react"

import { Stepper } from "@/components/stepper"
import { getAllSections } from "@/form-generator/generator-sections"
import { getTranslations } from "next-intl/server"

export default async function CreateLayout({ children }: PropsWithChildren) {
  const t = await getTranslations("CreateFlow")
  const allSections = getAllSections(t)

  return (
    <div className="flex w-full flex-1 flex-col items-center overflow-clip">
      <Stepper allSections={allSections} />
      <div className="flex w-full max-w-screen-md flex-1 flex-col items-center justify-center">{children}</div>
    </div>
  )
}
