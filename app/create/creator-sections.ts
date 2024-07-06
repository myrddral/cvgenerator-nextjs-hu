export type Section = {
  title: string
  routeParam: string
  fields: { [key: string]: { label: string; type: string; autocomplete?: string; defaultValue: string } }
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
      fullName: { label: "Név", type: "text", autocomplete: "name", defaultValue: "" },
      email: { label: "Email cím", type: "email", autocomplete: "email", defaultValue: "" },
      phone: { label: "Telefonszám", type: "tel", autocomplete: "tel", defaultValue: "" },
      location: { label: "Lakóhely", type: "text", autocomplete: "address-level2", defaultValue: "" },
      birthDate: { label: "Születési dátum", type: "date", defaultValue: "" },
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
      startYear: { label: "Kezdés éve", type: "number", defaultValue: "" },
      endYear: { label: "Befejezés éve", type: "number", defaultValue: "" },
    },
  },
  {
    title: "Végzettség",
    routeParam: "education",
    fields: {
      institution: { label: "Intézmény neve", type: "text", defaultValue: "" },
      major: { label: "Szak", type: "text", defaultValue: "" },
      specialization: { label: "Szakirány", type: "text", defaultValue: "" },
      description: { label: "Rövid leírás", type: "textarea", defaultValue: "" },
      startYear: { label: "Kezdés éve", type: "number", defaultValue: "" },
      endYear: { label: "Befejezés éve", type: "number", defaultValue: "" },
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
