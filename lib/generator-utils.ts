import type { FieldErrors } from "react-hook-form"

import { isDevMode } from "./utils"

const shouldShowDevToasts = (toggle: true | false): boolean => {
  return isDevMode() && toggle
}

export const logFormErrors = (toggle: true | false = false, errors: FieldErrors) => {
  shouldShowDevToasts(toggle) && Object.keys(errors).length && console.log("Form errors:", errors)
}
