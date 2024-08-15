import type { SectionName, SectionNameWithMultiEntry } from "@/lib/stores/cv-data-store.types"

type FieldType =
  | "text"
  | "textarea"
  | "tel"
  | "email"
  | "url"
  | "date"
  | "image"
  | "number"
  | "select"
  | "hidden"

export type RouteParamType =
  | "personal"
  | "links"
  | "skills"
  | "experience"
  | "education"
  | "languages"
  | "interests"

export type FieldProps = {
  label: string
  type: FieldType
  autocomplete?: string
  placeholder?: string
  readonly?: boolean
  help?: string
}

export type Fields = {
  [key: string]: FieldProps
}

export type SectionProps = {
  title: string
  sub?: string
  isMultiEntry?: boolean
  sectionName: SectionName | SectionNameWithMultiEntry
  fields: Fields
}
