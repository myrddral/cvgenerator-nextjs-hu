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

export type Field = {
  label: string
  type: FieldType
  autocomplete?: string
  placeholder?: string
  readonly?: boolean
  help?: string
}

export type Fields = {
  [key: string]: Field
}

export type SectionProps = {
  title: string
  sub?: string
  isMultiEntry?: boolean
  sectionName: SectionName | SectionNameWithMultiEntry
  fields: Fields
}

export const personalSection: SectionProps = {
  title: "Személyes adatok",
  sectionName: "personal",
  fields: {
    firstName: { label: "Keresztnév", type: "text", autocomplete: "given-name" },
    middleName: {
      label: "Középső név (opcionális)",
      type: "text",
      autocomplete: "additional-name",
    },
    lastName: { label: "Vezetéknév", type: "text", autocomplete: "family-name" },
    email: { label: "Email cím", type: "email", autocomplete: "email", readonly: true },
    phone: { label: "Telefonszám", type: "tel", autocomplete: "tel" },
    location: { label: "Lakóhely", type: "text", autocomplete: "address-level2" },
    birthDate: { label: "Születési dátum", type: "date" },
    picture: { label: "Portréfotó", type: "image" },
  },
}

export const linksSection: SectionProps = {
  title: "Linkek",
  sub: "Az alábbi mezők opcionálisak",
  sectionName: "links",
  fields: {
    linkedin: { label: "LinkedIn", type: "url" },
    github: { label: "GitHub", type: "url" },
    portfolio: { label: "Portfólió", type: "url" },
    webpage: { label: "Weboldal", type: "url" },
  },
}

export const skillsSection: SectionProps = {
  title: "Szakmai ismeretek",
  sectionName: "skills",
  fields: {
    occupation: {
      label: "Foglalkozásod",
      type: "text",
      help: "Azt a foglalkozást add meg, amire pályázol.",
    },
    skillsList: {
      label: "Szakmai ismereteid",
      type: "textarea",
      placeholder: "Mihez értesz? Miben van gyakorlati tapasztalatod?",
    },
  },
}

export const experienceSection: SectionProps = {
  title: "Munkatapasztalat",
  isMultiEntry: true,
  sectionName: "experience",
  fields: {
    title: { label: "Foglalkozás", type: "text" },
    employer: { label: "Munkáltató", type: "text" },
    description: {
      label: "Feladatok / eredmények",
      type: "textarea",
      placeholder: "Milyen feladatokat végeztél? Milyen eredményeket értél el?",
    },
    startDate: { label: "Kezdés dátuma", type: "date" },
    endDate: { label: "Befejezés dátuma", type: "date" },
  },
}

export const educationSection: SectionProps = {
  title: "Tanulmányok",
  isMultiEntry: true,
  sectionName: "education",
  fields: {
    institution: { label: "Intézmény neve", type: "text" },
    // major: { label: "Szak", type: "text" },
    specialization: { label: "Szakirány", type: "text" },
    description: { label: "Rövid leírás", type: "textarea" },
    startDate: { label: "Kezdés dátuma", type: "date" },
    endDate: { label: "Befejezés dátuma", type: "date" },
  },
}

export const languagesSection: SectionProps = {
  title: "Nyelvismeret",
  isMultiEntry: true,
  sectionName: "languages",
  fields: {
    language: { label: "Nyelv", type: "text" },
    level: { label: "Szint", type: "text" },
  },
}

export const interestsSection: SectionProps = {
  title: "Érdeklődés",
  sectionName: "interests",
  fields: {
    interestsList: {
      label: "",
      type: "textarea",
      placeholder: "Pl.: Olvasás, sport, hangszerek, szakmai fórumok, önkéntes tevékenységek",
    },
  },
}

export const allSections: SectionProps[] = [
  personalSection,
  linksSection,
  skillsSection,
  experienceSection,
  educationSection,
  languagesSection,
  interestsSection,
]

export const routeParams: RouteParamType[] = allSections.map((section) => section.sectionName)

export const sectionMap: Map<RouteParamType, SectionProps> = new Map(
  allSections.map((sectionObj) => [sectionObj.sectionName, sectionObj])
)
