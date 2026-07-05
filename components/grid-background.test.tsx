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
      "fade-edges fixed left-1/2 top-1/2 -z-10 h-[100dvh] max-h-[1080px] w-[100dvw] max-w-[1920px] -translate-x-1/2 -translate-y-1/2 bg-[url('/grid_bg1.svg')] bg-cover bg-center bg-no-repeat"
    )
  })
})
