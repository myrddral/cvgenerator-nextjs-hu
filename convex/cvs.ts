import { ConvexError, v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"
import { mutation, query } from "./_generated/server"
import type { MutationCtx } from "./_generated/server"
import type { Doc, Id } from "./_generated/dataModel"
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

async function patchSection<K extends keyof Pick<
  Doc<"cvs">,
  "personal" | "links" | "skills" | "interests" | "experience" | "education" | "languages"
>>(ctx: MutationCtx, cvId: Id<"cvs">, section: K, data: Doc<"cvs">[K]) {
  const cv = await requireOwnedCv(ctx, cvId)
  const completedSections = cv.completedSections.includes(section)
    ? cv.completedSections
    : [...cv.completedSections, section]
  await ctx.db.patch(cvId, { [section]: data, completedSections, updatedAt: Date.now() } as Partial<
    Doc<"cvs">
  >)
  return null
}

export const setPersonal = mutation({
  args: { cvId: v.id("cvs"), data: personalValidator },
  returns: v.null(),
  handler: (ctx, args) => patchSection(ctx, args.cvId, "personal", args.data),
})

export const setLinks = mutation({
  args: { cvId: v.id("cvs"), data: linksValidator },
  returns: v.null(),
  handler: (ctx, args) => patchSection(ctx, args.cvId, "links", args.data),
})

export const setSkills = mutation({
  args: { cvId: v.id("cvs"), data: skillsValidator },
  returns: v.null(),
  handler: (ctx, args) => patchSection(ctx, args.cvId, "skills", args.data),
})

export const setInterests = mutation({
  args: { cvId: v.id("cvs"), data: interestsValidator },
  returns: v.null(),
  handler: (ctx, args) => patchSection(ctx, args.cvId, "interests", args.data),
})

export const setExperience = mutation({
  args: { cvId: v.id("cvs"), data: v.array(experienceItemValidator) },
  returns: v.null(),
  handler: (ctx, args) => patchSection(ctx, args.cvId, "experience", args.data),
})

export const setEducation = mutation({
  args: { cvId: v.id("cvs"), data: v.array(educationItemValidator) },
  returns: v.null(),
  handler: (ctx, args) => patchSection(ctx, args.cvId, "education", args.data),
})

export const setLanguages = mutation({
  args: { cvId: v.id("cvs"), data: v.array(languageItemValidator) },
  returns: v.null(),
  handler: (ctx, args) => patchSection(ctx, args.cvId, "languages", args.data),
})

export const remove = mutation({
  args: { cvId: v.id("cvs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const cv = await requireOwnedCv(ctx, args.cvId)
    if (cv.pictureId) {
      await ctx.storage.delete(cv.pictureId)
    }
    await ctx.db.delete(args.cvId)
    return null
  },
})
