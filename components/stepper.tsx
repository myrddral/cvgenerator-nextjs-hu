"use client"
import type { RouteParamType, SectionProps } from "@/form-generator/form-generator.types"

import { cn } from "@/lib/utils"
import { useCvDataStore } from "@/providers/cv-data-store-provider"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "./ui/button"

interface StepperButtonNumberProps {
  index: number
  isCompleted: boolean
  isActive: boolean
}

const StepperButtonNumber = ({ index, isCompleted, isActive }: StepperButtonNumberProps) => {
  return (
    <h3
      className={cn(
        "text-xl font-bold max-sm:text-base",
        isCompleted || isActive ? "text-primary" : "text-secondary"
      )}
    >
      {index + 1}
    </h3>
  )
}

interface StepperButtonTextProps {
  sectionName: string
  title: string
}

const StepperButtonText = ({ sectionName, title }: StepperButtonTextProps) => {
  const { section } = useParams<{ section: RouteParamType }>()
  return (
    <p
      className={cn("absolute -bottom-1 isolate whitespace-nowrap px-2 py-1 text-xs max-sm:hidden", {
        "font-semibold text-primary brightness-125 saturate-[1.25]": sectionName === section,
      })}
    >
      <span className="relative z-10">{title}</span>
      <span
        className={cn(
          "absolute inset-0 -z-10 rounded-full opacity-100 transition-opacity duration-300",
          "radial-bg-text-center"
        )}
      />
    </p>
  )
}

interface StepperProps {
  allSections: SectionProps[]
}

export default function Stepper({ allSections }: StepperProps) {
  // the current section is determined by the section dynamic route parameter
  const { section } = useParams<{ section: RouteParamType }>()
  const { completedSections } = useCvDataStore((state) => state)
  const isCompleted = (sectionName: string) => completedSections.includes(sectionName)
  const isActive = (sectionName: string) => section === sectionName

  return (
    <div
      className={cn(
        `mx-auto flex items-center justify-center gap-20 py-12 ${section ? "visible" : "hidden"}`,
        "max-sm:gap-4 max-sm:pb-6 max-sm:pt-12"
      )}
    >
      {allSections.map(({ sectionName, title }: SectionProps, index) => (
        <div key={sectionName} className="relative flex h-full w-full flex-col items-center pb-5">
          <Link
            href={`/create/${sectionName}`}
            className={cn("pointer-events-none cursor-none", {
              "pointer-events-auto cursor-auto": isCompleted(sectionName) || isActive(sectionName),
            })}
          >
            <Button
              size={"icon"}
              variant={"outline"}
              className={cn(
                "h-12 w-12 border-2 max-sm:h-8 max-sm:w-8",
                isActive(sectionName) ? "border-primary" : "border-border"
              )}
            >
              <StepperButtonNumber
                index={index}
                isCompleted={isCompleted(sectionName)}
                isActive={isActive(sectionName)}
              />
            </Button>
          </Link>
          <StepperButtonText sectionName={sectionName} title={title} />
        </div>
      ))}
    </div>
  )
}
