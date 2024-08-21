import type { ReactNode } from "react"
import type { SectionName } from "@/lib/stores/cv-data-store.types"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export interface FormDialogProps {
  children: ReactNode[] // the first element is the dialog trigger, the second element is the form
  sectionName: SectionName
  selectedItemIdx?: number | undefined | null
  setSelectedItemIdx: (idx: number | undefined | null) => void
}

export function FormDialog({ children, sectionName, selectedItemIdx, setSelectedItemIdx }: FormDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    selectedItemIdx !== null ? setIsOpen(true) : setIsOpen(false)
  }, [selectedItemIdx])

  // these two child components must be extracted from the children array, otherwise the dialog can't be rendered
  const renderDialogTrigger = children[0]
  const renderForm = children[1]

  function getTitle() {
    switch (sectionName) {
      case "experience":
        return selectedItemIdx ? "Munkatapasztalat szerkesztése" : "Új munkatapasztalat hozzáadása"
      case "education":
        return selectedItemIdx ? "Tanulmány szerkesztése" : "Új tanulmány hozzáadása"
      case "languages":
        return selectedItemIdx ? "Nyelv szerkesztése" : "Új nyelv hozzáadása"
      default:
        return ""
    }
  }

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!isOpen) setSelectedItemIdx(null)
    setIsOpen(isOpen)
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
