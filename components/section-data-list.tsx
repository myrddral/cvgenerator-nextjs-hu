//@ts-nocheck - this is a temporary fix for the type inference issue
import type { CvDataState, SectionName } from "@/lib/stores/cv-data-store.types"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { useCvDataStore } from "../providers/cv-data-store-provider"
import { Card, CardContent } from "./ui/card"
import { Spinner } from "./ui/loader"

interface SectionDataListProps {
  sectionName: keyof CvDataState
  setSelectedListItem: (index: number | undefined) => void
  setIsOpen: (isOpen: boolean) => void
}

//* types are a bit f'd up here.. step back and check wether schema type inference is the culprit
export function SectionDataList({ sectionName, setIsOpen, setSelectedListItem }: SectionDataListProps) {
  const data = useCvDataStore((state) => state[sectionName]) as CvDataState[SectionName][]
  const [arrayToRender, setArrayToRender] = useState<CvDataState[SectionName][]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setArrayToRender(data)
    setIsLoading(false)
  }, [data])

  function handleItemClick(index: number) {
    setSelectedListItem(index)
    setIsOpen(true)
  }

  return (
    <div className="flex min-h-16 flex-wrap gap-y-4">
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Spinner size="md" />
        </div>
      ) : null}
      {arrayToRender.map(
        ({ employer, title, startDate, endDate, institution, specialization, language, level }, index) => (
          <Card
            key={index}
            onClick={() => handleItemClick(index)}
            className={cn(
              "w-full cursor-pointer border transition-all",
              "hover:bg-transparent/70 hover:ring-1 hover:ring-ring",
              {
                hidden: !employer && !institution && !language,
              }
            )}
          >
            <CardContent className="flex w-full justify-between p-6 max-sm:p-4 md:min-w-[400px]">
              <div className={cn("max-sm:flex max-sm:flex-wrap", { hidden: !employer })}>
                <span className="whitespace-nowrap font-semibold">{title}</span>
                <span className="mx-2 max-sm:hidden"> | </span>
                <span className="whitespace-nowrap">{employer}</span>
              </div>
              <div className={cn("max-sm:flex max-sm:flex-wrap", { hidden: !institution })}>
                <span className="whitespace-nowrap font-semibold">{specialization}</span>
                <span className="mx-2 max-sm:hidden"> | </span>
                <span className="whitespace-nowrap">{institution}</span>
              </div>
              <div className={cn("max-sm:flex max-sm:flex-wrap", { hidden: !language })}>
                <span className="whitespace-nowrap font-semibold">{language}</span>
                <span className="mx-2 max-sm:hidden"> | </span>
                <span className="whitespace-nowrap">{level}</span>
              </div>
              {startDate ? (
                <span className="flex items-center gap-2 whitespace-nowrap text-xs">
                  {format(startDate, "yyyy/MM")} - {endDate ? format(endDate, "yyyy/MM") : "current"}
                </span>
              ) : null}
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}
