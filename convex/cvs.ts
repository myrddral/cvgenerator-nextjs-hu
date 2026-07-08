import { ConvexError, v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"
import { mutation, query } from "./_generated/server"
import { requireOwnedCv } from "./lib/cv"
import {
  personalValidator,
  linksValidator,
  skillsValidator,
  experienceItemValidator,
  educationItemValidator,
  languageItemValidator,
  interestsValidator,
} from "./cvValidators"

const cvSummaryValidator = v.object({
  _id: v.id("cvs"),
  title: v.string(),
  updatedAt: v.number(),
  completedSections: v.array(v.string()),
  pictureUrl: v.union(v.string(), v.null()),
})

const cvDetailValidator = v.object({
  _id: v.id("cvs"),
  title: v.string(),
  personal: v.optional(personalValidator),
  pictureUrl: v.union(v.string(), v.null()),
  links: v.optional(linksValidator),
  skills: v.optional(skillsValidator),
  experience: v.optional(v.array(experienceItemValidator)),
  education: v.optional(v.array(educationItemValidator)),
  languages: v.optional(v.array(languageItemValidator)),
  interests: v.optional(interestsValidator),
  completedSections: v.array(v.string()),
})

export const create = mutation({
  args: { title: v.optional(v.string()) },
  returns: v.id("cvs"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not signed in" })
    }
    return await ctx.db.insert("cvs", {
      userId,
      title: args.title ?? "Untitled CV",
      completedSections: [],
      updatedAt: Date.now(),
    })
  },
})

export const list = query({
  args: {},
  returns: v.array(cvSummaryValidator),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return []
    const cvs = await ctx.db
      .query("cvs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(50)
    return await Promise.all(
      cvs.map(async (cv) => ({
        _id: cv._id,
        title: cv.title,
        updatedAt: cv.updatedAt,
        completedSections: cv.completedSections,
        pictureUrl: cv.pictureId ? await ctx.storage.getUrl(cv.pictureId) : null,
      }))
    )
  },
})

export const get = query({
  args: { cvId: v.id("cvs") },
  returns: cvDetailValidator,
  handler: async (ctx, args) => {
    const cv = await requireOwnedCv(ctx, args.cvId)
    return {
      _id: cv._id,
      title: cv.title,
      personal: cv.personal,
      pictureUrl: cv.pictureId ? await ctx.storage.getUrl(cv.pictureId) : null,
      links: cv.links,
      skills: cv.skills,
      experience: cv.experience,
      education: cv.education,
      languages: cv.languages,
      interests: cv.interests,
      completedSections: cv.completedSections,
    }
  },
})
