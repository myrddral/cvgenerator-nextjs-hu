// This file is needed to make DOM testing work with Bun. jsdom is not compatible with Bun as of now.
import { GlobalRegistrator } from "@happy-dom/global-registrator"
import { afterEach } from "bun:test"

// A base URL is required for next/image's dev-mode duplicate-src check,
// which resolves relative `src` values (e.g. "/placeholder.jpg") against
// `window.location.href` — happy-dom's default "about:blank" can't act as
// a relative-resolution base and throws "Invalid URL".
GlobalRegistrator.register({ url: "http://localhost:3000/" })

// @testing-library/react's auto-cleanup only registers once, the first time
// the module is imported, so it doesn't fire after every test file when
// Bun's module cache shares that import across files. Register it explicitly.
// Imported dynamically (after GlobalRegistrator.register()) since
// @testing-library/dom captures `document` at import time, and ESM import
// hoisting would otherwise load it before the DOM global exists.
const { cleanup } = await import("@testing-library/react")

afterEach(() => {
  cleanup()
})
