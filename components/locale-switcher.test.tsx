// Uses the shared `render` from test-utils (real NextIntlClientProvider, locale "en")
// instead of mock.module("next-intl", ...): Bun shares its module registry across test
// files in the same run, so a full-module mock here previously leaked into unrelated
// test files (e.g. footer.test.tsx) that rely on the real useTranslations.
import { render, screen } from "../test-utils"
import userEvent from "@testing-library/user-event"
import { test, expect, describe, beforeEach, mock } from "bun:test"

const push = mock()

void mock.module("@/i18n/navigation", () => ({
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
    expect(screen.getByRole("combobox").textContent).toBe("EN")
  })

  test("navigates to the same path with the new locale on selection", async () => {
    render(<LocaleSwitcher />)
    await userEvent.click(screen.getByRole("combobox"))
    await userEvent.click(screen.getByRole("option", { name: "HU" }))
    expect(push).toHaveBeenCalledWith("/show", { locale: "hu" })
  })
})
