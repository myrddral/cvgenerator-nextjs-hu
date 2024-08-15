import React, { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react"
import { CvDataStoreProvider } from "./providers/cv-data-store-provider"

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <CvDataStoreProvider>{children}</CvDataStoreProvider>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }
