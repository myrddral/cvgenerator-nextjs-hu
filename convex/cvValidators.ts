import { v } from "convex/values"

export const personalValidator = v.object({
  firstName: v.string(),
  middleName: v.string(),
  lastName: v.string(),
  email: v.optional(v.string()),
  phone: v.string(),
  location: v.string(),
  birthDate: v.optional(v.number()),
})

export const linksValidator = v.object({
  linkedin: v.optional(v.string()),
  github: v.optional(v.string()),
  portfolio: v.optional(v.string()),
  webpage: v.optional(v.string()),
})

export const skillsValidator = v.object({
  occupation: v.string(),
  skillsList: v.string(),
})

export const experienceItemValidator = v.object({
  jobTitle: v.string(),
  employer: v.string(),
  description: v.string(),
  startDate: v.optional(v.number()),
  endDate: v.optional(v.number()),
  location: v.string(),
})

export const educationItemValidator = v.object({
  institution: v.string(),
  major: v.string(),
  specialization: v.string(),
  description: v.string(),
  startDate: v.optional(v.number()),
  endDate: v.optional(v.number()),
  location: v.string(),
})

export const languageItemValidator = v.object({
  language: v.string(),
  level: v.string(),
})

export const interestsValidator = v.object({
  interestsList: v.optional(v.string()),
})
