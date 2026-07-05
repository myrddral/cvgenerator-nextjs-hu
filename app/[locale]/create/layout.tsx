import type { PropsWithChildren } from "react"

import Stepper from "@/components/stepper"
import { allSections } from "@/form-generator/generator-sections"

export default function CreateLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-1 flex-col items-center overflow-clip">
      <Stepper allSections={allSections} />
      <div className="flex w-full max-w-screen-md flex-1 flex-col items-center justify-center">{children}</div>
    </div>
  )
}
