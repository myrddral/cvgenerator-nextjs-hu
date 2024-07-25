import type { Section } from "@/app/create/creator-sections"

type Fields = Section["fields"]

export const getDefaultValues = (fields: Fields) => ({
  ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.defaultValue])),
})
