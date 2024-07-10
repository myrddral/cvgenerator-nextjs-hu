import type { PropsWithChildren } from "react"

import Stepper from "@/components/stepper"
import { allSections } from "./creator-sections"

export default function CreateTemplate({ children }: PropsWithChildren) {
  return (
    <div className="container flex min-h-main flex-col pb-12">
      <Stepper allSections={allSections} /> 
      <main className="flex-center mx-auto w-full max-w-[44rem] flex-1">{children}</main>
    </div>
  )
}
