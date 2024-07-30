"use client"

import type { Section } from "@/app/create/creator-sections"

import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"

interface StepperProps {
  allSections: Section[]
}

export default function Stepper({ allSections }: StepperProps) {
  // the current section is determined by the route parameter
  const { section } = useParams<{ section: string }>()

  return (
    <div
      className={cn(
        "mx-auto flex items-center justify-center gap-20 py-12 max-sm:gap-4 max-sm:pb-6 max-sm:pt-12",
        {
          hidden: !section,
        }
      )}
    >
      {allSections.map(({ routeParam, title }: Section, index) =>
        // The section at index 0 is always the email form (cannot be navigated to)
        index !== 0 ? (
          <div key={routeParam} className="relative flex h-full w-full flex-col items-center pb-5">
            <Link href={`/create/${routeParam}`}>
              <Button
                size={"icon"}
                variant={"outline"}
                className="h-12 w-12 border-2 border-border max-sm:h-8 max-sm:w-8"
              >
                <h3
                  className={cn("text-xl font-bold text-primary max-sm:text-base", {
                    "text-secondary": routeParam !== section,
                  })}
                >
                  {index}
                </h3>
              </Button>
            </Link>
            <p
              className={cn("absolute bottom-0 whitespace-nowrap text-xs max-sm:hidden", {
                "font-semibold text-primary brightness-125 saturate-[1.25]": routeParam === section,
              })}
            >
              {title}
            </p>
          </div>
        ) : null
      )}
    </div>
  )
}