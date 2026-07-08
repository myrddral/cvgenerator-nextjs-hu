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
