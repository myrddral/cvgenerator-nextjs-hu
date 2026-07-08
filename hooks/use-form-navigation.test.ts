import { describe, expect, test, beforeEach, mock } from "bun:test"
import { renderHook } from "@testing-library/react"

const push = mock()

void mock.module("@/i18n/navigation", () => ({
  useRouter: () => ({ push }),
}))
void mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("cv=abc123"),
}))

import { useFormNavigation } from "./use-form-navigation"

describe("useFormNavigation", () => {
  beforeEach(() => {
    push.mockClear()
  })

  test("forwards the cv query param on the forward step", () => {
    const { result } = renderHook(() => useFormNavigation("personal"))
    result.current.handleForwardStep()
    expect(push).toHaveBeenCalledWith("/create/links?cv=abc123")
  })

  test("forwards the cv query param on the back step", () => {
    const { result } = renderHook(() => useFormNavigation("links"))
    result.current.handleBackStep()
    expect(push).toHaveBeenCalledWith("/create/personal?cv=abc123")
  })

  test("forwards to /show?cv=... after the last section", () => {
    const { result } = renderHook(() => useFormNavigation("interests"))
    result.current.handleForwardStep()
    expect(push).toHaveBeenCalledWith("/show?cv=abc123")
  })
})
