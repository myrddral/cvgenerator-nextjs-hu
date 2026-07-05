import type { FieldErrors } from "react-hook-form"

import { isDevMode } from "./utils"

const shouldShowDevToasts = (toggle: true | false): boolean => {
  return isDevMode() && toggle
}

/**
 * Logs react-hook-form validation errors to the console, but only in development and
 * only when explicitly opted in - safe to leave in call sites without spamming production logs.
 * @param toggle Per-call-site opt-in; defaults to off so callers must explicitly enable logging.
 * @param errors The form's current validation errors.
 */
export const logFormErrors = (toggle: true | false = false, errors: FieldErrors) => {
  shouldShowDevToasts(toggle) && Object.keys(errors).length && console.log("Form errors:", errors)
}
