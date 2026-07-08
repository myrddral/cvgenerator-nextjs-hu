# Persist CV Form Data (incl. Profile Picture) Per User Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Signed-in users can save multiple named CVs to Convex, resume editing them across sessions/devices, and store the profile picture as a real Convex-storage file instead of a base64 string.

**Architecture:** One `cvs` Convex table (one doc per saved CV, `userId`-indexed), one mutation per CV section that autosaves right after the existing zustand `setSectionData` call, and a `cvId` threaded through `/create/*` as a `?cv=` query param. `/create` and `/cvs` are gated behind Convex Auth in `proxy.ts`. The picture goes through `ctx.storage` (`generateUploadUrl` → client `fetch` PUT → `setPicture`), replacing the current `FileReader`-to-base64 flow.

**Tech Stack:** Convex 1.42 (`@convex-dev/auth` 0.0.94 already wired), Next.js 16 App Router, next-intl, zustand 5, react-hook-form + zod, Bun test runner (existing component tests use `bun:test` + `@happy-dom/global-registrator`), Vitest + `convex-test` for Convex function tests (per `convex/_generated/ai/guidelines.md`, `convex-test` requires Vitest — added as a second, Convex-only test runner; `bun test` stays the runner for everything else).

## Global Constraints

- Every public Convex function needs both `args` and `returns` validators (project + Convex guideline).
- No `.filter()` on Convex queries — index and `.withIndex()` instead; no unbounded `.collect()`.
- Never accept a `userId` as a function argument for authorization — derive it via `getAuthUserId(ctx)` from `@convex-dev/auth/server` inside the function.
- Store the `Id<"_storage">`, never a resolved URL, in the database; resolve `ctx.storage.getUrl()` on read.
- `convex/schema.ts` field additions must be `v.optional(...)` where existing rows might lack them (not a concern here — `cvs` is a brand-new table, so all required fields can be required from day one).
- Files with `"use server"` only export async functions (N/A here, no server actions used). Middleware file is `proxy.ts`, not `middleware.ts`.
- Follow this repo's existing test idioms: `bun:test`, `mock.module(...)` for mocking hooks/modules, the shared `render` from `test-utils.tsx`.

---

## Backend (Convex)

### Task 1: Convex test harness + shared validators + schema

**Files:**
- Create: `convex/cvValidators.ts`
- Modify: `convex/schema.ts`
- Create: `vitest.config.ts`
- Modify: `package.json`
- Test: `convex/cvs.test.ts` (started here, extended in later tasks)

**Interfaces:**
- Produces: `personalValidator`, `linksValidator`, `skillsValidator`, `experienceItemValidator`, `educationItemValidator`, `languageItemValidator`, `interestsValidator` (all `convex/values` object validators) — every later Convex task imports these from `convex/cvValidators.ts`. Produces the `cvs` table in the schema with index `by_user`.

- [ ] **Step 1: Install the Convex test toolchain**

```bash
bun add -d vitest convex-test @edge-runtime/vm
```

- [ ] **Step 2: Add `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "edge-runtime",
  },
})
```

- [ ] **Step 3: Add a Convex-only test script to `package.json`**

Add under `"scripts"` (keep every existing script untouched):

```json
"test:convex": "vitest run"
```

- [ ] **Step 4: Write `convex/cvValidators.ts`**

```ts
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
```

- [ ] **Step 5: Write the failing test for the schema (via the `create`/`get` functions that Task 2 will add)**

Skip a standalone schema test — Convex schemas have no behavior to assert in isolation. Move straight to Task 2, which writes the schema-exercising test.

- [ ] **Step 6: Update `convex/schema.ts`**

```ts
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
```

- [ ] **Step 7: Commit**

```bash
git add convex/cvValidators.ts convex/schema.ts vitest.config.ts package.json bun.lock
git commit -m "feat: add cvs table schema and Convex test harness"
```

---

### Task 2: `requireOwnedCv` helper + `create`/`list`/`get`

**Files:**
- Create: `convex/lib/cv.ts`
- Create: `convex/cvs.ts`
- Test: `convex/cvs.test.ts`

**Interfaces:**
- Consumes: validators from `convex/cvValidators.ts` (Task 1).
- Produces: `requireOwnedCv(ctx, cvId): Promise<Doc<"cvs">>` (throws `ConvexError` if unauthenticated or not the owner) — every later mutation/query in `convex/cvs.ts` calls this. Produces `api.cvs.create({ title? }): Id<"cvs">`, `api.cvs.list({}): Array<{ _id, title, updatedAt, completedSections, pictureUrl }>`, `api.cvs.get({ cvId }): {...} | null`.

- [ ] **Step 1: Write the failing tests**

```ts
/// <reference types="vite/client" />
import { convexTest } from "convex-test"
import { expect, test } from "vitest"
import { api } from "./_generated/api"
import schema from "./schema"

const modules = import.meta.glob("./**/*.ts")

async function signedInUser(t: ReturnType<typeof convexTest>) {
  const userId = await t.run((ctx) => ctx.db.insert("users", {}))
  return { userId, asUser: t.withIdentity({ subject: userId }) }
}

test("create requires auth", async () => {
  const t = convexTest(schema, modules)
  await expect(t.mutation(api.cvs.create, {})).rejects.toThrow()
})

test("create + list roundtrip for the owning user only", async () => {
  const t = convexTest(schema, modules)
  const { asUser: asOwner } = await signedInUser(t)
  const { asUser: asOther } = await signedInUser(t)

  const cvId = await asOwner.mutation(api.cvs.create, { title: "My Resume" })

  const ownerList = await asOwner.query(api.cvs.list, {})
  expect(ownerList).toMatchObject([{ _id: cvId, title: "My Resume", completedSections: [] }])

  const otherList = await asOther.query(api.cvs.list, {})
  expect(otherList).toEqual([])
})

test("get returns the full doc for the owner and null pictureUrl by default", async () => {
  const t = convexTest(schema, modules)
  const { asUser } = await signedInUser(t)
  const cvId = await asUser.mutation(api.cvs.create, { title: "My Resume" })

  const cv = await asUser.query(api.cvs.get, { cvId })
  expect(cv).toMatchObject({ _id: cvId, title: "My Resume", pictureUrl: null })
})

test("get throws for a non-owner", async () => {
  const t = convexTest(schema, modules)
  const { asUser: asOwner } = await signedInUser(t)
  const { asUser: asOther } = await signedInUser(t)
  const cvId = await asOwner.mutation(api.cvs.create, { title: "My Resume" })

  await expect(asOther.query(api.cvs.get, { cvId })).rejects.toThrow()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test:convex`
Expected: FAIL — `convex/cvs.ts` doesn't exist yet (`Cannot find module './_generated/api'` export `cvs`, or import error).

- [ ] **Step 3: Write `convex/lib/cv.ts`**

```ts
import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError } from "convex/values"
import type { Doc, Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"

export async function requireOwnedCv(
  ctx: QueryCtx | MutationCtx,
  cvId: Id<"cvs">
): Promise<Doc<"cvs">> {
  const userId = await getAuthUserId(ctx)
  if (userId === null) {
    throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not signed in" })
  }
  const cv = await ctx.db.get(cvId)
  if (cv === null || cv.userId !== userId) {
    throw new ConvexError({ code: "NOT_FOUND", message: "CV not found" })
  }
  return cv
}
```

- [ ] **Step 4: Write `convex/cvs.ts` (create/list/get only for now)**

```ts
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
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `bun run test:convex`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add convex/lib/cv.ts convex/cvs.ts convex/cvs.test.ts
git commit -m "feat: add cvs create/list/get Convex functions"
```

---

### Task 3: Section-update mutations (`setPersonal`, `setLinks`, `setSkills`, `setInterests`, `setExperience`, `setEducation`, `setLanguages`) + `remove`

**Files:**
- Modify: `convex/cvs.ts`
- Test: `convex/cvs.test.ts`

**Interfaces:**
- Consumes: `requireOwnedCv` (Task 2).
- Produces: `api.cvs.setPersonal({ cvId, data })`, `api.cvs.setLinks`, `api.cvs.setSkills`, `api.cvs.setInterests` (each `{ cvId, data }` → `v.null()`); `api.cvs.setExperience({ cvId, data: Array<...> })`, `api.cvs.setEducation`, `api.cvs.setLanguages` (whole-array overwrite); `api.cvs.remove({ cvId }): v.null()`. All patch `updatedAt` and add the section name to `completedSections` if missing. These are the exact function references `lib/cv-sync.ts` (Task 6) will call.

- [ ] **Step 1: Write the failing tests**

Append to `convex/cvs.test.ts`:

```ts
test("setPersonal patches the section and marks it completed", async () => {
  const t = convexTest(schema, modules)
  const { asUser } = await signedInUser(t)
  const cvId = await asUser.mutation(api.cvs.create, {})

  await asUser.mutation(api.cvs.setPersonal, {
    cvId,
    data: {
      firstName: "Ada",
      middleName: "",
      lastName: "Lovelace",
      phone: "123",
      location: "London",
    },
  })

  const cv = await asUser.query(api.cvs.get, { cvId })
  expect(cv?.personal).toMatchObject({ firstName: "Ada", lastName: "Lovelace" })
  expect(cv?.completedSections).toEqual(["personal"])
})

test("setExperience overwrites the whole array", async () => {
  const t = convexTest(schema, modules)
  const { asUser } = await signedInUser(t)
  const cvId = await asUser.mutation(api.cvs.create, {})

  await asUser.mutation(api.cvs.setExperience, {
    cvId,
    data: [
      { jobTitle: "Engineer", employer: "Acme", description: "Built things", location: "Remote" },
    ],
  })
  await asUser.mutation(api.cvs.setExperience, { cvId, data: [] })

  const cv = await asUser.query(api.cvs.get, { cvId })
  expect(cv?.experience).toEqual([])
})

test("section mutations reject a non-owner", async () => {
  const t = convexTest(schema, modules)
  const { asUser: asOwner } = await signedInUser(t)
  const { asUser: asOther } = await signedInUser(t)
  const cvId = await asOwner.mutation(api.cvs.create, {})

  await expect(
    asOther.mutation(api.cvs.setSkills, { cvId, data: { occupation: "x", skillsList: "y" } })
  ).rejects.toThrow()
})

test("remove deletes the cv", async () => {
  const t = convexTest(schema, modules)
  const { asUser } = await signedInUser(t)
  const cvId = await asUser.mutation(api.cvs.create, {})

  await asUser.mutation(api.cvs.remove, { cvId })

  await expect(asUser.query(api.cvs.get, { cvId })).rejects.toThrow()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test:convex`
Expected: FAIL — `api.cvs.setPersonal` etc. are `undefined`.

- [ ] **Step 3: Add the mutations to `convex/cvs.ts`**

Add below `get`:

```ts
import type { MutationCtx } from "./_generated/server"
import type { Doc, Id } from "./_generated/dataModel"

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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test:convex`
Expected: PASS (9 tests)

- [ ] **Step 5: Commit**

```bash
git add convex/cvs.ts convex/cvs.test.ts
git commit -m "feat: add per-section cv autosave mutations and remove"
```

---

### Task 4: Picture upload mutations (`generateUploadUrl`, `setPicture`)

**Files:**
- Modify: `convex/cvs.ts`
- Test: `convex/cvs.test.ts`

**Interfaces:**
- Consumes: `requireOwnedCv`.
- Produces: `api.cvs.generateUploadUrl({}): string`, `api.cvs.setPicture({ cvId, storageId }): { pictureUrl: string | null }` — exact shape `components/ui/input-image-file.tsx` (Task 9) calls.

- [ ] **Step 1: Write the failing tests**

Append to `convex/cvs.test.ts`:

```ts
test("setPicture stores the file id and resolves a url", async () => {
  const t = convexTest(schema, modules)
  const { asUser } = await signedInUser(t)
  const cvId = await asUser.mutation(api.cvs.create, {})

  const uploadUrl = await asUser.mutation(api.cvs.generateUploadUrl, {})
  expect(typeof uploadUrl).toBe("string")

  const storageId = await t.run((ctx) =>
    ctx.storage.store(new Blob(["fake-image-bytes"], { type: "image/png" }))
  )

  const result = await asUser.mutation(api.cvs.setPicture, { cvId, storageId })
  expect(result.pictureUrl).not.toBeNull()

  const cv = await asUser.query(api.cvs.get, { cvId })
  expect(cv?.pictureUrl).toEqual(result.pictureUrl)
})

test("setPicture deletes the previous file when replaced", async () => {
  const t = convexTest(schema, modules)
  const { asUser } = await signedInUser(t)
  const cvId = await asUser.mutation(api.cvs.create, {})

  const firstId = await t.run((ctx) => ctx.storage.store(new Blob(["one"], { type: "image/png" })))
  await asUser.mutation(api.cvs.setPicture, { cvId, storageId: firstId })

  const secondId = await t.run((ctx) => ctx.storage.store(new Blob(["two"], { type: "image/png" })))
  await asUser.mutation(api.cvs.setPicture, { cvId, storageId: secondId })

  const firstStillThere = await t.run((ctx) => ctx.storage.getUrl(firstId))
  expect(firstStillThere).toBeNull()
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test:convex`
Expected: FAIL — `api.cvs.generateUploadUrl` / `api.cvs.setPicture` are `undefined`.

- [ ] **Step 3: Add the mutations to `convex/cvs.ts`**

```ts
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not signed in" })
    }
    return await ctx.storage.generateUploadUrl()
  },
})

export const setPicture = mutation({
  args: { cvId: v.id("cvs"), storageId: v.id("_storage") },
  returns: v.object({ pictureUrl: v.union(v.string(), v.null()) }),
  handler: async (ctx, args) => {
    const cv = await requireOwnedCv(ctx, args.cvId)
    if (cv.pictureId && cv.pictureId !== args.storageId) {
      await ctx.storage.delete(cv.pictureId)
    }
    await ctx.db.patch(args.cvId, { pictureId: args.storageId, updatedAt: Date.now() })
    return { pictureUrl: await ctx.storage.getUrl(args.storageId) }
  },
})
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test:convex`
Expected: PASS (11 tests)

- [ ] **Step 5: Verify the whole backend against a real deployment**

```bash
npx tsc --noEmit
CONVEX_AGENT_MODE=anonymous npx convex dev --once
```

Expected: no TypeScript errors; Convex push logs no `Schema validation failed`, `ReturnsValidationError`, or `ArgumentValidationError`.

- [ ] **Step 6: Commit**

```bash
git add convex/cvs.ts convex/cvs.test.ts
git commit -m "feat: add cv picture upload mutations"
```

---

## Frontend

### Task 5: `hooks/use-cv-id.ts` + `lib/protected-routes.ts`

**Files:**
- Create: `hooks/use-cv-id.ts`
- Create: `lib/protected-routes.ts`
- Test: `lib/protected-routes.test.ts`

**Interfaces:**
- Produces: `useCvId(): string | null` (reads the `cv` search param) — consumed by `hooks/use-form-navigation.ts`, `components/email-form.tsx`, `components/section-wrapper.tsx`, `components/ui/input-image-file.tsx`, `app/[locale]/cvs/page.tsx` (Tasks 6–9). Produces `isProtectedPath(pathname: string): boolean` — consumed by `proxy.ts` (Task 6).

- [ ] **Step 1: Write the failing test for `isProtectedPath`**

```ts
import { describe, expect, test } from "bun:test"
import { isProtectedPath } from "./protected-routes"

describe("isProtectedPath", () => {
  test.each([
    ["/create", true],
    ["/create/personal", true],
    ["/en/create", true],
    ["/hu/create/personal", true],
    ["/cvs", true],
    ["/en/cvs", true],
    ["/", false],
    ["/sign-in", false],
    ["/en/sign-in", false],
    ["/creates", false],
  ])("isProtectedPath(%s) === %s", (pathname, expected) => {
    expect(isProtectedPath(pathname)).toBe(expected)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test lib/protected-routes.test.ts`
Expected: FAIL with "Cannot find module './protected-routes'"

- [ ] **Step 3: Write `lib/protected-routes.ts`**

```ts
const PROTECTED_PATTERN = /^\/(en|hu)?\/?(create|cvs)(\/.*)?$/

/** Paths that require an authenticated Convex session, checked in `proxy.ts`. */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATTERN.test(pathname)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test lib/protected-routes.test.ts`
Expected: PASS (10 cases)

- [ ] **Step 5: Write `hooks/use-cv-id.ts` (no test — thin wrapper over a Next.js hook, exercised end-to-end in Task 8/9's component tests)**

```ts
"use client"
import { useSearchParams } from "next/navigation"

/** The `?cv=<id>` query param identifying which saved CV is being edited. */
export function useCvId(): string | null {
  return useSearchParams().get("cv")
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/protected-routes.ts lib/protected-routes.test.ts hooks/use-cv-id.ts
git commit -m "feat: add protected-route matcher and cvId query-param hook"
```

---

### Task 6: Gate `/create` and `/cvs` behind auth in `proxy.ts`

**Files:**
- Modify: `proxy.ts`

**Interfaces:**
- Consumes: `isProtectedPath` (Task 5).

- [ ] **Step 1: Update `proxy.ts`**

```ts
import { convexAuthNextjsMiddleware, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { isProtectedPath } from "./lib/protected-routes"

const intlMiddleware = createMiddleware(routing)

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isProtectedPath(request.nextUrl.pathname) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/sign-in")
  }
  return intlMiddleware(request)
})

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)", "/api/auth"],
}
```

- [ ] **Step 2: Manually verify**

Run: `npx convex dev` (in one terminal) and `bun run dev` (in another), then in the browser: visit `/create` while signed out → confirm redirect to `/sign-in`. Sign in, visit `/create` again → confirm it loads.

- [ ] **Step 3: Commit**

```bash
git add proxy.ts
git commit -m "feat: require sign-in for /create and /cvs"
```

---

### Task 7: `lib/cv-sync.ts` — date (de)serialization + section→mutation lookup

**Files:**
- Create: `lib/cv-sync.ts`
- Test: `lib/cv-sync.test.ts`

**Interfaces:**
- Consumes: `Personal`, `Employment`, `School` types from `@/lib/stores/cv-data-store.types` (existing); `api.cvs.*` mutation refs (Task 2–4).
- Produces: `toEpoch`, `fromEpoch`, `serializePersonal`, `deserializePersonal`, `serializeExperienceList`, `deserializeExperienceList`, `serializeEducationList`, `deserializeEducationList`, `getSectionMutationRef(section)` — consumed by `components/section-wrapper.tsx` (Task 9) and `app/[locale]/create/layout.tsx` (Task 8).

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, test } from "bun:test"
import {
  toEpoch,
  fromEpoch,
  serializePersonal,
  deserializePersonal,
  serializeExperienceList,
  deserializeExperienceList,
} from "./cv-sync"

describe("toEpoch / fromEpoch", () => {
  test("round-trips a Date through epoch ms", () => {
    const date = new Date("2020-01-15T00:00:00.000Z")
    expect(fromEpoch(toEpoch(date))).toEqual(date)
  })

  test("returns undefined for an undefined date", () => {
    expect(toEpoch(undefined)).toBeUndefined()
    expect(fromEpoch(undefined)).toBeUndefined()
  })
})

describe("serializePersonal / deserializePersonal", () => {
  test("drops the picture field and converts birthDate to epoch ms", () => {
    const birthDate = new Date("1990-05-01T00:00:00.000Z")
    const serialized = serializePersonal({
      firstName: "Ada",
      middleName: "",
      lastName: "Lovelace",
      email: "ada@example.com",
      phone: "123",
      location: "London",
      birthDate,
      picture: "data:image/png;base64,xxx",
    })

    expect(serialized).toEqual({
      firstName: "Ada",
      middleName: "",
      lastName: "Lovelace",
      email: "ada@example.com",
      phone: "123",
      location: "London",
      birthDate: birthDate.getTime(),
    })
  })

  test("deserializes server data back into a Personal, filling in the picture url", () => {
    const birthDate = new Date("1990-05-01T00:00:00.000Z")
    const result = deserializePersonal(
      {
        firstName: "Ada",
        middleName: "",
        lastName: "Lovelace",
        phone: "123",
        location: "London",
        birthDate: birthDate.getTime(),
      },
      "https://files.example.com/pic.png"
    )

    expect(result).toEqual({
      firstName: "Ada",
      middleName: "",
      lastName: "Lovelace",
      email: "",
      phone: "123",
      location: "London",
      birthDate,
      picture: "https://files.example.com/pic.png",
    })
  })

  test("deserializes with defaults when there is no server data yet", () => {
    const result = deserializePersonal(undefined, null)
    expect(result).toMatchObject({ firstName: "", lastName: "", picture: "" })
  })
})

describe("serializeExperienceList / deserializeExperienceList", () => {
  test("round-trips startDate/endDate through epoch ms", () => {
    const startDate = new Date("2015-01-01T00:00:00.000Z")
    const endDate = new Date("2019-01-01T00:00:00.000Z")
    const list = [
      { jobTitle: "Engineer", employer: "Acme", description: "Built things", startDate, endDate, location: "Remote" },
    ]

    const serialized = serializeExperienceList(list)
    expect(serialized).toEqual([
      {
        jobTitle: "Engineer",
        employer: "Acme",
        description: "Built things",
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        location: "Remote",
      },
    ])
    expect(deserializeExperienceList(serialized)).toEqual(list)
  })

  test("deserializes undefined as an empty list", () => {
    expect(deserializeExperienceList(undefined)).toEqual([])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test lib/cv-sync.test.ts`
Expected: FAIL with "Cannot find module './cv-sync'"

- [ ] **Step 3: Write `lib/cv-sync.ts`**

```ts
import { api } from "@/convex/_generated/api"
import type { FunctionReference } from "convex/server"
import type { Employment, Personal, School, SectionName } from "@/lib/stores/cv-data-store.types"

export function toEpoch(date: Date | undefined): number | undefined {
  return date ? date.getTime() : undefined
}

export function fromEpoch(epoch: number | undefined): Date | undefined {
  return epoch !== undefined ? new Date(epoch) : undefined
}

type ServerPersonal = Omit<Personal, "picture" | "birthDate"> & { birthDate?: number }

export function serializePersonal(personal: Personal): ServerPersonal {
  const { picture: _picture, birthDate, ...rest } = personal
  return { ...rest, birthDate: toEpoch(birthDate) }
}

export function deserializePersonal(data: ServerPersonal | undefined, pictureUrl: string | null): Personal {
  return {
    firstName: data?.firstName ?? "",
    middleName: data?.middleName ?? "",
    lastName: data?.lastName ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    location: data?.location ?? "",
    birthDate: fromEpoch(data?.birthDate) as Date,
    picture: pictureUrl ?? "",
  }
}

type ServerExperience = Omit<Employment, "startDate" | "endDate"> & {
  startDate?: number
  endDate?: number
}

export function serializeExperienceList(list: Employment[]): ServerExperience[] {
  return list.map(({ startDate, endDate, ...rest }) => ({
    ...rest,
    startDate: toEpoch(startDate),
    endDate: toEpoch(endDate),
  }))
}

export function deserializeExperienceList(list: ServerExperience[] | undefined): Employment[] {
  return (list ?? []).map((item) => ({
    ...item,
    startDate: fromEpoch(item.startDate) as Date,
    endDate: fromEpoch(item.endDate) as Date,
  }))
}

type ServerEducation = Omit<School, "startDate" | "endDate"> & { startDate?: number; endDate?: number }

export function serializeEducationList(list: School[]): ServerEducation[] {
  return list.map(({ startDate, endDate, ...rest }) => ({
    ...rest,
    startDate: toEpoch(startDate),
    endDate: toEpoch(endDate),
  }))
}

export function deserializeEducationList(list: ServerEducation[] | undefined): School[] {
  return (list ?? []).map((item) => ({
    ...item,
    startDate: fromEpoch(item.startDate) as Date,
    endDate: fromEpoch(item.endDate) as Date,
  }))
}

/** Maps a wizard section to its autosave mutation reference. */
export function getSectionMutationRef(
  section: SectionName
): FunctionReference<"mutation", "public", any, any> {
  const map: Record<SectionName, FunctionReference<"mutation", "public", any, any>> = {
    personal: api.cvs.setPersonal,
    links: api.cvs.setLinks,
    skills: api.cvs.setSkills,
    experience: api.cvs.setExperience,
    education: api.cvs.setEducation,
    languages: api.cvs.setLanguages,
    interests: api.cvs.setInterests,
  }
  return map[section]
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test lib/cv-sync.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/cv-sync.ts lib/cv-sync.test.ts
git commit -m "feat: add cv-sync serialization helpers and section mutation lookup"
```

---

### Task 8: Hydrate zustand from Convex in the create flow + cvId forwarding

**Files:**
- Modify: `app/[locale]/create/layout.tsx`
- Create: `components/cv-sync-boundary.tsx`
- Modify: `hooks/use-form-navigation.ts`
- Modify: `components/email-form.tsx`
- Test: `hooks/use-form-navigation.test.ts`

**Interfaces:**
- Consumes: `useCvId` (Task 5), `getSectionMutationRef`/deserialize helpers (Task 7), `useCvDataStoreApi` (existing), `api.cvs.get` (existing).
- Produces: `<CvSyncBoundary>` wraps `{children}` in the create layout, redirecting to `/cvs` when there's no `cv` param and hydrating the store once the query resolves.

- [ ] **Step 1: Write the failing test for `useFormNavigation`'s cvId forwarding**

```ts
import { describe, expect, test, beforeEach, mock } from "bun:test"
import { renderHook } from "@testing-library/react"

const push = mock()

void mock.module("@/i18n/navigation", () => ({
  useRouter: () => ({ push }),
}))
void mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("cv=abc123"),
}))

import { useFormNavigation } from "./use-form-navigation"

describe("useFormNavigation", () => {
  beforeEach(() => {
    push.mockClear()
  })

  test("forwards the cv query param on the forward step", () => {
    const { result } = renderHook(() => useFormNavigation("personal"))
    result.current.handleForwardStep()
    expect(push).toHaveBeenCalledWith("/create/links?cv=abc123")
  })

  test("forwards the cv query param on the back step", () => {
    const { result } = renderHook(() => useFormNavigation("links"))
    result.current.handleBackStep()
    expect(push).toHaveBeenCalledWith("/create/personal?cv=abc123")
  })

  test("forwards to /show?cv=... after the last section", () => {
    const { result } = renderHook(() => useFormNavigation("interests"))
    result.current.handleForwardStep()
    expect(push).toHaveBeenCalledWith("/show?cv=abc123")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test hooks/use-form-navigation.test.ts`
Expected: FAIL — pushes are called without `?cv=abc123`.

- [ ] **Step 3: Update `hooks/use-form-navigation.ts`**

```ts
"use client"
import type { RouteParamType } from "@/form-generator/form-generator.types"

import { routeParams } from "@/form-generator/generator-sections"
import { useRouter } from "@/i18n/navigation"
import { useCvId } from "./use-cv-id"

/**
 * This hook is used to navigate between sections in the form.
 * It handles the forward and backward navigation based on the current route parameter,
 * carrying the `?cv=` query param along on every navigation.
 *
 * @param routeParam - The current route parameter.
 * @returns An object with two functions: handleForwardStep and handleBackStep.
 */
export const useFormNavigation = (routeParam: RouteParamType) => {
  const router = useRouter()
  const cvId = useCvId()
  const suffix = cvId ? `?cv=${cvId}` : ""

  const handleForwardStep = () => {
    const nextSectionIndex = routeParams.indexOf(routeParam) + 1
    const nextSection = routeParams[nextSectionIndex]
    if (nextSection) {
      router.push(`/create/${nextSection}${suffix}`)
    } else router.push(`/show${suffix}`)
  }

  const handleBackStep = () => {
    const prevSectionIndex = routeParams.indexOf(routeParam) - 1
    const prevSection = routeParams[prevSectionIndex]
    if (prevSection) {
      router.push(`/create/${prevSection}${suffix}`)
    } else router.push(`/create/email${suffix}`)
  }

  return { handleForwardStep, handleBackStep }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test hooks/use-form-navigation.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Update `components/email-form.tsx`**

Remove the reset-on-mount effect (a returning user hydrating an existing CV must not get wiped) and forward `cv`:

```tsx
"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getEmailSchema } from "@/form-generator/validation-schemas"
import { useCvDataStore } from "@/providers/cv-data-store-provider"
import { useCvId } from "@/hooks/use-cv-id"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMemo } from "react"

export function EmailForm() {
  const router = useRouter()
  const cvId = useCvId()
  const t = useTranslations("CreateFlow")
  const setEmail = useCvDataStore((state) => state.setEmail)
  const emailSchema = useMemo(() => getEmailSchema(t), [t])
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: z.infer<typeof emailSchema>) {
    setEmail(data.email)
    router.push(cvId ? `/create/personal?cv=${cvId}` : "/create/personal")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-12 md:max-w-[420px]">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative w-full">
              <FormLabel className="text-foreground">{t("emailStep.emailLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("emailStep.emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage className="absolute -bottom-5 animate-in fade-in-0" />
            </FormItem>
          )}
        />
        <Button type="submit" className="self-end">
          {t("emailStep.submit")}
        </Button>
      </form>
    </Form>
  )
}
```

- [ ] **Step 6: Write `components/cv-sync-boundary.tsx`**

```tsx
"use client"
import type { PropsWithChildren } from "react"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useEffect, useRef } from "react"
import { useRouter } from "@/i18n/navigation"
import { useCvId } from "@/hooks/use-cv-id"
import { useCvDataStoreApi } from "@/providers/cv-data-store-provider"
import type { Id } from "@/convex/_generated/dataModel"
import {
  deserializePersonal,
  deserializeExperienceList,
  deserializeEducationList,
} from "@/lib/cv-sync"

export function CvSyncBoundary({ children }: PropsWithChildren) {
  const router = useRouter()
  const cvId = useCvId()
  const cv = useQuery(api.cvs.get, cvId ? { cvId: cvId as Id<"cvs"> } : "skip")
  const storeApi = useCvDataStoreApi()
  const hydratedForCvId = useRef<string | null>(null)

  useEffect(() => {
    if (!cvId) {
      router.replace("/cvs")
    }
  }, [cvId, router])

  useEffect(() => {
    if (!cv || !cvId || hydratedForCvId.current === cvId) return
    hydratedForCvId.current = cvId

    storeApi.setState({
      personal: deserializePersonal(cv.personal, cv.pictureUrl),
      links: {
        linkedin: cv.links?.linkedin ?? "",
        github: cv.links?.github ?? "",
        portfolio: cv.links?.portfolio ?? "",
        webpage: cv.links?.webpage ?? "",
      },
      skills: cv.skills ?? { occupation: "", skillsList: "" },
      experience: deserializeExperienceList(cv.experience),
      education: deserializeEducationList(cv.education),
      languages: cv.languages ?? [],
      interests: cv.interests ?? { interestsList: "" },
      completedSections: cv.completedSections,
    })
  }, [cv, cvId, storeApi])

  return children
}
```

- [ ] **Step 7: Wire it into `app/[locale]/create/layout.tsx`**

```tsx
import type { PropsWithChildren } from "react"

import { Stepper } from "@/components/stepper"
import { CvSyncBoundary } from "@/components/cv-sync-boundary"
import { getAllSections } from "@/form-generator/generator-sections"
import { getTranslations } from "next-intl/server"

export default async function CreateLayout({ children }: PropsWithChildren) {
  const t = await getTranslations("CreateFlow")
  const allSections = getAllSections(t)

  return (
    <div className="flex w-full flex-1 flex-col items-center overflow-clip">
      <Stepper allSections={allSections} />
      <div className="flex w-full max-w-screen-md flex-1 flex-col items-center justify-center">
        <CvSyncBoundary>{children}</CvSyncBoundary>
      </div>
    </div>
  )
}
```

Note: `/create/email` has no `cv` param yet (it's created by the `/cvs` page, Task 10, before the user ever reaches `/create`), so exempt it from `CvSyncBoundary`'s redirect — move the `<CvSyncBoundary>` wrap so it's only applied inside `app/[locale]/create/[section]/page.tsx`'s tree, not around `/create/email`. Since `CreateLayout` wraps every `/create/*` route including `/create` (the email step) and `/create/[section]`, add a lightweight check instead: don't redirect when `cvId` is null AND the rendered route is the email step. Simplest correct fix — do the redirect inside `CvSyncBoundary` only when `cvId` is null for longer than one render tick is unnecessary; instead only mount `CvSyncBoundary` around section pages. Change `app/[locale]/create/[section]/page.tsx` to wrap its returned `<SectionWrapper>` with `<CvSyncBoundary>`, and revert `CreateLayout` to not wrap children itself:

```tsx
// app/[locale]/create/layout.tsx — no CvSyncBoundary here
export default async function CreateLayout({ children }: PropsWithChildren) {
  const t = await getTranslations("CreateFlow")
  const allSections = getAllSections(t)

  return (
    <div className="flex w-full flex-1 flex-col items-center overflow-clip">
      <Stepper allSections={allSections} />
      <div className="flex w-full max-w-screen-md flex-1 flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}
```

```tsx
// app/[locale]/create/[section]/page.tsx — add the boundary here only
import { CvSyncBoundary } from "@/components/cv-sync-boundary"
// ...unchanged imports

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  // ...unchanged body up to the return
  return (
    <CvSyncBoundary>
      <SectionWrapper
        sectionName={sectionName}
        isMultiEntry={isMultiEntry}
        fields={fields}
        title={title}
        sub={sub}
      />
    </CvSyncBoundary>
  )
}
```

- [ ] **Step 8: Manually verify**

In the browser: from `/cvs` (once Task 10 exists) create a CV, fill in "personal", navigate back to `/cvs`, click "Continue", confirm the form re-populates from Convex (not a blank form).

- [ ] **Step 9: Commit**

```bash
git add app/[locale]/create/layout.tsx "app/[locale]/create/[section]/page.tsx" components/cv-sync-boundary.tsx hooks/use-form-navigation.ts hooks/use-form-navigation.test.ts components/email-form.tsx
git commit -m "feat: hydrate cv wizard from Convex and forward cvId through navigation"
```

---

### Task 9: Autosave wiring in `section-wrapper.tsx`

**Files:**
- Modify: `components/section-wrapper.tsx`
- Test: `components/section-wrapper.test.tsx`

**Interfaces:**
- Consumes: `useCvId` (Task 5), `getSectionMutationRef`, `serializePersonal`, `serializeExperienceList`, `serializeEducationList` (Task 7).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, test, mock } from "bun:test"
import userEvent from "@testing-library/user-event"
import { render, screen } from "../test-utils"

const setPersonalMutation = mock(() => Promise.resolve(null))

void mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("cv=abc123"),
}))
void mock.module("convex/react", () => ({
  useMutation: () => setPersonalMutation,
}))

import { SectionWrapper } from "./section-wrapper"
import { getPersonalSection } from "@/form-generator/generator-sections"
import messages from "@/messages/en.json"

const personalSection = getPersonalSection((key: string) => key)

describe("SectionWrapper autosave", () => {
  test("calls the section mutation with cvId + serialized data on submit", async () => {
    render(<SectionWrapper {...personalSection} />, {
      initialState: {
        personal: {
          firstName: "Ada",
          middleName: "",
          lastName: "Lovelace",
          email: "",
          phone: "123",
          location: "London",
          birthDate: new Date("1990-01-01T00:00:00.000Z"),
          picture: "",
        },
      },
    })

    await userEvent.click(screen.getByRole("button", { name: messages.CreateFlow.actions.next }))

    expect(setPersonalMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        cvId: "abc123",
        data: expect.objectContaining({ firstName: "Ada", lastName: "Lovelace" }),
      })
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/section-wrapper.test.tsx`
Expected: FAIL — no mutation call happens today.

- [ ] **Step 3: Update `components/section-wrapper.tsx`**

Add the autosave call inside `onSubmit` (and `onDelete`, for multi-entry removals), right after the existing `setSectionData`/`removeFromList` calls:

```tsx
"use client"
import type { SectionProps } from "@/form-generator/form-generator.types"
import type {
  CvDataState,
  Employment,
  Language,
  School,
  SectionName,
  SectionNameWithMultiEntry,
} from "@/lib/stores/cv-data-store.types"
import type { z } from "zod"

import { SectionDataList } from "@/components/section-data-list"
import { FormStepCard } from "@/components/ui/formstep-card"
import { IconButton } from "@/components/ui/iconbutton"
import FormGenerator from "@/form-generator/form-generator"
import type { getSectionSchemas } from "@/form-generator/validation-schemas"
import { useFormNavigation } from "@/hooks/use-form-navigation"
import { useCvId } from "@/hooks/use-cv-id"
import { getSectionMutationRef, serializePersonal, serializeExperienceList, serializeEducationList } from "@/lib/cv-sync"
import { useMutation } from "convex/react"
import { PlusIcon } from "@radix-ui/react-icons"
import { useTranslations } from "next-intl"
import { useCallback, useState } from "react"
import { useCvDataStore, useCvDataStoreApi } from "../providers/cv-data-store-provider"
import { ConfirmDialog } from "./confirm-dialog"
import { FormDialog } from "./form-dialog"
import { Button } from "./ui/button"

type SectionSchemas = ReturnType<typeof getSectionSchemas>

export interface FormStepWrapperProps extends SectionProps {}

function serializeForSection(sectionName: SectionName, value: unknown) {
  if (sectionName === "personal") return serializePersonal(value as CvDataState["personal"])
  if (sectionName === "experience") return serializeExperienceList(value as Employment[])
  if (sectionName === "education") return serializeEducationList(value as School[])
  return value
}

export function SectionWrapper({ ...sectionProps }: FormStepWrapperProps) {
  const { title, sub, sectionName, isMultiEntry } = sectionProps
  const t = useTranslations("CreateFlow.actions")
  const { handleForwardStep, handleBackStep } = useFormNavigation(sectionName)
  const cvId = useCvId()
  const saveSection = useMutation(getSectionMutationRef(sectionName))
  const { setSectionData, removeFromList, markSectionAsCompleted } = useCvDataStore((state) => state)
  const storeApi = useCvDataStoreApi()
  const sectionData = useCvDataStore((state) => state)[sectionName]
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | undefined | null>(null)

  const getFormValues = useCallback((): z.infer<SectionSchemas[SectionName]> => {
    return isMultiEntry && Array.isArray(sectionData)
      ? sectionData[selectedItemIdx ?? 0]!
      : (sectionData as z.infer<SectionSchemas[SectionName]>)
  }, [isMultiEntry, sectionData, selectedItemIdx])

  function persistSection() {
    if (!cvId) return
    const value = storeApi.getState()[sectionName]
    void saveSection({ cvId, data: serializeForSection(sectionName, value) })
  }

  function onSubmit(data: Omit<CvDataState[SectionName], "email">) {
    if (isMultiEntry) {
      setSectionData(sectionName, data as Employment | School | Language)
      markSectionAsCompleted(sectionName)
      setSelectedItemIdx(null)
      persistSection()
    } else {
      setSectionData(sectionName, data)
      markSectionAsCompleted(sectionName)
      persistSection()
      handleForwardStep()
    }
  }

  function onSkip() {
    markSectionAsCompleted(sectionName)
    handleForwardStep()
  }

  function onDelete() {
    if (isMultiEntry && selectedItemIdx) {
      removeFromList(sectionName as SectionNameWithMultiEntry, selectedItemIdx)
      setSelectedItemIdx(null)
      persistSection()
    }
  }

  function formHasUserData(): boolean {
    const data = isMultiEntry && Array.isArray(sectionData) ? sectionData : []
    if (data.length <= 0) return false
    if (data.length > 1) return true

    return Object.values(data[0]!)[0]!.toString().length > 0
  }

  function handleForwardClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (formHasUserData()) {
      e.preventDefault()
      handleForwardStep()
    }
  }

  function handleAddClick() {
    setSelectedItemIdx(undefined)
  }

  return (
    <FormStepCard title={title} sub={sub} className="mb-8">
      {isMultiEntry ? (
        <>
          <FormDialog
            sectionName={sectionName}
            selectedItemIdx={selectedItemIdx}
            setSelectedItemIdx={setSelectedItemIdx}
          >
            <IconButton icon={<PlusIcon />} text={t("addNew")} onClick={handleAddClick} />
            <FormGenerator
              {...sectionProps}
              values={getFormValues()}
              onSubmit={onSubmit}
              onDelete={onDelete}
              selectedItemIdx={selectedItemIdx}
            />
          </FormDialog>
          <SectionDataList sectionName={sectionName} setSelectedItemIdx={setSelectedItemIdx} />
          <div className="mt-12 flex justify-center gap-10 max-sm:mt-8">
            <Button type="button" variant="navPrev" className="group relative px-10" onClick={handleBackStep}>
              {t("back")}
            </Button>
            <ConfirmDialog type="skipSection" onConfirmAction={onSkip}>
              <Button
                type="button"
                variant="navNext"
                className="group relative px-10"
                onClick={handleForwardClick}
              >
                {t("next")}
              </Button>
            </ConfirmDialog>
          </div>
        </>
      ) : (
        <FormGenerator
          {...sectionProps}
          values={getFormValues()}
          onSubmit={onSubmit}
          onDelete={onDelete}
          selectedItemIdx={selectedItemIdx}
        />
      )}
    </FormStepCard>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test components/section-wrapper.test.tsx`
Expected: PASS

- [ ] **Step 5: Run the full existing test suite to check for regressions**

Run: `bun test`
Expected: PASS (no regressions in `section-data-list`, `stepper`, `form-dialog` etc. tests)

- [ ] **Step 6: Commit**

```bash
git add components/section-wrapper.tsx components/section-wrapper.test.tsx
git commit -m "feat: autosave each cv section to Convex after local submit"
```

---

### Task 10: Picture upload rewire in `input-image-file.tsx`

**Files:**
- Modify: `components/ui/input-image-file.tsx`
- Test: `components/ui/input-image-file.test.tsx`

**Interfaces:**
- Consumes: `useCvId` (Task 5), `api.cvs.generateUploadUrl`, `api.cvs.setPicture` (Task 4).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, test, mock } from "bun:test"
import userEvent from "@testing-library/user-event"
import { render, screen } from "../../test-utils"

const generateUploadUrl = mock(() => Promise.resolve("https://upload.example.com/put"))
const setPicture = mock(() => Promise.resolve({ pictureUrl: "https://files.example.com/pic.png" }))
const originalFetch = global.fetch

void mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("cv=abc123"),
}))
void mock.module("convex/react", () => ({
  useMutation: (ref: unknown) => (ref === "generateUploadUrl" ? generateUploadUrl : setPicture),
}))
void mock.module("@/convex/_generated/api", () => ({
  api: { cvs: { generateUploadUrl: "generateUploadUrl", setPicture: "setPicture" } },
}))

import { InputImageFile } from "./input-image-file"

describe("InputImageFile", () => {
  test("uploads the file via Convex storage and reports the resolved url", async () => {
    global.fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ storageId: "storage123" })))) as unknown as typeof fetch
    const onChange = mock()
    const setError = mock()

    render(
      <InputImageFile
        name="picture"
        value=""
        setError={setError}
        onChange={onChange}
      />
    )

    const file = new File(["fake-bytes"], "photo.png", { type: "image/png" })
    const input = document.querySelector("input[type=file]") as HTMLInputElement
    await userEvent.upload(input, file)

    expect(generateUploadUrl).toHaveBeenCalled()
    expect(setPicture).toHaveBeenCalledWith({ cvId: "abc123", storageId: "storage123" })
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: "https://files.example.com/pic.png" }) })
    )

    global.fetch = originalFetch
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/ui/input-image-file.test.tsx`
Expected: FAIL — component still does the base64 `FileReader` flow.

- [ ] **Step 3: Update `components/ui/input-image-file.tsx`**

Replace the `handleChange` body (keep everything else, including `UploadCard`, unchanged):

```tsx
import type { FieldValues, UseFormSetError } from "react-hook-form"
import type { ZodError } from "zod"
import type { InputProps } from "./input"

import { getImageSchema } from "@/form-generator/validation-schemas"
import { cn } from "@/lib/utils"
import { useCvId } from "@/hooks/use-cv-id"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { forwardRef, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "./card"
import Loader from "./loader"

export interface InputImageFileProps extends InputProps {
  setError: UseFormSetError<FieldValues>
  value: string
}

interface UploadCardProps {
  src: string | undefined
  onClick: () => void
  isLoading: boolean
  alt: string
}

const UploadCard = ({ src, onClick, isLoading, alt }: UploadCardProps) => {
  return (
    <Card className="duration-250 h-52 w-44 border border-input p-2 transition-all hover:ring-1 hover:ring-ring">
      <CardContent
        className="flex-center duration-250 relative h-full w-full cursor-pointer overflow-clip rounded-md pt-6 opacity-75 transition-opacity hover:opacity-50"
        onClick={onClick}
      >
        {isLoading ? (
          <Loader size="icon" className="h-40 w-40" />
        ) : (
          <Image
            className="h-[12rem] w-[10rem] object-cover"
            src={src ?? "/vecteezy_profile_placeholder.jpg"}
            alt={alt}
            fill
            sizes="(max-width: 768px) 10rem, (max-width: 1024px) 12rem, 12rem"
          />
        )}
      </CardContent>
    </Card>
  )
}

const InputImageFile = forwardRef<HTMLInputElement, InputImageFileProps>(
  ({ className, setError, value, ...props }, ref) => {
    const t = useTranslations("CreateFlow")
    const imageSchema = useMemo(() => getImageSchema(t), [t])
    const cvId = useCvId()
    const generateUploadUrl = useMutation(api.cvs.generateUploadUrl)
    const setPicture = useMutation(api.cvs.setPicture)
    const [isLoading, setIsLoading] = useState(false)
    const [pictureUrl, setPictureUrl] = useState<string | undefined>(
      value && value.length > 0 ? value : undefined
    )
    const [prevValue, setPrevValue] = useState(value)
    const inputFileRef = useRef<HTMLInputElement | null>(null)

    if (value !== prevValue) {
      setPrevValue(value)
      if (value && value.length > 0) {
        setPictureUrl(value)
      }
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true)
      setPictureUrl(undefined)

      const file = e.target.files?.[0]
      if (!file || !cvId) {
        setIsLoading(false)
        return
      }

      const parsedImage = imageSchema.safeParse(file)
      if (!parsedImage.success) {
        const error: ZodError = parsedImage.error
        const name = props.name
        if (!name) throw new Error("InputFile: name prop is missing")
        setError(name, { type: "manual", message: error.issues[0]?.message })
        setIsLoading(false)
        return
      }

      const uploadUrl = await generateUploadUrl({})
      const uploadResponse = await fetch(uploadUrl, { method: "POST", body: parsedImage.data })
      const { storageId } = (await uploadResponse.json()) as { storageId: string }
      const { pictureUrl: resolvedUrl } = await setPicture({ cvId, storageId })

      setPictureUrl(resolvedUrl ?? undefined)
      setIsLoading(false)
      props.onChange?.({ ...e, target: { ...e.target, value: resolvedUrl ?? "" } })
    }

    const handleClick = () => {
      inputFileRef.current?.click()
    }

    return (
      <>
        <input
          type={"file"}
          className={cn("sr-only", className)}
          ref={(node) => {
            ref && (typeof ref === "function" ? ref(node) : (ref.current = node))
            inputFileRef.current = node
          }}
          {...props}
          value={""}
          onChange={(e) => void handleChange(e)}
        />
        <UploadCard src={pictureUrl} onClick={handleClick} isLoading={isLoading} alt={t("pictureUploadAlt")} />
      </>
    )
  }
)
InputImageFile.displayName = "InputImageFile"

export { InputImageFile }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test components/ui/input-image-file.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/ui/input-image-file.tsx components/ui/input-image-file.test.tsx
git commit -m "feat: upload cv pictures to Convex storage instead of base64"
```

---

### Task 11: `/cvs` list/dashboard page + navbar entry points

**Files:**
- Create: `app/[locale]/cvs/page.tsx`
- Modify: `components/navbar-navitems.tsx`
- Modify: `messages/en.json`, `messages/hu.json`
- Test: `app/[locale]/cvs/page.test.tsx`

**Interfaces:**
- Consumes: `api.cvs.list`, `api.cvs.create`, `api.cvs.remove` (Tasks 2–3); `ConfirmDialog` (existing, `type="delete"`).

- [ ] **Step 1: Add translation keys**

In `messages/en.json`, add a new top-level `"CvsPage"` key (sibling of `"CreateFlow"`) and add `"myCvs"` to `"Navbar"`:

```json
"Navbar": {
  "newCv": "New resume",
  "myCvs": "My resumes",
  ...
},
"CvsPage": {
  "title": "My resumes",
  "newCv": "New resume",
  "empty": "You haven't saved any resumes yet.",
  "untitled": "Untitled resume",
  "continue": "Continue",
  "updatedAt": "Last edited {date}"
}
```

In `messages/hu.json`, mirror it:

```json
"Navbar": {
  "newCv": "Új önéletrajz",
  "myCvs": "Önéletrajzaim",
  ...
},
"CvsPage": {
  "title": "Önéletrajzaim",
  "newCv": "Új önéletrajz",
  "empty": "Még nincs mentett önéletrajzod.",
  "untitled": "Névtelen önéletrajz",
  "continue": "Folytatás",
  "updatedAt": "Utoljára szerkesztve: {date}"
}
```

(Keep every other existing key in both files untouched — this only adds `Navbar.myCvs` and the new `CvsPage` block.)

- [ ] **Step 2: Write the failing test**

```tsx
import { describe, expect, test, mock } from "bun:test"
import userEvent from "@testing-library/user-event"
import { render, screen } from "../../../test-utils"

const list = [
  { _id: "cv1", title: "Frontend Resume", updatedAt: 1700000000000, completedSections: ["personal"], pictureUrl: null },
]
const createMutation = mock(() => Promise.resolve("cv2"))
const removeMutation = mock(() => Promise.resolve(null))
const push = mock()

void mock.module("@/i18n/navigation", () => ({ useRouter: () => ({ push }) }))
void mock.module("convex/react", () => ({
  useQuery: () => list,
  useMutation: (ref: unknown) => (ref === "create" ? createMutation : removeMutation),
}))
void mock.module("@/convex/_generated/api", () => ({
  api: { cvs: { list: "list", create: "create", remove: "remove" } },
}))

import CvsPage from "./page"

describe("CvsPage", () => {
  test("lists saved cvs and starts a new one", async () => {
    render(<CvsPage />)

    expect(screen.getByText("Frontend Resume")).toBeTruthy()

    await userEvent.click(screen.getByRole("button", { name: "New resume" }))
    expect(createMutation).toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith("/create/email?cv=cv2")
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `bun test app/[locale]/cvs/page.test.tsx`
Expected: FAIL with "Cannot find module './page'"

- [ ] **Step 4: Write `app/[locale]/cvs/page.tsx`**

```tsx
"use client"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/confirm-dialog"
import Image from "next/image"
import type { Id } from "@/convex/_generated/dataModel"

export default function CvsPage() {
  const t = useTranslations("CvsPage")
  const router = useRouter()
  const cvs = useQuery(api.cvs.list, {})
  const createCv = useMutation(api.cvs.create)
  const removeCv = useMutation(api.cvs.remove)

  async function handleNewCv() {
    const cvId = await createCv({})
    router.push(`/create/email?cv=${cvId}`)
  }

  return (
    <div className="flex w-full max-w-screen-md flex-1 flex-col gap-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={() => void handleNewCv()}>{t("newCv")}</Button>
      </div>

      {cvs?.length === 0 ? <p className="text-muted-foreground">{t("empty")}</p> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cvs?.map((cv) => (
          <Card key={cv._id} className="p-4">
            <CardHeader className="flex-row items-center gap-4 p-0">
              <div className="relative h-16 w-16 shrink-0 overflow-clip rounded-md">
                <Image
                  src={cv.pictureUrl ?? "/vecteezy_profile_placeholder.jpg"}
                  alt={cv.title}
                  fill
                  sizes="4rem"
                />
              </div>
              <div>
                <CardTitle>{cv.title || t("untitled")}</CardTitle>
                <CardSubtitle>{t("updatedAt", { date: new Date(cv.updatedAt).toLocaleDateString() })}</CardSubtitle>
              </div>
            </CardHeader>
            <CardContent className="flex justify-end gap-2 p-0 pt-4">
              <ConfirmDialog type="delete" onConfirmAction={() => void removeCv({ cvId: cv._id as Id<"cvs"> })}>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </ConfirmDialog>
              <Button size="sm" onClick={() => router.push(`/create/personal?cv=${cv._id}`)}>
                {t("continue")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test app/[locale]/cvs/page.test.tsx`
Expected: PASS

- [ ] **Step 6: Point the navbar's existing "New resume" link at the create flow, and add "My resumes"**

In `components/navbar-navitems.tsx`, the existing `newCv` menu item currently links straight to `/create` (which now 404s/misbehaves without a `cv` param). Change it to route to `/cvs` instead (the natural "start here" hub), and add a second item for `/cvs` explicitly:

```tsx
<NavigationMenuItem className="max-sm:hidden">
  <NavigationMenuLink
    asChild
    className={navigationMenuTriggerStyle()}
    data-active={pathname.includes("/create") || pathname.includes("/cvs")}
  >
    <Link href="/cvs">{t("myCvs")}</Link>
  </NavigationMenuLink>
</NavigationMenuItem>
```

(Replace the old `<Link href="/create">{t("newCv")}</Link>` item with this one — `/cvs` is now the entry point that creates a new CV via its own button, so the navbar only needs a single link to the hub.)

- [ ] **Step 7: Manually verify end-to-end**

`npx convex dev` + `bun run dev`. Sign up → land redirected appropriately → click "My resumes" → "New resume" → fill personal info incl. picture → back to `/cvs` → confirm title/picture/updatedAt show → "Continue" → confirm form re-populates → delete the CV → confirm it disappears from the list and the file is gone from the Convex dashboard's Storage tab.

- [ ] **Step 8: Commit**

```bash
git add "app/[locale]/cvs/page.tsx" "app/[locale]/cvs/page.test.tsx" components/navbar-navitems.tsx messages/en.json messages/hu.json
git commit -m "feat: add cvs dashboard page and navbar entry point"
```

---

## Self-Review Notes

- **Spec coverage:** multiple CVs per user (Task 2 `cvs` table + Task 11 list page), autosave per section (Task 9), Convex file storage for the picture (Task 4 + 10), auth-gated `/create` (Task 6), `cv` query param plumbing (Tasks 5, 8, 9, 10, 11) — all covered.
- **Type consistency:** `getSectionMutationRef`/`serializeForSection` (Task 7/9) and the `cvs.ts` mutation names (Task 3) use the same seven section names as `SectionName` in `lib/stores/cv-data-store.types.ts`. `pictureUrl` naming is consistent across `convex/cvs.ts`, `lib/cv-sync.ts`, `cv-sync-boundary.tsx`, and `input-image-file.tsx`.
- **No placeholders:** every step above has real, complete code — nothing deferred to "later."
