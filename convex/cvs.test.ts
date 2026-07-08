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
