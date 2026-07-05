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
import { useTranslations } from "next-intl"

const actionBtnVariants: Record<DialogType, string> = {
  delete: "danger",
  skipSection: "primary",
}

export type DialogType = "delete" | "skipSection"

export interface ConfirmDialogProps extends PropsWithChildren {
  type: DialogType
  onConfirmAction: () => void
}

export const ConfirmDialog = ({ children, type, onConfirmAction }: ConfirmDialogProps) => {
  const t = useTranslations("CreateFlow")

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(`confirmDialogs.${type}.title`)}</AlertDialogTitle>
          <AlertDialogDescription>{t(`confirmDialogs.${type}.description`)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmAction}
            //? cva variants don't work here, had to use classNames. why?
            className={cn(`bg-${actionBtnVariants[type]}`)}
          >
            {t(`confirmDialogs.${type}.actionBtnText`)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
