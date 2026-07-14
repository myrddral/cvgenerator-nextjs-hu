import { describe, expect, test, mock } from "bun:test"
import userEvent from "@testing-library/user-event"
import { render, screen } from "../../../test-utils"

const list = [
  { _id: "cv1", title: "Frontend Resume", updatedAt: 1700000000000, completedSections: ["personal"], pictureUrl: null },
]
const createMutation = mock(() => Promise.resolve("cv2"))
const removeMutation = mock(() => Promise.resolve(null))
const push = mock()

void mock.module("@/i18n/navigation", () => ({ useRouter: () => ({ push }) }))
void mock.module("convex/react", () => ({
  useQuery: () => list,
  useMutation: (ref: unknown) => (ref === "create" ? createMutation : removeMutation),
}))
void mock.module("@/convex/_generated/api", () => ({
  api: { cvs: { list: "list", create: "create", remove: "remove" } },
}))

import CvsPage from "./page"

describe("CvsPage", () => {
  test("lists saved cvs and starts a new one", async () => {
    render(<CvsPage />)

    expect(screen.getByText("Frontend Resume")).toBeTruthy()

    await userEvent.click(screen.getByRole("button", { name: "New resume" }))
    expect(createMutation).toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith("/create?cv=cv2")
  })
})
