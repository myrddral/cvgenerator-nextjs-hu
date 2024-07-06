"use client"

import type { PropsWithChildren, ReactNode } from "react"
import type { CvDataStore } from "@/lib/stores/cv-data-store"

import { initCvDataStore, createCvDataStore } from "@/lib/stores/cv-data-store"
import { createContext, useRef, useContext } from "react"
import { useStore } from "zustand"

export type CvDataStoreApi = ReturnType<typeof createCvDataStore>

// ***************** CONTEXT *****************
export const CvDataStoreContext = createContext<CvDataStoreApi | undefined>(undefined)

// **************** PROVIDER *****************
export const CvDataStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<CvDataStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createCvDataStore(initCvDataStore())
  }

  return <CvDataStoreContext.Provider value={storeRef.current}>{children}</CvDataStoreContext.Provider>
}

// ****************** HOOK ******************
export const useCvDataStore = <T,>(selector: (store: CvDataStore) => T): T => {
  const cvDataStoreContext = useContext(CvDataStoreContext)

  if (!cvDataStoreContext) {
    throw new Error(`useCounterStore must be used within CvDataStoreProvider`)
  }

  return useStore(cvDataStoreContext, selector)
}
