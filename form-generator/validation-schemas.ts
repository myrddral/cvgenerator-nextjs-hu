import { z } from "zod"
import type { SectionName } from "@/lib/stores/cv-data-store.types"

type Translate = (key: string, values?: Record<string, string | number>) => string

const MAX_FILE_SIZE_IN_MB = 5
const MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MB * 1000000
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

export function getEmailSchema(t: Translate) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t("validation.email.required") })
      .max(255, { message: t("validation.email.max") })
      .email({ message: t("validation.email.invalid") }),
  })
}

export function getImageSchema(t: Translate) {
  return z
    .instanceof(File)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), t("validation.image.type"))
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      t("validation.image.maxSize", { size: MAX_FILE_SIZE_IN_MB })
    )
}

function getOptionalUrlSchema(t: Translate) {
  return z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val?.length) {
          return val.startsWith("https") || val.startsWith("http")
        }
        return true
      },
      { message: t("validation.url.invalid") }
    )
}

function withDateRangeValidation<T extends z.ZodObject<{ startDate: z.ZodTypeAny; endDate: z.ZodTypeAny }>>(
  schema: T,
  t: Translate
) {
  return schema.refine((data) => !data.startDate || !data.endDate || data.startDate <= data.endDate, {
    message: t("validation.common.dateRangeInvalid"),
    path: ["endDate"],
  })
}

export function getSectionSchemas(t: Translate) {
  const optionalUrlSchema = getOptionalUrlSchema(t)

  return {
    personal: z.object({
      firstName: z
        .string()
        .min(1, { message: t("validation.personal.firstNameRequired") })
        .max(50, { message: t("validation.personal.nameMax") }),
      middleName: z.string().max(50, { message: t("validation.personal.nameMax") }),
      lastName: z
        .string()
        .min(1, { message: t("validation.personal.lastNameRequired") })
        .max(50, { message: t("validation.personal.nameMax") }),
      email: z
        .string()
        .min(1, { message: t("validation.email.required") })
        .max(255, { message: t("validation.email.max") })
        .email({ message: t("validation.email.invalid") })
        .optional(),
      phone: z
        .string()
        .min(1, { message: t("validation.personal.phoneRequired") })
        .max(17, { message: t("validation.personal.phoneMax") }),
      location: z.string().min(1, { message: t("validation.personal.locationRequired") }),
      birthDate: z.date({ message: t("validation.personal.birthDateRequired") }),
      picture: z.string().min(1, { message: t("validation.personal.pictureRequired") }),
    }),
    links: z.object({
      linkedin: optionalUrlSchema,
      github: optionalUrlSchema,
      portfolio: optionalUrlSchema,
      webpage: optionalUrlSchema,
    }),
    skills: z.object({
      occupation: z.string().min(1, { message: t("validation.skills.occupationRequired") }),
      skillsList: z
        .string()
        .min(1, { message: t("validation.skills.skillsListRequired") })
        .min(3, { message: t("validation.common.tooShort") }),
    }),
    experience: withDateRangeValidation(
      z.object({
        jobTitle: z.string().min(1, { message: t("validation.experience.jobTitleRequired") }),
        employer: z.string().min(1, { message: t("validation.experience.employerRequired") }),
        description: z
          .string()
          .min(1, { message: t("validation.experience.descriptionRequired") })
          .min(3, { message: t("validation.common.tooShort") }),
        startDate: z.date({ message: t("validation.common.dateRequired") }),
        endDate: z.date({ message: t("validation.common.dateRequired") }),
        location: z.string().min(1, { message: t("validation.experience.locationRequired") }),
      }),
      t
    ),
    education: withDateRangeValidation(
      z.object({
        institution: z.string().min(1, { message: t("validation.education.institutionRequired") }),
        major: z.string(),
        specialization: z.string().min(1, { message: t("validation.education.specializationRequired") }),
        description: z.string(),
        startDate: z.date({ message: t("validation.common.dateRequired") }),
        endDate: z.date({ message: t("validation.common.dateRequired") }),
        location: z.string().min(1, { message: t("validation.education.locationRequired") }),
      }),
      t
    ),
    languages: z.object({
      language: z.string().min(1, { message: t("validation.languages.languageRequired") }),
      level: z.string().min(1, { message: t("validation.languages.levelRequired") }),
    }),
    interests: z.object({
      interestsList: z.string().optional(),
    }),
  } satisfies Record<SectionName, z.ZodType<any>>
}

type SectionSchemas = ReturnType<typeof getSectionSchemas>

export type Personal = z.infer<SectionSchemas["personal"]>
export type Links = z.infer<SectionSchemas["links"]>
export type Skills = z.infer<SectionSchemas["skills"]>
export type Employment = z.infer<SectionSchemas["experience"]>
export type School = z.infer<SectionSchemas["education"]>
export type Language = z.infer<SectionSchemas["languages"]>
export type Interests = z.infer<SectionSchemas["interests"]>
export type Experience = Employment[]
export type Education = School[]
export type Languages = Language[]
