import { render } from "@testing-library/react"
import { test, describe } from "bun:test"
import { ModeToggle } from "./mode-toggle"

describe("ModeToggle component", () => {
  test("renders the ModeToggle component", () => {
    render(<ModeToggle />)
  })
})
