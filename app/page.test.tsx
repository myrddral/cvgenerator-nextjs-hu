import { render, screen } from "@testing-library/react"
import Home from "./page"

describe("HomePage component", () => {
  test("renders the Home page with a child component", () => {
    render(<Home />)
    expect(screen.getByText("Önéletrajz generátor")).toBeInTheDocument()
  })
})
