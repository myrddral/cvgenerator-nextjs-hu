import type { PropsWithChildren } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { cn } from "@/lib/utils"

export interface AlertDialogVariant {
  title: string
  description: string
  actionBtnVariant: string
  actionBtnText: string
}

const alertDialogs: Record<string, AlertDialogVariant> = {
  delete: {
    title: "Biztosan törölni akarod?",
    description: "Ez a művelet eltávolítja az elemet a listából.",
    actionBtnVariant: "danger",
    actionBtnText: "Törlés",
  },
  skipSection: {
    title: "Biztosan ki akarod hagyni?",
    description: "Nem adtál hozzá semmit ehhez a szekcióhoz, így üres lesz az önéletrajzodon!",
    actionBtnVariant: "primary",
    actionBtnText: "Kihagyás",
  },
}

export type DialogType = keyof typeof alertDialogs

export interface ConfirmDialogProps extends PropsWithChildren {
  type: DialogType
  onConfirmAction: () => void
}

export const ConfirmDialog = ({ children, type, onConfirmAction }: ConfirmDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertDialogs[type].title}</AlertDialogTitle>
          <AlertDialogDescription>{alertDialogs[type].description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Mégsem</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmAction}
            //? cva variants don't work here, had to use classNames. why?
            className={cn(`bg-${alertDialogs[type].actionBtnVariant}`)}
          >
            {alertDialogs[type].actionBtnText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
