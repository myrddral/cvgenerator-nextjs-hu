import { describe, expect, test, mock } from "bun:test"
import userEvent from "@testing-library/user-event"
import { render } from "../../test-utils"

const generateUploadUrl = mock(() => Promise.resolve("https://upload.example.com/put"))
const setPicture = mock(() => Promise.resolve({ pictureUrl: "https://files.example.com/pic.png" }))
const originalFetch = global.fetch

void mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("cv=abc123"),
}))
void mock.module("convex/react", () => ({
  useMutation: (ref: unknown) => (ref === "generateUploadUrl" ? generateUploadUrl : setPicture),
}))
void mock.module("@/convex/_generated/api", () => ({
  api: { cvs: { generateUploadUrl: "generateUploadUrl", setPicture: "setPicture" } },
}))

import { InputImageFile } from "./input-image-file"

describe("InputImageFile", () => {
  test("uploads the file via Convex storage and reports the resolved url", async () => {
    global.fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ storageId: "storage123" })))) as unknown as typeof fetch
    const onChange = mock()
    const setError = mock()

    render(
      <InputImageFile
        name="picture"
        value=""
        setError={setError}
        onChange={onChange}
      />
    )

    const file = new File(["fake-bytes"], "photo.png", { type: "image/png" })
    const input = document.querySelector("input[type=file]") as HTMLInputElement
    await userEvent.upload(input, file)

    expect(generateUploadUrl).toHaveBeenCalled()
    expect(setPicture).toHaveBeenCalledWith({ cvId: "abc123", storageId: "storage123" })
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: "https://files.example.com/pic.png" }) })
    )

    global.fetch = originalFetch
  })
})
