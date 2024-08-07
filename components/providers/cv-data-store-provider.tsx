"use client"
import type { ReactNode } from "react"
import type { CvDataStore } from "@/lib/stores/cv-data-store.types"

import { useStore } from "zustand"
import { createContext, useRef, useContext } from "react"
import { createCvDataStore, initCvDataStore } from "@/lib/stores/cv-data-store"

export type CvDataStoreApi = ReturnType<typeof createCvDataStore>

export const CvDataStoreContext = createContext<CvDataStoreApi | undefined>(undefined)

export interface CvDataStoreProviderProps {
  children: ReactNode
}

export const CvDataStoreProvider = ({ children }: CvDataStoreProviderProps) => {
  const storeRef = useRef<CvDataStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createCvDataStore(initCvDataStore())
  }

  return <CvDataStoreContext.Provider value={storeRef.current}>{children}</CvDataStoreContext.Provider>
}

export const useCvDataStore = <T,>(selector: (store: CvDataStore) => T): T => {
  const cvDataStoreContext = useContext(CvDataStoreContext)

  if (!cvDataStoreContext) {
    throw new Error(`useCvDataStore must be used within CvDataStoreProvider`)
  }

  return useStore(cvDataStoreContext, selector)
}
