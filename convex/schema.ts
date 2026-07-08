import { defineSchema, defineTable } from "convex/server"
import { authTables } from "@convex-dev/auth/server"
import { v } from "convex/values"
import {
  personalValidator,
  linksValidator,
  skillsValidator,
  experienceItemValidator,
  educationItemValidator,
  languageItemValidator,
  interestsValidator,
} from "./cvValidators"

export default defineSchema({
  ...authTables,
  cvs: defineTable({
    userId: v.id("users"),
    title: v.string(),
    personal: v.optional(personalValidator),
    pictureId: v.optional(v.id("_storage")),
    links: v.optional(linksValidator),
    skills: v.optional(skillsValidator),
    experience: v.optional(v.array(experienceItemValidator)),
    education: v.optional(v.array(educationItemValidator)),
    languages: v.optional(v.array(languageItemValidator)),
    interests: v.optional(interestsValidator),
    completedSections: v.array(v.string()),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
})
