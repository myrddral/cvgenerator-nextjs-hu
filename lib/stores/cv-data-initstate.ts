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

// Dates start unset (not today's date) so pickers show a placeholder until the user actually picks one
const UNSET_DATE = undefined as unknown as Date

const personalSection: Personal = {
  firstName: "",
  middleName: "",
  lastName: "",
  birthDate: UNSET_DATE,
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
    startDate: UNSET_DATE,
    endDate: UNSET_DATE,
    location: "",
  },
]

const educationSection: School[] = [
  {
    institution: "",
    major: "",
    specialization: "",
    description: "",
    startDate: UNSET_DATE,
    endDate: UNSET_DATE,
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
