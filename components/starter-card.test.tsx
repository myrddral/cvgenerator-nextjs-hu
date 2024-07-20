import { render, screen, fireEvent } from "@testing-library/react"
import StarterCard from "@/components/starter-card"

describe("StarterCard component", () => {
  test("renders the component", () => {
    render(<StarterCard />)
    expect(screen.getByText("Önéletrajz generátor")).toBeInTheDocument()
    expect(screen.getByText("KEZDÉS")).toBeInTheDocument()
    expect(screen.getByText("Mi ez?")).toBeInTheDocument()
  })

  test("renders the back button when viewing help text", () => {
    render(<StarterCard />)
    fireEvent.click(screen.getByText("Mi ez?"))
    expect(screen.getByText("Vissza")).toBeInTheDocument()
  })

  test('hides help text when "Vissza" button is clicked', () => {
    render(<StarterCard />)
    fireEvent.click(screen.getByText("Mi ez?"))
    fireEvent.click(screen.getByText("Vissza"))
    expect(screen.getByText("Önéletrajz generátor")).toBeInTheDocument()
  })

  test('shows the ChevronRightIcon when hovering over the "BEGIN" button', () => {
    render(<StarterCard />)
    const beginButton = screen.getByText("KEZDÉS")
    fireEvent.mouseEnter(beginButton)
    const icon = beginButton.querySelector("svg")
    expect(icon).toHaveClass("scale-125 opacity-100")
    fireEvent.mouseLeave(beginButton)
    expect(icon).toHaveClass("opacity-0")
  })
})
