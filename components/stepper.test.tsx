import { render, screen } from "../test-utils"
import { Stepper } from "./stepper"
import { getAllSections } from "../form-generator/generator-sections"

import { test, mock, describe, expect } from "bun:test"

void mock.module("next/navigation", () => ({
  useParams: () => ({
    section: "links",
  }),
}))

const allSections = getAllSections((key: string) => key)

describe("Stepper component", () => {
  test("renders a step with its title for every section", () => {
    render(<Stepper allSections={allSections} />)

    allSections.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeDefined()
    })
  })

  test("lets the user navigate to the currently active step", () => {
    render(<Stepper allSections={allSections} />)

    // "links" is the second section, so its step is numbered "2"
    const activeStep = screen.getByRole("link", { name: "2" })
    expect(activeStep.getAttribute("aria-disabled")).toBe("false")
    expect(activeStep.tabIndex).toBe(0)
  })

  test("blocks navigation to steps that are neither active nor completed", () => {
    render(<Stepper allSections={allSections} />)

    // "skills" is the third section and hasn't been visited or completed
    const upcomingStep = screen.getByRole("link", { name: "3" })
    expect(upcomingStep.getAttribute("aria-disabled")).toBe("true")
    expect(upcomingStep.tabIndex).toBe(-1)
  })

  test("lets the user navigate back to a step they already completed", () => {
    render(<Stepper allSections={allSections} />, {
      initialState: { completedSections: ["skills"] },
    })

    const completedStep = screen.getByRole("link", { name: "3" })
    expect(completedStep.getAttribute("aria-disabled")).toBe("false")
    expect(completedStep.tabIndex).toBe(0)
  })
})
