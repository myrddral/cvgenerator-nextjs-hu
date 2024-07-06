import { persist, createJSONStorage } from "zustand/middleware"
import { createStore } from "zustand/vanilla"
import { create } from "zustand"

export type CvDataState = {
  personal: {
    fullName: string
    birthDate: string
    phone: string
    email: string
    location: string
  }
  skills: {
    occupation: string
    skillsList: string
  }
  experience: {
    employer: string
    position: string
    description: string
    startYear: string
    endYear: string
  }
  education: {
    institution: string
    major: string
    specialization: string
    description: string
    startYear: string
    endYear: string
  }
  languages: {
    language: string
    level: string
  }
  passions: {
    passionsList: string
  }
}

export type CvDataActions = {
  setPersonal: (state: CvDataState["personal"]) => void
  setSkills: (state: CvDataState["skills"]) => void
  setExperience: (state: CvDataState["experience"]) => void
  setEducation: (state: CvDataState["education"]) => void
  setLanguages: (state: CvDataState["languages"]) => void
  setPassions: (state: CvDataState["passions"]) => void
}

export type CvDataStore = CvDataState & CvDataActions

export const initCvDataStore = (): CvDataState => {
  return defaultInitState
}

export const defaultInitState: CvDataState = {
  personal: {
    fullName: "",
    birthDate: "",
    phone: "",
    email: "",
    location: "",
  },
  skills: {
    occupation: "",
    skillsList: "",
  },
  experience: {
    employer: "",
    position: "",
    description: "",
    startYear: "",
    endYear: "",
  },
  education: {
    institution: "",
    major: "",
    specialization: "",
    description: "",
    startYear: "",
    endYear: "",
  },
  languages: {
    language: "",
    level: "",
  },
  passions: {
    passionsList: "",
  },
}

export const createCvDataStore = (initState = defaultInitState) => {
  return createStore<CvDataStore>()((set) => ({
    ...initState,
    setPersonal: (personal) => set({ personal }),
    setSkills: (skills) => set({ skills }),
    setExperience: (experience) => set({ experience }),
    setEducation: (education) => set({ education }),
    setLanguages: (languages) => set({ languages }),
    setPassions: (passions) => set({ passions }),
  }))
}

export const useCvDataStore = create<CvDataStore>()(
  persist(
    (set) => ({
      ...defaultInitState,
      setPersonal: (personal) => set({ personal }),
      setSkills: (skills) => set({ skills }),
      setExperience: (experience) => set({ experience }),
      setEducation: (education) => set({ education }),
      setLanguages: (languages) => set({ languages }),
      setPassions: (passions) => set({ passions }),
    }),
    {
      name: "cv-data-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
