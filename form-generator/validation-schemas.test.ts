import { describe, test, expect } from "bun:test"
import { getSectionSchemas } from "./validation-schemas"

const t = (key: string) => key

describe("date range validation (experience & education)", () => {
  const { experience, education } = getSectionSchemas(t)

  const validEntry = {
    jobTitle: "Engineer",
    employer: "Acme",
    description: "Built things",
    startDate: new Date("2020-01-01"),
    endDate: new Date("2021-01-01"),
    location: "Remote",
  }

  test("accepts a start date before the end date", () => {
    const result = experience.safeParse(validEntry)
    expect(result.success).toBe(true)
  })

  test("accepts a start date equal to the end date", () => {
    const result = experience.safeParse({ ...validEntry, endDate: validEntry.startDate })
    expect(result.success).toBe(true)
  })

  test("rejects a start date after the end date, flagging endDate", () => {
    const result = experience.safeParse({
      ...validEntry,
      startDate: new Date("2021-01-01"),
      endDate: new Date("2020-01-01"),
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.message === "validation.common.dateRangeInvalid")
      expect(issue?.path).toEqual(["endDate"])
    }
  })

  test("applies the same rule to the education schema", () => {
    const validEducationEntry = {
      institution: "State University",
      major: "CS",
      specialization: "AI",
      description: "",
      startDate: new Date("2021-01-01"),
      endDate: new Date("2020-01-01"),
      location: "Remote",
    }

    const result = education.safeParse(validEducationEntry)

    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.message === "validation.common.dateRangeInvalid")
      expect(issue?.path).toEqual(["endDate"])
    }
  })
})
