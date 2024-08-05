import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { hu } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDevMode(): boolean {
  return process.env.NODE_ENV === "development"
}

export const formatDate = (date: string | Date) => {
  return format(date, "yyyy. MMMM", { locale: hu })
}
