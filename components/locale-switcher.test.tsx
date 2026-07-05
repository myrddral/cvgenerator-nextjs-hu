import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const push = jest.fn()

jest.mock("next-intl", () => ({
  useLocale: () => "en",
}))

jest.mock("@/i18n/navigation", () => ({
  usePathname: () => "/show",
  useRouter: () => ({ push }),
}))

import LocaleSwitcher from "./locale-switcher"

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    push.mockClear()
  })

  test("renders the current locale", () => {
    render(<LocaleSwitcher />)
    expect(screen.getByRole("combobox")).toHaveTextContent("EN")
  })

  test("navigates to the same path with the new locale on selection", async () => {
    render(<LocaleSwitcher />)
    await userEvent.click(screen.getByRole("combobox"))
    await userEvent.click(screen.getByRole("option", { name: "HU" }))
    expect(push).toHaveBeenCalledWith("/show", { locale: "hu" })
  })
})
