import type { ReactNode } from "react"
import type { SectionName } from "@/lib/stores/cv-data-store.types"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTranslations } from "next-intl"

export interface FormDialogProps {
  children: ReactNode[] // the first element is the dialog trigger, the second element is the form
  sectionName: SectionName
  selectedItemIdx?: number | undefined | null
  setSelectedItemIdx: (idx: number | undefined | null) => void
}

export function FormDialog({ children, sectionName, selectedItemIdx, setSelectedItemIdx }: FormDialogProps) {
  const t = useTranslations("CreateFlow.formDialogTitles")
  // the dialog's open state mirrors selectedItemIdx directly: null means closed,
  // undefined means "add new", a number means "edit item at that index"
  const isOpen = selectedItemIdx !== null

  // these two child components must be extracted from the children array, otherwise the dialog can't be rendered
  const renderDialogTrigger = children[0]
  const renderForm = children[1]

  function getTitle() {
    switch (sectionName) {
      case "experience":
        return selectedItemIdx ? t("experience.edit") : t("experience.add")
      case "education":
        return selectedItemIdx ? t("education.edit") : t("education.add")
      case "languages":
        return selectedItemIdx ? t("languages.edit") : t("languages.add")
      default:
        return ""
    }
  }

  const handleOnOpenChange = (open: boolean) => {
    if (!open) setSelectedItemIdx(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild className="mb-6">
        {renderDialogTrigger}
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader className="mb-2 sm:mb-4">
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        {renderForm}
      </DialogContent>
    </Dialog>
  )
}
