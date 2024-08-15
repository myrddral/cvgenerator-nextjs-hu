import { render } from "@testing-library/react"
import Stepper from "./stepper"
import { allSections } from "../form-generator/generator-sections"

import { test, mock, describe } from "bun:test"

mock.module("next/navigation", () => ({
  useParams: () => ({
    section: "personal",
  }),
}))

describe("Stepper component", () => {
  test("renders the Stepper component", () => {
    render(<Stepper allSections={allSections} />)
  })
})
