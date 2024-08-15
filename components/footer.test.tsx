import { render, screen } from "@testing-library/react"
import { test, expect, describe } from "bun:test"
import Footer from "./footer"

describe("Footer component", () => {
  test("renders the footer component", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Készítette" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Adatvédelmi szabályzat" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Használati feltételek" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Kredit" })).toBeTruthy()
  })
})
