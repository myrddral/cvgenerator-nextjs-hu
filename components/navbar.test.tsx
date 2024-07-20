import Navbar from "@/components/navbar"
import { render, screen } from "@testing-library/react"

jest.mock("@/components/mode-toggle", () => ({
  ModeToggle: () => <div>Mode Toggle</div>,
}))

jest.mock("@/components/ui/logo", () => ({
  __esModule: true,
  default: () => <div>Logo</div>,
}))

jest.mock("@/components/navbar-navitems", () => ({
  __esModule: true,
  default: () => <div>Navbar Navitems</div>,
}))

describe("Navbar", () => {
  it("renders Logo and NavbarNavitems, but not ModeToggle in production mode", () => {
    render(<Navbar />)

    expect(screen.getByText("Logo")).toBeInTheDocument()
    expect(screen.getByText("Navbar Navitems")).toBeInTheDocument()
    expect(screen.queryByText("Mode Toggle")).not.toBeInTheDocument()
  })
})
