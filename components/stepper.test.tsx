import { render } from "@testing-library/react"
import Stepper from "./stepper"
import { allSections } from "../app/create/creator-sections"

jest.mock("next/navigation", () => ({
  useParams: () => ({
    section: "personal",
  }),
}))

describe("Stepper component", () => {
  test("renders the Stepper component", () => {
    render(<Stepper allSections={allSections} />)
  })
})
