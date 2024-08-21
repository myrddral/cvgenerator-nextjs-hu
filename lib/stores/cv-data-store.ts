"use client"
import type { CvDataState, CvDataStore } from "./cv-data-store.types"

import { persist, createJSONStorage } from "zustand/middleware"
import { defaultInitState } from "./cv-data-initstate"
import { createStore } from "zustand/vanilla"

export const initCvDataStore = (): CvDataState => {
  return { ...defaultInitState }
}

// TODO: move completedSections to a separate store
export const createCvDataStore = (initState: CvDataState = defaultInitState) => {
  return createStore<CvDataStore>()(
    persist(
      (set) => ({
        ...initState,
        completedSections: [],
        markSectionAsCompleted: (section) =>
          set((state) => ({
            completedSections: state.completedSections.includes(section)
              ? state.completedSections
              : [...state.completedSections, section],
          })),
        setEmail: (email) => set((state) => ({ personal: { ...state.personal, email } })),
        setSectionData: (section, data) =>
          set((state) => ({
            [section]: Array.isArray(state[section])
              ? [...(state[section] as []), data]
              : { ...state[section], ...data },
          })),
        removeFromList: (section, selectedItemIdx) =>
          set((state) => ({ [section]: state[section].filter((_, idx) => idx !== selectedItemIdx) })),
        resetStore: () => set(defaultInitState),
      }),
      {
        name: "cv-data-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
}
