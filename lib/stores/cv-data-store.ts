"use client"
import type { CvDataState, CvDataStore } from "./cv-data-store.types"

import { persist, createJSONStorage } from "zustand/middleware"
import { defaultInitState } from "./cv-data-initstate"
import { createStore } from "zustand/vanilla"

const mockData = process.env.NODE_ENV === "development" ? require("@/mockdata/mock").default : undefined

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
        getSectionData: (section) => get()[section],
        setSectionData: (section, data) => set((state) => ({ [section]: { ...state[section], ...data } })),
        reset: () => set(defaultInitState),
        loadMockData: () => set(() => mockData),
      }),
      {
        name: "cv-data-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
}
