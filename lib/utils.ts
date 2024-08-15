import type { ClassValue } from "clsx"

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { hu, enUS as en } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDevMode(): boolean {
  return process.env.NODE_ENV === "development"
}

export const formatDate = (date: string | Date, locale: "hu" | "en") => {
  if (locale === "hu") return format(date, "yyyy. MMM", { locale: hu })
  else if (locale === "en") return format(date, "MMM yyyy", { locale: en })
  return format(date, "yyyy. MMM")
}

/**
 * Generates a document title based on the first and last name of the person, and the current year,
 * then lowercases and normalizes the string (removes accents and special characters).
 * Note: "hu" locale has a special case for the naming convention, as it is used in Hungary.
 * @param firstName The first name of the person.
 * @param lastName The last name of the person.
 * @param locale The locale of the document.
 * @returns The generated document title.
 * @example
 * generateDocTitle("Attila", "Béli", "hu") // "cv-beliattila-2024"
 * generateDocTitle("John", "Doe", "en") // "cv-johndoe-2024"
 */
export function generateDocTitle(firstName: string, lastName: string, locale: "hu" | "en") {
  const localizedName = locale === "hu" ? `${lastName}${firstName}` : `${firstName}${lastName}`
  return `cv-${localizedName}-${new Date().getFullYear()}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}
