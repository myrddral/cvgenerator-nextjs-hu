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
