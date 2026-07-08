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
