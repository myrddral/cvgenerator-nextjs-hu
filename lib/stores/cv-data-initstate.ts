import type { CvDataState } from "./cv-data-store.types"

const personalSection: CvDataState["personal"] = {
  firstName: "",
  middleName: "",
  lastName: "",
  birthDate: new Date(),
  phone: "",
  email: "",
  location: "",
  picture: "",
}

const linksSection: CvDataState["links"] = {
  linkedin: "",
  github: "",
  portfolio: "",
  webpage: "",
}

const skillsSection: CvDataState["skills"] = {
  occupation: "",
  skillsList: "",
}

const experienceSection: CvDataState["experience"] = [
  {
    employer: "",
    position: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
  },
]

const educationSection: CvDataState["education"] = [
  {
    institution: "",
    institutionType: undefined,
    major: "",
    specialization: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
  },
]

const languagesSection: CvDataState["languages"] = [
  {
    language: "",
    level: undefined,
  },
]

const interestsSection: CvDataState["interests"] = {
  topic: "",
}

export const defaultInitState: CvDataState = {
  personal: personalSection,
  links: linksSection,
  skills: skillsSection,
  experience: experienceSection,
  education: educationSection,
  languages: languagesSection,
  interests: interestsSection,
}
