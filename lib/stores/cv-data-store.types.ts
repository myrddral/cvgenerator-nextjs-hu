import type {
  Personal,
  Links,
  Skills,
  Employment,
  School,
  Language,
  Interests,
} from "@/form-generator/validation-schemas"

export type {
  Personal,
  Links,
  Skills,
  Employment,
  School,
  Language,
  Interests,
} from "@/form-generator/validation-schemas"

export type CvDataState = {
  personal: Personal
  links: Links
  skills: Skills
  experience: Employment[]
  education: School[]
  languages: Language[]
  interests: Interests
}

export type CompletedSectionsState = {
  completedSections: string[]
}

export type CompletedSectionsActions = {
  markSectionAsCompleted: (section: SectionName) => void
}

// Extract only the keys that refer to a section with multi-entry (contains an array)
type MultiEntryKeys<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : never
}[keyof T]
export type SectionName = Extract<keyof CvDataState, string>
export type SectionNameWithMultiEntry = MultiEntryKeys<CvDataState>

export type CvDataActions = {
  markSectionAsCompleted: (section: SectionName) => void
  setEmail: (email: CvDataState["personal"]["email"]) => void
  removeFromList: (sectionName: SectionNameWithMultiEntry, index: number) => void
  setSectionData: (sectionName: SectionName, data: Omit<CvDataState[SectionName], "email">) => void
  resetStore: () => void
}

export type CvDataStore = CvDataState & CvDataActions & CompletedSectionsState & CompletedSectionsActions
