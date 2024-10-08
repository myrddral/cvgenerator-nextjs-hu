"use client"
import type { RouteParamType, SectionProps } from "@/form-generator/form-generator.types"

import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"

interface StepperProps {
  allSections: SectionProps[]
}

export default function Stepper({ allSections }: StepperProps) {
  // the current section is determined by the section dynamic route parameter
  const { section } = useParams<{ section: RouteParamType }>()

  return (
    <div
      className={cn(
        "mx-auto flex items-center justify-center gap-20 py-12 max-sm:gap-4 max-sm:pb-6 max-sm:pt-12",
        {
          hidden: !section,
        }
      )}
    >
      {allSections.map(({ sectionName, title }: SectionProps, index) => (
        <div key={sectionName} className="relative flex h-full w-full flex-col items-center pb-5">
          <Link href={`/create/${sectionName}`}>
            <Button
              size={"icon"}
              variant={"outline"}
              className={cn("h-12 w-12 border-2 border-border max-sm:h-8 max-sm:w-8", {
                // "disabled" :
              })}
            >
              <h3
                className={cn("text-xl font-bold text-primary max-sm:text-base", {
                  "text-secondary": sectionName !== section,
                })}
              >
                {index + 1}
              </h3>
            </Button>
          </Link>
          <p
            className={cn("absolute bottom-0 whitespace-nowrap text-xs max-sm:hidden", {
              "font-semibold text-primary brightness-125 saturate-[1.25]": sectionName === section,
            })}
          >
            {title}
          </p>
        </div>
      ))}
    </div>
  )
}
