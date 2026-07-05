"use client"
import type { ReactNode } from "react"
import type { CvDataStore } from "@/lib/stores/cv-data-store.types"

import { useStore } from "zustand"
import { createContext, useState, useContext } from "react"
import { createCvDataStore, initCvDataStore } from "@/lib/stores/cv-data-store"

export type CvDataStoreApi = ReturnType<typeof createCvDataStore>
export interface CvDataStoreProviderProps {
  children: ReactNode
  /**
   * Overrides state after the store is created, taking precedence over any
   * value rehydrated from persisted storage. Intended for seeding state in tests.
   */
  initialState?: Partial<CvDataStore>
}

export const CvDataStoreContext = createContext<CvDataStoreApi | undefined>(undefined)

export const CvDataStoreProvider = ({ children, initialState }: CvDataStoreProviderProps) => {
  const [store] = useState<CvDataStoreApi>(() => {
    const cvDataStore = createCvDataStore(initCvDataStore())
    if (initialState) cvDataStore.setState(initialState)
    return cvDataStore
  })

  return <CvDataStoreContext.Provider value={store}>{children}</CvDataStoreContext.Provider>
}

export const useCvDataStore = <T,>(selector: (store: CvDataStore) => T): T => {
  const cvDataStoreContext = useContext(CvDataStoreContext)

  if (!cvDataStoreContext) throw new Error(`useCvDataStore must be used within CvDataStoreProvider`)

  return useStore(cvDataStoreContext, selector)
}

export const useCvDataStoreApi = (): CvDataStoreApi => {
  const cvDataStoreContext = useContext(CvDataStoreContext)

  if (!cvDataStoreContext) throw new Error(`useCvDataStoreApi must be used within CvDataStoreProvider`)

  return cvDataStoreContext
}
