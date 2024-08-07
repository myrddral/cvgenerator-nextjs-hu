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
  | "passions"

export type SectionProps = {
  title: string
  sub?: string
  isMultiEntry?: boolean
  routeParam: RouteParamType
  fields: {
    [key: string]: {
      label: string
      type: FieldType
      autocomplete?: string
      placeholder?: string
      defaultValue: string
      readonly?: boolean
      help?: string
    }
  }
}

export const personalSection: SectionProps = {
  title: "Személyes adatok",
  routeParam: "personal",
  fields: {
    firstName: { label: "Keresztnév", type: "text", autocomplete: "given-name", defaultValue: "" },
    middleName: {
      label: "Középső név (opcionális)",
      type: "text",
      autocomplete: "additional-name",
      defaultValue: "",
    },
    lastName: { label: "Vezetéknév", type: "text", autocomplete: "family-name", defaultValue: "" },
    phone: { label: "Telefonszám", type: "tel", autocomplete: "tel", defaultValue: "" },
    location: { label: "Lakóhely", type: "text", autocomplete: "address-level2", defaultValue: "" },
    birthDate: { label: "Születési dátum", type: "date", defaultValue: "" },
    picture: { label: "Portréfotó", type: "image", defaultValue: "" },
  },
}

export const linksSection: SectionProps = {
  title: "Linkek",
  sub: "Az alábbi mezők opcionálisak",
  routeParam: "links",
  fields: {
    linkedin: { label: "LinkedIn", type: "url", defaultValue: "" },
    github: { label: "GitHub", type: "url", defaultValue: "" },
    portfolio: { label: "Portfólió", type: "url", defaultValue: "" },
    webpage: { label: "Weboldal", type: "url", defaultValue: "" },
  },
}

export const skillsSection: SectionProps = {
  title: "Szakmai ismeretek",
  routeParam: "skills",
  fields: {
    occupation: {
      label: "Foglalkozásod",
      type: "text",
      defaultValue: "",
      help: "Azt a foglalkozást add meg, amire pályázol.",
    },
    skillsList: {
      label: "Szakmai ismereteid",
      type: "textarea",
      placeholder: "Mihez értesz? Miben van gyakorlati tapasztalatod?",
      defaultValue: "",
    },
  },
}

export const experienceSection: SectionProps = {
  title: "Munkatapasztalat",
  isMultiEntry: true,
  routeParam: "experience",
  fields: {
    employer: { label: "Munkáltató", type: "text", defaultValue: "" },
    position: { label: "Pozíció", type: "text", defaultValue: "" },
    description: {
      label: "Feladatok / eredmények",
      type: "textarea",
      placeholder: "Milyen feladatokat végeztél? Milyen eredményeket értél el?",
      defaultValue: "",
    },
    startDate: { label: "Kezdés dátuma", type: "date", defaultValue: "" },
    endDate: { label: "Befejezés dátuma", type: "date", defaultValue: "" },
  },
}

export const educationSection: SectionProps = {
  title: "Tanulmányok",
  isMultiEntry: true,
  routeParam: "education",
  fields: {
    institution: { label: "Intézmény neve", type: "text", defaultValue: "" },
    major: { label: "Szak", type: "text", defaultValue: "" },
    specialization: { label: "Szakirány", type: "text", defaultValue: "" },
    description: { label: "Rövid leírás", type: "textarea", defaultValue: "" },
    startDate: { label: "Kezdés dátuma", type: "date", defaultValue: "" },
    endDate: { label: "Befejezés dátuma", type: "date", defaultValue: "" },
  },
}

export const languagesSection: SectionProps = {
  title: "Nyelvismeret",
  isMultiEntry: true,
  routeParam: "languages",
  fields: {
    language: { label: "Nyelv", type: "text", defaultValue: "" },
    level: { label: "Szint", type: "text", defaultValue: "" },
  },
}

export const passionsSection: SectionProps = {
  title: "Érdeklődés",
  routeParam: "passions",
  fields: {
    passionsList: {
      label: "",
      type: "textarea",
      placeholder: "Pl.: Olvasás, sport, hangszerek, szakmai fórumok, önkéntes tevékenységek",
      defaultValue: "",
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
  passionsSection,
]

export const routeParams: RouteParamType[] = allSections.map((section) => section.routeParam)

export const sectionMap: Map<RouteParamType, SectionProps> = new Map(
  allSections.map((sectionObj) => [sectionObj.routeParam, sectionObj])
)
