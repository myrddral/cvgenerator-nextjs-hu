import type { FieldValues } from "react-hook-form"
import { render, screen } from "../test-utils"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { describe, test, expect } from "bun:test"
import FieldFactoryWrapper, { isDateDisabled } from "./field-factory-wrapper"

function DateRangeTestForm({ startDate, endDate }: { startDate?: Date; endDate?: Date }) {
  const form = useForm<FieldValues>({ defaultValues: { startDate, endDate } })

  return (
    <FormProvider {...form}>
      <Controller
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FieldFactoryWrapper
            field={field}
            fieldKey="startDate"
            fieldProps={{ label: "Start date", type: "date" }}
            setError={form.setError}
          />
        )}
      />
      <Controller
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FieldFactoryWrapper
            field={field}
            fieldKey="endDate"
            fieldProps={{ label: "End date", type: "date" }}
            setError={form.setError}
          />
        )}
      />
    </FormProvider>
  )
}

describe("FieldFactoryWrapper date picker", () => {
  test("shows a placeholder instead of a preselected date when no date is chosen", () => {
    render(<DateRangeTestForm />)

    expect(screen.getAllByText("Pick a date")).toHaveLength(2)
  })
})

describe("isDateDisabled", () => {
  const today = new Date("2024-06-15")

  test("disables dates after today", () => {
    expect(isDateDisabled(new Date("2024-06-16"), "startDate", undefined, today)).toBe(true)
  })

  test("allows today and earlier dates when there is no paired date", () => {
    expect(isDateDisabled(today, "startDate", undefined, today)).toBe(false)
    expect(isDateDisabled(new Date("2024-06-14"), "startDate", undefined, today)).toBe(false)
  })

  test("disables dates before the 1900 lower bound", () => {
    expect(isDateDisabled(new Date("1899-12-31"), "startDate", undefined, today)).toBe(true)
  })

  test("start-date picker disables dates after the paired end date", () => {
    const pairedEndDate = new Date("2024-06-10")

    expect(isDateDisabled(new Date("2024-06-11"), "startDate", pairedEndDate, today)).toBe(true)
    expect(isDateDisabled(new Date("2024-06-10"), "startDate", pairedEndDate, today)).toBe(false)
    expect(isDateDisabled(new Date("2024-06-01"), "startDate", pairedEndDate, today)).toBe(false)
  })

  test("end-date picker disables dates before the paired start date", () => {
    const pairedStartDate = new Date("2024-06-10")

    expect(isDateDisabled(new Date("2024-06-09"), "endDate", pairedStartDate, today)).toBe(true)
    expect(isDateDisabled(new Date("2024-06-10"), "endDate", pairedStartDate, today)).toBe(false)
    expect(isDateDisabled(new Date("2024-06-11"), "endDate", pairedStartDate, today)).toBe(false)
  })
})
