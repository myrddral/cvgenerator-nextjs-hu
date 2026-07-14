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
import type { z } from "zod"

import { SectionDataList } from "@/components/section-data-list"
import { FormStepCard } from "@/components/ui/formstep-card"
import { IconButton } from "@/components/ui/iconbutton"
import FormGenerator from "@/form-generator/form-generator"
import type { getSectionSchemas } from "@/form-generator/validation-schemas"
import { useFormNavigation } from "@/hooks/use-form-navigation"
import { useCvId } from "@/hooks/use-cv-id"
import { getSectionMutationRef, serializePersonal, serializeExperienceList, serializeEducationList } from "@/lib/cv-sync"
import { defaultInitState } from "@/lib/stores/cv-data-initstate"
import { useMutation } from "convex/react"
import { PlusIcon } from "@radix-ui/react-icons"
import { useTranslations } from "next-intl"
import { useCallback, useState } from "react"
import { useCvDataStore, useCvDataStoreApi } from "../providers/cv-data-store-provider"
import { ConfirmDialog } from "./confirm-dialog"
import { FormDialog } from "./form-dialog"
import { Button } from "./ui/button"

type SectionSchemas = ReturnType<typeof getSectionSchemas>

export interface FormStepWrapperProps extends SectionProps {}

function serializeForSection(sectionName: SectionName, value: unknown) {
  if (sectionName === "personal") return serializePersonal(value as CvDataState["personal"])
  if (sectionName === "experience") return serializeExperienceList(value as Employment[])
  if (sectionName === "education") return serializeEducationList(value as School[])
  return value
}

export function SectionWrapper({ ...sectionProps }: FormStepWrapperProps) {
  const { title, sub, sectionName, isMultiEntry } = sectionProps
  const t = useTranslations("CreateFlow.actions")
  const { handleForwardStep, handleBackStep } = useFormNavigation(sectionName)
  const cvId = useCvId()
  const saveSection = useMutation(getSectionMutationRef(sectionName))
  const { setSectionData, removeFromList, markSectionAsCompleted } = useCvDataStore((state) => state)
  const storeApi = useCvDataStoreApi()
  const sectionData = useCvDataStore((state) => state)[sectionName]
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | undefined | null>(null)

  const getFormValues = useCallback((): z.infer<SectionSchemas[SectionName]> => {
    if (!isMultiEntry || !Array.isArray(sectionData)) {
      return sectionData as z.infer<SectionSchemas[SectionName]>
    }
    // selectedItemIdx === undefined means "add new" - use a blank template rather than
    // reusing an existing entry's data (or crashing when the list is still empty)
    if (selectedItemIdx === undefined) {
      return (defaultInitState[sectionName] as typeof sectionData)[0] as z.infer<SectionSchemas[SectionName]>
    }
    return sectionData[selectedItemIdx ?? 0]!
  }, [isMultiEntry, sectionData, selectedItemIdx, sectionName])

  function persistSection() {
    if (!cvId) return
    const value = storeApi.getState()[sectionName]
    void saveSection({ cvId, data: serializeForSection(sectionName, value) })
  }

  function onSubmit(data: Omit<CvDataState[SectionName], "email">) {
    if (isMultiEntry) {
      setSectionData(sectionName, data as Employment | School | Language)
      markSectionAsCompleted(sectionName)
      setSelectedItemIdx(null)
      persistSection()
    } else {
      setSectionData(sectionName, data)
      markSectionAsCompleted(sectionName)
      persistSection()
      handleForwardStep()
    }
  }

  function onSkip() {
    markSectionAsCompleted(sectionName)
    handleForwardStep()
  }

  function onDelete() {
    if (isMultiEntry && selectedItemIdx) {
      removeFromList(sectionName as SectionNameWithMultiEntry, selectedItemIdx)
      setSelectedItemIdx(null)
      persistSection()
    }
  }

  function formHasUserData(): boolean {
    const data = isMultiEntry && Array.isArray(sectionData) ? sectionData : []
    if (data.length <= 0) return false
    if (data.length > 1) return true

    // If the data array's length is 1 (meaning it's the initial object used for empty form values),
    // check if the only item's first key has a value
    return Object.values(data[0]!)[0]!.toString().length > 0
  }

  function handleForwardClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (formHasUserData()) {
      e.preventDefault()
      handleForwardStep()
    }
  }

  function handleAddClick() {
    setSelectedItemIdx(undefined)
  }

  return (
    <FormStepCard title={title} sub={sub} className="mb-8">
      {/* If section data is of type array, show the FormGenerator inside a dialog */}
      {isMultiEntry ? (
        <>
          <FormDialog
            sectionName={sectionName}
            selectedItemIdx={selectedItemIdx}
            setSelectedItemIdx={setSelectedItemIdx}
          >
            <IconButton icon={<PlusIcon />} text={t("addNew")} onClick={handleAddClick} />
            <FormGenerator
              {...sectionProps}
              values={getFormValues()}
              onSubmit={onSubmit}
              onDelete={onDelete}
              selectedItemIdx={selectedItemIdx}
            />
          </FormDialog>
          <SectionDataList sectionName={sectionName} setSelectedItemIdx={setSelectedItemIdx} />
          <div className="mt-12 flex justify-center gap-10 max-sm:mt-8">
            <Button type="button" variant="navPrev" className="group relative px-10" onClick={handleBackStep}>
              {t("back")}
            </Button>
            <ConfirmDialog type="skipSection" onConfirmAction={onSkip}>
              <Button
                type="button"
                variant="navNext"
                className="group relative px-10"
                onClick={handleForwardClick}
              >
                {t("next")}
              </Button>
            </ConfirmDialog>
          </div>
        </>
      ) : (
        // If section data is of type object, show the FormGenerator directly
        <FormGenerator
          {...sectionProps}
          values={getFormValues()}
          onSubmit={onSubmit}
          onDelete={onDelete}
          selectedItemIdx={selectedItemIdx}
        />
      )}
    </FormStepCard>
  )
}
