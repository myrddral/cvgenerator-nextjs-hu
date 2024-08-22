import { z } from "zod"
import type { SectionName } from "@/lib/stores/cv-data-store.types"

const MAX_FILE_SIZE_IN_MB = 5
const MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MB * 1000000
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email cím kitöltése kötelező" })
    .max(255, { message: "Email cím maximum 255 karakter lehet" })
    .email({ message: "Érvénytelen email cím" }),
})

export const imageSchema = z
  .instanceof(File)
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "Csak JPG/PNG képek tölthetőek fel")
  .refine((file) => file.size <= MAX_FILE_SIZE, `A kép maximum ${MAX_FILE_SIZE_IN_MB}MB lehet.`)

const optionalUrlSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (val?.length) {
        return val.startsWith("https") || val.startsWith("http")
      }
      return true
    },
    { message: "Érvénytelen URL" }
  )

const personalSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Keresztnév kitöltése kötelező" })
    .max(50, { message: "Név maximum 255 karakter lehet" }),
  middleName: z.string().max(50, { message: "Név maximum 255 karakter lehet" }),
  lastName: z
    .string()
    .min(1, { message: "Vezetéknév kitöltése kötelező" })
    .max(50, { message: "Név maximum 255 karakter lehet" }),
  email: z
    .string()
    .min(1, { message: "Email cím kitöltése kötelező" })
    .max(255, { message: "Email cím maximum 255 karakter lehet" })
    .email({ message: "Érvénytelen email cím" })
    .optional(),
  phone: z
    .string()
    .min(1, { message: "Telefonszám kitöltése kötelező" })
    .max(17, { message: "Telefonszám maximum 255 karakter lehet" }),
  location: z.string().min(1, { message: "Lakóhely (település) kitöltése kötelező" }),
  birthDate: z.date({ message: "Dátum kitöltése kötelező" }),
  picture: z.string().min(1, { message: "Kép feltöltése kötelező" }),
})

const linksSchema = z.object({
  linkedin: optionalUrlSchema,
  github: optionalUrlSchema,
  portfolio: optionalUrlSchema,
  webpage: optionalUrlSchema,
})

const skillsSchema = z.object({
  occupation: z.string().min(1, { message: "Foglalkozás kitöltése kötelező" }),
  skillsList: z
    .string()
    .min(1, { message: "A szakmai ismeretek kitöltése kötelező" })
    .min(3, { message: "Ez sajnos túl rövid" }),
})

const experienceSchema = z.object({
  jobTitle: z.string().min(1, { message: "Foglalkozás kitöltése kötelező" }),
  employer: z.string().min(1, { message: "Munkáltató kitöltése kötelező" }),
  description: z
    .string()
    .min(1, { message: "Feladatok / eredmények kitöltése kötelező" })
    .min(3, { message: "Ez sajnos túl rövid" }),
  startDate: z.date({ message: "Dátum kitöltése kötelező" }),
  endDate: z.date({ message: "Dátum kitöltése kötelező" }),
  location: z.string().min(1, { message: "Munkavégzés helyének kitöltése kötelező" }),
})

const educationSchema = z.object({
  institution: z.string().min(1, { message: "Intézmény kitöltése kötelező" }),
  major: z.string(),
  specialization: z.string().min(1, { message: "Szakirány kitöltése kötelező" }),
  description: z.string(),
  startDate: z.date({ message: "Dátum kitöltése kötelező" }),
  endDate: z.date({ message: "Dátum kitöltése kötelező" }),
  location: z.string().min(1, { message: "Település kitöltése kötelező" }),
})

const languagesSchema = z.object({
  language: z.string().min(1, { message: "Nyelv kitöltése kötelező" }),
  level: z.string().min(1, { message: "Szint kitöltése kötelező" }),
})

const interestsSchema = z.object({
  interestsList: z.string().optional(),
})

export const sectionSchemas: Record<SectionName, z.ZodObject<any>> = {
  personal: personalSchema,
  links: linksSchema,
  skills: skillsSchema,
  experience: experienceSchema,
  education: educationSchema,
  languages: languagesSchema,
  interests: interestsSchema,
}

export type Personal = z.infer<typeof personalSchema>
export type Links = z.infer<typeof linksSchema>
export type Skills = z.infer<typeof skillsSchema>
export type Employment = z.infer<typeof experienceSchema>
export type School = z.infer<typeof educationSchema>
export type Language = z.infer<typeof languagesSchema>
export type Interests = z.infer<typeof interestsSchema>
export type Experience = Employment[]
export type Education = School[]
export type Languages = Language[]
