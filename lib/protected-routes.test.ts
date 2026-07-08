import { describe, expect, test } from "bun:test"
import { isProtectedPath } from "./protected-routes"

describe("isProtectedPath", () => {
  test.each([
    ["/create", true],
    ["/create/personal", true],
    ["/en/create", true],
    ["/hu/create/personal", true],
    ["/cvs", true],
    ["/en/cvs", true],
    ["/", false],
    ["/sign-in", false],
    ["/en/sign-in", false],
    ["/creates", false],
  ])("isProtectedPath(%s) === %s", (pathname, expected) => {
    expect(isProtectedPath(pathname)).toBe(expected)
  })
})
