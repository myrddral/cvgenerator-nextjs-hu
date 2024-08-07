import type { InstitutionType, LanguageLevel } from "@/form-generator/constants"

export type Personal = {
  firstName: string
  middleName: string
  lastName: string
  birthDate: Date
  phone: string
  email: string
  location: string
  picture: string
}

export type Links = {
  linkedin: string
  github: string
  portfolio: string
  webpage: string
}

export type Skills = {
  occupation: string
  skillsList: string
}

export type Employment = {
  employer: string
  position: string
  description: string
  startDate: Date
  endDate: Date
}

export type School = {
  institution: string
  institutionType: InstitutionType | undefined
  major?: string
  specialization: string
  description?: string
  startDate: Date
  endDate: Date
}

export type Language = {
  language: string
  level: LanguageLevel | undefined
}

export type Topic = {
  topic: string
}

export type CvDataState = {
  personal: Personal
  links: Links
  skills: Skills
  experience: Employment[]
  education: School[]
  languages: Language[]
  interests: Topic
}

export type Section = keyof CvDataState

export type CvDataActions = {
  setEmail: (state: CvDataState["personal"]["email"]) => void
  addToList: (section: Section, state: Employment | School | Language) => void
  getSectionData: (section: Section) => CvDataState[Section]
  setSectionData: (section: Section, data: Omit<CvDataState[Section], "email">) => void
  reset: () => void
  loadMockData: () => void
}

export type CvDataStore = CvDataState & CvDataActions
