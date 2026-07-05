import { describe, beforeAll, afterAll, it, expect } from "bun:test"
import { createCvDataStore } from "./cv-data-store"

// Reproduces the /show prerender crash: on the server, `sessionStorage` isn't
// a global, so zustand's persist middleware treats storage as unavailable and
// skips wiring up `api.persist` entirely (see zustand/esm/middleware.mjs).
describe("createCvDataStore when sessionStorage is unavailable (as on the server)", () => {
  const originalSessionStorage = globalThis.sessionStorage

  beforeAll(() => {
    // @ts-expect-error simulating the server environment, where this global doesn't exist
    delete globalThis.sessionStorage
  })

  afterAll(() => {
    globalThis.sessionStorage = originalSessionStorage
  })

  it("does not expose api.persist", () => {
    const store = createCvDataStore()

    expect(store.persist).toBeUndefined()
  })
})
