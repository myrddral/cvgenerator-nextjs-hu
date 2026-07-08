import { describe, expect, test, mock } from "bun:test"
import userEvent from "@testing-library/user-event"
import { render, screen } from "../test-utils"

const setPersonalMutation = mock(() => Promise.resolve(null))
const push = mock()

void mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("cv=abc123"),
}))
void mock.module("@/i18n/navigation", () => ({
  useRouter: () => ({ push }),
}))
void mock.module("convex/react", () => ({
  useMutation: () => setPersonalMutation,
}))

import { SectionWrapper } from "./section-wrapper"
import { getPersonalSection } from "@/form-generator/generator-sections"
import messages from "@/messages/en.json"

const personalSection = getPersonalSection((key: string) => key)

describe("SectionWrapper autosave", () => {
  test("calls the section mutation with cvId + serialized data on submit", async () => {
    render(<SectionWrapper {...personalSection} />, {
      initialState: {
        personal: {
          firstName: "Ada",
          middleName: "",
          lastName: "Lovelace",
          email: undefined,
          phone: "123",
          location: "London",
          birthDate: new Date("1990-01-01T00:00:00.000Z"),
          picture: "https://files.example.com/pic.png",
        },
      },
    })

    await userEvent.click(screen.getByRole("button", { name: messages.CreateFlow.actions.next }))

    expect(setPersonalMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        cvId: "abc123",
        data: expect.objectContaining({ firstName: "Ada", lastName: "Lovelace" }),
      })
    )
  })
})
