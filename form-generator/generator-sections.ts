import type { RouteParamType, SectionProps } from "./form-generator.types"

type Translate = (key: string) => string

export const routeParams: RouteParamType[] = [
  "personal",
  "links",
  "skills",
  "experience",
  "education",
  "languages",
  "interests",
]

export function getPersonalSection(t: Translate): SectionProps {
  return {
    title: t("sections.personal.title"),
    sectionName: "personal",
    fields: {
      firstName: {
        label: t("sections.personal.fields.firstName.label"),
        type: "text",
        autocomplete: "given-name",
      },
      middleName: {
        label: t("sections.personal.fields.middleName.label"),
        type: "text",
        autocomplete: "additional-name",
      },
      lastName: {
        label: t("sections.personal.fields.lastName.label"),
        type: "text",
        autocomplete: "family-name",
      },
      email: {
        label: t("sections.personal.fields.email.label"),
        type: "email",
        autocomplete: "email",
        readonly: true,
      },
      phone: { label: t("sections.personal.fields.phone.label"), type: "tel", autocomplete: "tel" },
      location: {
        label: t("sections.personal.fields.location.label"),
        type: "text",
        autocomplete: "address-level2",
      },
      birthDate: { label: t("sections.personal.fields.birthDate.label"), type: "date" },
      picture: { label: t("sections.personal.fields.picture.label"), type: "image" },
    },
  }
}

export function getLinksSection(t: Translate): SectionProps {
  return {
    title: t("sections.links.title"),
    sub: t("sections.links.sub"),
    sectionName: "links",
    fields: {
      linkedin: { label: t("sections.links.fields.linkedin.label"), type: "url" },
      github: { label: t("sections.links.fields.github.label"), type: "url" },
      webpage: { label: t("sections.links.fields.webpage.label"), type: "url" },
    },
  }
}

export function getSkillsSection(t: Translate): SectionProps {
  return {
    title: t("sections.skills.title"),
    sectionName: "skills",
    fields: {
      occupation: {
        label: t("sections.skills.fields.occupation.label"),
        type: "text",
        help: t("sections.skills.fields.occupation.help"),
      },
      skillsList: {
        label: t("sections.skills.fields.skillsList.label"),
        type: "textarea",
        placeholder: t("sections.skills.fields.skillsList.placeholder"),
      },
    },
  }
}

export function getExperienceSection(t: Translate): SectionProps {
  return {
    title: t("sections.experience.title"),
    isMultiEntry: true,
    sectionName: "experience",
    fields: {
      jobTitle: { label: t("sections.experience.fields.jobTitle.label"), type: "text" },
      employer: { label: t("sections.experience.fields.employer.label"), type: "text" },
      description: {
        label: t("sections.experience.fields.description.label"),
        type: "textarea",
        placeholder: t("sections.experience.fields.description.placeholder"),
      },
      startDate: { label: t("sections.experience.fields.startDate.label"), type: "date" },
      endDate: { label: t("sections.experience.fields.endDate.label"), type: "date" },
      location: {
        label: t("sections.experience.fields.location.label"),
        type: "text",
        placeholder: t("sections.experience.fields.location.placeholder"),
      },
    },
  }
}

export function getEducationSection(t: Translate): SectionProps {
  return {
    title: t("sections.education.title"),
    isMultiEntry: true,
    sectionName: "education",
    fields: {
      institution: { label: t("sections.education.fields.institution.label"), type: "text" },
      specialization: { label: t("sections.education.fields.specialization.label"), type: "text" },
      description: { label: t("sections.education.fields.description.label"), type: "textarea" },
      startDate: { label: t("sections.education.fields.startDate.label"), type: "date" },
      endDate: { label: t("sections.education.fields.endDate.label"), type: "date" },
      location: {
        label: t("sections.education.fields.location.label"),
        type: "text",
        placeholder: t("sections.education.fields.location.placeholder"),
      },
    },
  }
}

export function getLanguagesSection(t: Translate): SectionProps {
  return {
    title: t("sections.languages.title"),
    isMultiEntry: true,
    sectionName: "languages",
    fields: {
      language: { label: t("sections.languages.fields.language.label"), type: "text" },
      level: { label: t("sections.languages.fields.level.label"), type: "text" },
    },
  }
}

export function getInterestsSection(t: Translate): SectionProps {
  return {
    title: t("sections.interests.title"),
    sectionName: "interests",
    fields: {
      interestsList: {
        label: t("sections.interests.fields.interestsList.label"),
        type: "textarea",
        placeholder: t("sections.interests.fields.interestsList.placeholder"),
      },
    },
  }
}

export function getAllSections(t: Translate): SectionProps[] {
  return [
    getPersonalSection(t),
    getLinksSection(t),
    getSkillsSection(t),
    getExperienceSection(t),
    getEducationSection(t),
    getLanguagesSection(t),
    getInterestsSection(t),
  ]
}

export function getSectionMap(t: Translate): Map<RouteParamType, SectionProps> {
  return new Map(getAllSections(t).map((sectionObj) => [sectionObj.sectionName, sectionObj]))
}
