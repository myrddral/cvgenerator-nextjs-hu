import type { FieldErrors } from "react-hook-form"
import type { Section } from "@/form-generator/generator-sections"

import { isDevMode } from "./utils"

type Fields = Section["fields"]

export const getDefaultValues = (fields: Fields) => ({
  ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.defaultValue])),
})

const shouldShowDevToasts = (toggle: true | false): boolean => {
  return isDevMode() && toggle
}

export const logFormErrors = (toggle: true | false = false, errors: FieldErrors) => {
  shouldShowDevToasts(toggle) && Object.keys(errors).length && console.log("Form errors:", errors)
}
