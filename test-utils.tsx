import React, { type ReactElement } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { CvDataStoreProvider } from "./providers/cv-data-store-provider"

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider locale="en" messages={{}}>
      <CvDataStoreProvider>{children}</CvDataStoreProvider>
    </NextIntlClientProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }
