export const institutionOptionsHU = [
  "Általános iskola",
  "Gimnázium / Szakközépiskola",
  "Szakképzés",
  "Főiskola",
  "Egyetem",
  "Mesterképzés",
  "Szakirányú Továbbképzés",
  "Doktori Iskola",
  "Posztdoktori Kutatás",
] as const

export const institutionOptionsEN = [
  "Primary School",
  "Secondary School",
  "Vocational Training",
  "College",
  "University",
  "Master's Degree",
  "Further Education",
  "Doctoral School",
  "Postgraduate School",
] as const

export const languageOptionsHU = ["Magyar"] as const

export const languageOptionsEN = ["English, Magyar"] as const

export const languageLevelOptionsHU = [
  "Alapszint (A1 - A2)",
  "Alapfok (B1)",
  "Középfok (B2)",
  "Felsőfok (C1)",
  "Anyanyelvi szint",
] as const

export const languageLevelOptionsEN = [
  "Basic (A1 - A2)",
  "Beginner (B1)",
  "Intermediate (B2)",
  "Proficient (C1)",
  "Native",
] as const

export type InstitutionType = (typeof institutionOptionsHU)[number] | (typeof institutionOptionsEN)[number]
export type Language = (typeof languageOptionsHU)[number] | (typeof languageOptionsEN)[number]
export type LanguageLevel = (typeof languageLevelOptionsHU)[number] | (typeof languageLevelOptionsEN)[number]
