export type Section = {
  title: string
  sub?: string
  routeParam: string
  fields: {
    [key: string]: {
      label: string
      type: string
      autocomplete?: string
      defaultValue: string
      readonly?: boolean
    }
  }
}

export const allSections: Section[] = [
  {
    title: "A kezdéshez add meg az email címed",
    routeParam: "",
    fields: { email: { label: "Email cím", type: "email", autocomplete: "email", defaultValue: "" } },
  },
  {
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
      email: { label: "Email cím", type: "email", autocomplete: "email", defaultValue: "", readonly: true },
      phone: { label: "Telefonszám", type: "tel", autocomplete: "tel", defaultValue: "" },
      location: { label: "Lakóhely", type: "text", autocomplete: "address-level2", defaultValue: "" },
      birthDate: { label: "Születési dátum", type: "date", defaultValue: "" },
    },
  },
  {
    title: "Linkek",
    sub: "Az alábbi mezők opcionálisak",
    routeParam: "links",
    fields: {
      linkedin: { label: "LinkedIn", type: "url", defaultValue: "" },
      github: { label: "GitHub", type: "url", defaultValue: "" },
      portfolio: { label: "Portfólió", type: "url", defaultValue: "" },
      webpage: { label: "Weboldal", type: "url", defaultValue: "" },
    },
  },
  {
    title: "Szakmai ismeretek",
    routeParam: "skills",
    fields: {
      occupation: { label: "Foglalkozásod", type: "text", defaultValue: "" },
      skillsList: { label: "Szakmai ismereteid", type: "textarea", defaultValue: "" },
    },
  },
  {
    title: "Munkatapasztalat",
    routeParam: "experience",
    fields: {
      employer: { label: "Munkáltató", type: "text", defaultValue: "" },
      position: { label: "Pozíció", type: "text", defaultValue: "" },
      description: { label: "Feladatok / eredmények", type: "textarea", defaultValue: "" },
      startDate: { label: "Kezdés dátuma", type: "date", defaultValue: "" },
      endDate: { label: "Befejezés dátuma", type: "date", defaultValue: "" },
    },
  },
  {
    title: "Tanulmányok",
    routeParam: "education",
    fields: {
      institution: { label: "Intézmény neve", type: "text", defaultValue: "" },
      major: { label: "Szak", type: "text", defaultValue: "" },
      specialization: { label: "Szakirány", type: "text", defaultValue: "" },
      description: { label: "Rövid leírás", type: "textarea", defaultValue: "" },
      startDate: { label: "Kezdés dátuma", type: "date", defaultValue: "" },
      endDate: { label: "Befejezés dátuma", type: "date", defaultValue: "" },
    },
  },
  {
    title: "Nyelvismeret",
    routeParam: "languages",
    fields: {
      language: { label: "Nyelv", type: "text", defaultValue: "" },
      level: { label: "Szint", type: "text", defaultValue: "" },
    },
  },
  {
    title: "Érdeklődés",
    routeParam: "passions",
    fields: {
      passionsList: { label: "", type: "textarea", defaultValue: "" },
    },
  },
]

export const routeParams = allSections.map((section) => section.routeParam)
