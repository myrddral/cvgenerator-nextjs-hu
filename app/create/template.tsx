import type { PropsWithChildren } from "react"

import Stepper from "@/components/stepper"
import { allSections } from "./creator-sections"

export default function CreateTemplate({ children }: PropsWithChildren) {
  return (
    <div className="container flex min-h-main flex-col pb-12">
      <div className="py-12 max-sm:pb-6 max-sm:pt-12">
        <Stepper allSections={allSections} />
      </div>
      <div className="mx-auto h-full w-full max-w-[44rem]">{children}</div>
    </div>
  )
}
