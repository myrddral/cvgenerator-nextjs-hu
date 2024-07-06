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
      className={cn("mx-auto flex w-fit items-center justify-center gap-16 max-sm:gap-7", {
        invisible: !section,
      })}
    >
      {allSections.map(({ routeParam, title }: Section, index) =>
        index !== 0 ? (
          <div key={routeParam} className="relative flex h-full w-full flex-col items-center pb-5">
            <Link href={`/create/${routeParam}`}>
              <Button
                size={"icon"}
                variant={"outline"}
                className="h-12 w-12 border-2 border-border max-sm:h-8 max-sm:w-8"
              >
                <h3
                  className={cn("text-xl text-primary font-bold max-sm:text-base", {
                    "text-secondary": routeParam !== section,
                  })}
                >
                  {index}
                </h3>
              </Button>
            </Link>
            <p
              className={cn("absolute bottom-0 whitespace-nowrap text-xs max-sm:hidden", {
                "font-semibold text-primary saturate-[1.25] brightness-125": routeParam === section,
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
