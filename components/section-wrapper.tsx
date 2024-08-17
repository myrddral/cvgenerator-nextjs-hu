"use client"
import type { SectionProps } from "@/form-generator/form-generator.types"
import type {
  CvDataState,
  Employment,
  Language,
  School,
  SectionName,
  SectionNameWithMultiEntry,
} from "@/lib/stores/cv-data-store.types"

import { SectionDataList } from "@/components/section-data-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormStepCard } from "@/components/ui/formstep-card"
import { IconButton } from "@/components/ui/iconbutton"
import FormGenerator from "@/form-generator/form-generator"
import { useFormNavigation } from "@/hooks/use-form-navigation"
import { PlusIcon } from "@radix-ui/react-icons"
import { useCallback, useState } from "react"
import { useCvDataStore } from "../providers/cv-data-store-provider"
import { FormNavButtons } from "./form-nav-buttons"

export interface FormStepWrapperProps extends SectionProps {}

export function SectionWrapper({ ...sectionProps }: FormStepWrapperProps) {
  const { title, sub, sectionName, isMultiEntry } = sectionProps
  const { setSectionData, addToList, removeFromList } = useCvDataStore((state) => state)
  const sectionData = useCvDataStore((state) => state)[sectionName]
  const { handleForwardStep } = useFormNavigation(sectionName)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedListItem, setSelectedListItem] = useState<number | undefined>(undefined)

  const getValues = useCallback(() => {
    if (isMultiEntry && Array.isArray(sectionData)) {
      return sectionData[selectedListItem ?? 0]
    }
    return sectionData
  }, [isMultiEntry, sectionData, selectedListItem])

  function onSubmit(data: Omit<CvDataState[SectionName], "email">) {
    if (isMultiEntry) {
      addToList(sectionName, data as Employment | School | Language)
      setIsOpen(false)
    } else {
      setSectionData(sectionName, data)
      handleForwardStep()
    }
  }

  function onDelete() {
    if (isMultiEntry && selectedListItem !== undefined) {
      removeFromList(sectionName as SectionNameWithMultiEntry, selectedListItem)
      setIsOpen(false)
    }
  }

  function handleOnOpenChange(isOpen: boolean) {
    setIsOpen(isOpen)
    if (!isOpen) setSelectedListItem(undefined)
  }

  function getTitle() {
    switch (sectionName) {
      case "experience":
        return selectedListItem ? "Munkatapasztalat szerkesztése" : "Új munkatapasztalat hozzáadása"
      case "education":
        return selectedListItem ? "Tanulmány szerkesztése" : "Új tanulmány hozzáadása"
      case "languages":
        return selectedListItem ? "Nyelv szerkesztése" : "Új nyelv hozzáadása"
      default:
        return ""
    }
  }

  return (
    <FormStepCard title={title} sub={sub} className="mb-8">
      {isMultiEntry ? (
        <>
          <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
            <DialogTrigger asChild className="mb-6">
              <IconButton icon={<PlusIcon />} text="Új felvétele" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="mb-2 sm:mb-4">
                <DialogTitle>{getTitle()}</DialogTitle>
                <DialogDescription className="sr-only">
                  Az alábbi űrlap segítségével adhatsz hozzá munkatapasztalatokat az önéletrajzodhoz.
                </DialogDescription>
              </DialogHeader>
              <FormGenerator
                {...sectionProps}
                values={getValues()}
                onSubmit={onSubmit}
                onDelete={onDelete}
                selectedListItem={selectedListItem}
              />
            </DialogContent>
          </Dialog>
          <SectionDataList
            sectionName={sectionName}
            setSelectedListItem={setSelectedListItem}
            setIsOpen={setIsOpen}
          />
          <FormNavButtons routeParam={sectionName} />
        </>
      ) : (
        <FormGenerator {...sectionProps} values={getValues()} onSubmit={onSubmit} />
      )}
    </FormStepCard>
  )
}
