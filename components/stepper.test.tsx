import { render } from "../test-utils"
import { Stepper } from "./stepper"
import { getAllSections } from "../form-generator/generator-sections"

import { test, mock, describe } from "bun:test"

mock.module("next/navigation", () => ({
  useParams: () => ({
    section: "personal",
  }),
}))

const allSections = getAllSections((key: string) => key)

describe("Stepper component", () => {
  test("renders the Stepper component", () => {
    render(<Stepper allSections={allSections} />)
  })
})
