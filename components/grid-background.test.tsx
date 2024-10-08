import { render } from "@testing-library/react"
import { test, expect, describe } from "bun:test"
import { GridBackground } from "./grid-background"

describe("GridBackground component", () => {
  test("renders the GridBackground component", () => {
    const { container } = render(<GridBackground />)
    const divElement = container.firstChild

    // Check if the div element is present
    expect(divElement).toBeTruthy()

    // Check if the div element has the correct class names
    expect(divElement).toHaveProperty(
      "className",
      "fade-edges fixed left-0 top-0 -z-10 min-h-[100dvh] w-screen bg-[url('/grid_bg1.svg')] bg-cover bg-center bg-no-repeat"
    )
  })
})
