import { render, screen } from "@testing-library/react"
import Footer from "./footer"

describe("Footer component", () => {
  test("renders the footer component", () => {
    render(<Footer />)
    expect(screen.getByText("Készítette")).toBeInTheDocument()
    expect(screen.getByText("Adatvédelmi szabályzat")).toBeInTheDocument()
    expect(screen.getByText("Használati feltételek")).toBeInTheDocument()
    expect(screen.getByText("Kredit")).toBeInTheDocument()
  })
})
