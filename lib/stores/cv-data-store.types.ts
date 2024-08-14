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

// Extract only the keys that refer to a section with multi-entry (contains an array)
type MultiEntryKeys<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : never
}[keyof T]
export type SectionName = Extract<keyof CvDataState, string>
export type SectionNameWithMultiEntry = MultiEntryKeys<CvDataState>

export type CvDataActions = {
  setEmail: (email: CvDataState["personal"]["email"]) => void
  addToList: (sectionName: SectionName, item: Employment | School | Language) => void
  removeFromList: (sectionName: SectionNameWithMultiEntry, index: number) => void
  getSectionData: <T extends SectionName>(sectionName: T) => CvDataState[T]
  setSectionData: (sectionName: SectionName, data: Omit<CvDataState[SectionName], "email">) => void
  reset: () => void
  loadMockData: () => void
}

export type CvDataStore = CvDataState & CvDataActions
