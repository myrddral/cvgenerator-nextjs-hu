import { persist, createJSONStorage } from "zustand/middleware"
import { createStore } from "zustand/vanilla"
import { create } from "zustand"

export type CvDataState = {
  personal: {
    firstName: string
    middleName: string
    lastName: string
    birthDate: string
    phone: string
    email: string
    location: string
    picture: string
  }
  links: {
    linkedin: string
    github: string
    portfolio: string
    webpage: string
  }
  skills: {
    occupation: string
    skillsList: string
  }
  experience: {
    employer: string
    position: string
    description: string
    startDate: string
    endDate: string
  }
  education: {
    institution: string
    major: string
    specialization: string
    description: string
    startDate: string
    endDate: string
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
  setEmail: (state: CvDataState["personal"]["email"]) => void
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
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    email: "",
    location: "",
    picture: "",
  },
  links: {
    linkedin: "",
    github: "",
    portfolio: "",
    webpage: "",
  },
  skills: {
    occupation: "",
    skillsList: "",
  },
  experience: {
    employer: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
  },
  education: {
    institution: "",
    major: "",
    specialization: "",
    description: "",
    startDate: "",
    endDate: "",
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
    setEmail: (email) => set((state) => ({ personal: { ...state.personal, email } })),
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
      setEmail: (email) => set((state) => ({ personal: { ...state.personal, email } })),
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
