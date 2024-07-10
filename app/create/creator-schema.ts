import { z } from "zod"

const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email cím megadása kötelező" })
    .max(255, { message: "Email cím maximum 255 karakter lehet" })
    .email({ message: "Érvénytelen email cím" }),
})

const personalSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Keresztnév megadása kötelező" })
    .max(50, { message: "Név maximum 255 karakter lehet" }),
  middleName: z.string().max(50, { message: "Név maximum 255 karakter lehet" }),
  lastName: z
    .string()
    .min(1, { message: "Vezetéknév megadása kötelező" })
    .max(50, { message: "Név maximum 255 karakter lehet" }),
  email: z
    .string()
    .min(1, { message: "Email cím megadása kötelező" })
    .max(255, { message: "Email cím maximum 255 karakter lehet" })
    .email({ message: "Érvénytelen email cím" }),
  phone: z
    .string()
    .min(1, { message: "Telefonszám megadása kötelező" })
    .max(17, { message: "Telefonszám maximum 255 karakter lehet" }),
  location: z.string().min(1, { message: "Lakóhely (település) megadása kötelező" }),
  birthDate: z.date({ message: "Dátum megadása kötelező" }),
})

const linksSchema = z.object({
  linkedin: z
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
    ),
  github: z
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
    ),
  portfolio: z
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
    ),
  webpage: z
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
    ),
})

const skillsSchema = z.object({
  occupation: z.string().min(1, { message: "Foglalkozás megadása kötelező" }),
  skillsList: z
    .string()
    .min(1, { message: "A képességek kitöltése kötelező" })
    .min(3, { message: "Ez sajnos túl rövid" }),
})

const experienceSchema = z.object({
  employer: z.string().min(1, { message: "Munkáltató megadása kötelező" }),
  position: z.string().min(1, { message: "Beosztás megadása kötelező" }),
  description: z
    .string()
    .min(1, { message: "Feladatok / eredmények megadása kötelező" })
    .min(3, { message: "Ez sajnos túl rövid" }),
  startDate: z
    .string()
    .min(4, { message: "A kezdőév megadása kötelező" })
    .max(4, { message: "A kezdőév maximum 4 karakter lehet" }),
  endDate: z
    .string()
    .min(4, { message: "A záróév megadása kötelező" })
    .max(4, { message: "A záróév maximum 4 karakter lehet" }),
})

const educationSchema = z.object({
  institution: z.string().min(1, { message: "Intézmény megadása kötelező" }),
  major: z.string(),
  specialization: z.string().min(1, { message: "Szakirány megadása kötelező" }),
  description: z.string(),
  startDate: z
    .string()
    .min(4, { message: "A kezdőév megadása kötelező" })
    .max(4, { message: "A kezdőév maximum 4 karakter lehet" }),
  endDate: z
    .string()
    .min(4, { message: "A záróév megadása kötelező" })
    .max(4, { message: "A záróév maximum 4 karakter lehet" }),
})

const languagesSchema = z.object({
  language: z.string().min(1, { message: "Nyelv megadása kötelező" }),
  level: z.string().min(1, { message: "Szint megadása kötelező" }),
})

const passionsSchema = z.object({
  passionsList: z.string(),
})

export const schemas = {
  email: emailSchema,
  personal: personalSchema,
  links: linksSchema,
  skills: skillsSchema,
  experience: experienceSchema,
  education: educationSchema,
  languages: languagesSchema,
  passions: passionsSchema,
}
