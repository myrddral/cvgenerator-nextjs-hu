import type { CvDataStore } from "./lib/stores/cv-data-store.types"

import React, { type ReactElement } from "react"
import { afterEach } from "bun:test"
import { render, type RenderOptions } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { CvDataStoreProvider } from "./providers/cv-data-store-provider"
import messages from "./messages/en.json"

// The store persists to sessionStorage, which happy-dom keeps alive across
// tests in the same file/process. Clear it so one test's state (e.g. seeded
// via `initialState`, or written by interacting with the rendered UI) can't
// leak into the next.
afterEach(() => {
  sessionStorage.clear()
})

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialState?: Partial<CvDataStore>
}

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { initialState, ...renderOptions } = options ?? {}

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <NextIntlClientProvider locale="en" messages={messages}>
        <CvDataStoreProvider initialState={initialState}>{children}</CvDataStoreProvider>
      </NextIntlClientProvider>
    )
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions })
}

export * from "@testing-library/react"
export { customRender as render }
