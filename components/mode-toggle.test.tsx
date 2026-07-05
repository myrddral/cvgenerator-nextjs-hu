import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { test, expect, describe, mock } from "bun:test"

const setTheme = mock()

mock.module("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme }),
}))

import { ModeToggle } from "./mode-toggle"

describe("ModeToggle component", () => {
  test("switches to dark mode when the user toggles the theme from light", async () => {
    render(<ModeToggle />)

    await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }))

    expect(setTheme).toHaveBeenCalledTimes(1)
    const [updater] = setTheme.mock.calls[0]!
    expect(updater("light")).toBe("dark")
  })
})
