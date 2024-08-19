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

// TODO: the types are f'd up, fix them
export function SectionDataList({ sectionName, setIsOpen, setSelectedListItem }: SectionDataListProps) {
  const data = useCvDataStore((state) => state[sectionName]) as CvDataState[SectionName][]
  const [isLoading, setIsLoading] = useState(true)

  function hasUserData(data: CvDataState[SectionName][]) {
    if (data.length <= 0) return false
    if (data.length > 1) return true

    // * if the data array's length is 1, check if the only item has an employer, institution or language
    return data[0].employer || data[0].institution || data[0].language
  }

  useEffect(() => {
    /**
     * * the data is never an empty array, when fetched from the store, because at the first index it always has an object value,
     * * which was used as default value for the inputs of the given section
     */
    data.length && setIsLoading(false)
  }, [data])

  function handleItemClick(index: number) {
    setSelectedListItem(index)
    setIsOpen(true)
  }

  return (
    <div className="flex min-h-28 flex-wrap items-center gap-y-4">
      {isLoading ? (
        <div className="flex h-full w-full justify-center">
          <Spinner size="md" />
        </div>
      ) : null}
      {!isLoading && !hasUserData(data) && (
        <Card className="flex-center h-fit w-full border-2 border-dashed opacity-75">
          <CardContent className="pt-6">
            <h3 className="text-center text-lg text-foreground/50">Még nem adtál hozzá elemet</h3>
          </CardContent>
        </Card>
      )}
      {data.map(
        ({ employer, title, startDate, endDate, institution, specialization, language, level }, index) => (
          <Card
            key={index}
            onClick={() => handleItemClick(index)}
            className={cn(
              "h-fit w-full cursor-pointer border transition-all",
              "hover:bg-transparent/70 hover:ring-1 hover:ring-ring",
              {
                hidden: !employer && !institution && !language,
              }
            )}
          >
            <CardContent className="flex w-full justify-between p-6 max-sm:flex-wrap max-sm:p-4 md:min-w-[400px]">
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
                <span className="flex items-center gap-2 whitespace-nowrap text-xs max-sm:w-full max-sm:justify-start">
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
