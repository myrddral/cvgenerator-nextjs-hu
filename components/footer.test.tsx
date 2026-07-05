import { render, screen } from "../test-utils"
import { test, expect, describe } from "bun:test"
import Footer from "./footer"

describe("Footer component", () => {
  test("renders the footer component", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Made by" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Terms of Use" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Credits" })).toBeTruthy()
  })
})
