import { EmailForm } from "@/components/email-form"
import { useCvDataStore } from "@/lib/stores/cv-data-store"
import { useRouter } from "next/navigation"
import { fireEvent, render, screen, act } from "@testing-library/react"

// Mock useCvDataStore
jest.mock("@/lib/stores/cv-data-store", () => ({
  __esModule: true,
  useCvDataStore: jest.fn(),
}))

// Mock useRouter
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}))

describe("EmailForm", () => {
  const mockSetEmail = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    ;(useCvDataStore as unknown as jest.Mock).mockReturnValue({
      personal: { email: "" },
      setEmail: mockSetEmail,
    })
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders the form correctly", () => {
    render(<EmailForm />)

    expect(screen.getByLabelText(/email cím/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText("email@domain.hu")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /tovább/i })).toBeInTheDocument()
  })

  // test("displays error message on invalid email", async () => {
  //   render(<EmailForm />)

  //   const input = screen.getByPlaceholderText("email@domain.hu")
  //   const button = screen.getByRole("button", { name: /tovább/i })

  //   if (process.env.NODE_ENV !== "production") {
  //     await act(async () => {
  //       fireEvent.change(input, { target: { value: "invalid-email" } })
  //       fireEvent.click(button)
  //     })
  //   }

  //   if (process.env.NODE_ENV === "production") {
  //     fireEvent.change(input, { target: { value: "invalid-email" } })
  //     fireEvent.click(button)
  //   }

  //   expect(await screen.findByText(/érvénytelen email cím/i)).toBeInTheDocument()
  // })

  // test("submits form with valid email", async () => {
  //   render(<EmailForm />)

  //   const input = screen.getByPlaceholderText("email@domain.hu")
  //   const button = screen.getByRole("button", { name: /tovább/i })

  //   // Simulate user typing into the input and form submission
  //   if (process.env.NODE_ENV !== "production") {
  //     await act(async () => {
  //       fireEvent.change(input, { target: { value: "test@example.com" } })
  //       fireEvent.click(button)
  //     })
  //   }

  //   if (process.env.NODE_ENV === "production") {
  //     fireEvent.change(input, { target: { value: "test@example.com" } })
  //     fireEvent.click(button)
  //   }

  //   expect(mockSetEmail).toHaveBeenCalledWith("test@example.com")
  //   expect(mockPush).toHaveBeenCalledWith("/create/personal")
  // })
})
