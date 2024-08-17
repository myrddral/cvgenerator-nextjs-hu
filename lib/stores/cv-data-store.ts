"use client"
import type { CvDataState, CvDataStore } from "./cv-data-store.types"

import { persist, createJSONStorage } from "zustand/middleware"
import { defaultInitState } from "./cv-data-initstate"
import { createStore } from "zustand/vanilla"

export const initCvDataStore = (): CvDataState => {
  return { ...defaultInitState }
}

export const createCvDataStore = (initState: CvDataState = defaultInitState) => {
  return createStore<CvDataStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setEmail: (email) => set((state) => ({ personal: { ...state.personal, email } })),
        addToList: (section, item) => set((state) => ({ [section]: [...(state[section] as any[]), item] })),
        removeFromList: (section, index) =>
          set((state) => ({ [section]: state[section].filter((_, idx) => idx !== index) })),
        getSectionData: (section) => get()[section],
        setSectionData: (section, data) => set((state) => ({ [section]: { ...state[section], ...data } })),
        reset: () => set(defaultInitState),
      }),
      {
        name: "cv-data-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
}
