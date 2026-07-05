import { describe, test, expect } from "bun:test"
import { defaultInitState } from "./cv-data-initstate"

// A date picker whose form field defaults to `new Date()` renders as if the user
// already chose today's date. These fields must start unset so pickers show a placeholder.
describe("defaultInitState", () => {
  test("birthDate starts unset", () => {
    expect(defaultInitState.personal.birthDate).toBeUndefined()
  })

  test("experience startDate/endDate start unset", () => {
    for (const entry of defaultInitState.experience) {
      expect(entry.startDate).toBeUndefined()
      expect(entry.endDate).toBeUndefined()
    }
  })

  test("education startDate/endDate start unset", () => {
    for (const entry of defaultInitState.education) {
      expect(entry.startDate).toBeUndefined()
      expect(entry.endDate).toBeUndefined()
    }
  })
})
