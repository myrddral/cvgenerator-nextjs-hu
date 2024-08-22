import type {
  CvDataState,
  Employment,
  Language,
  Links,
  Personal,
  School,
  Skills,
  Interests,
} from "./cv-data-store.types"

const personalSection: Personal = {
  firstName: "",
  middleName: "",
  lastName: "",
  birthDate: new Date(),
  phone: "",
  email: "",
  location: "",
  picture: "",
}

const linksSection: Links = {
  linkedin: "",
  github: "",
  portfolio: "",
  webpage: "",
}

const skillsSection: Skills = {
  occupation: "",
  skillsList: "",
}

const experienceSection: Employment[] = [
  {
    employer: "",
    jobTitle: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
  },
]

const educationSection: School[] = [
  {
    institution: "",
    major: "",
    specialization: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
  },
]

const languagesSection: Language[] = [
  {
    language: "",
    level: "",
  },
]

const interestsSection: Interests = {
  interestsList: "",
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
