"use client"

import { siteConfig } from "@/config/site"
import type { CvDataState } from "@/lib/stores/cv-data-store"
import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { format } from "date-fns"
import { CakeIcon } from "./react-pdf-partials/icons/cake-icon"
import { MailIcon } from "./react-pdf-partials/icons/mail-icon"
import { MapPinIcon } from "./react-pdf-partials/icons/map-icon"
import { PhoneIcon } from "./react-pdf-partials/icons/phone-icon"
import { Portrait } from "./react-pdf-partials/image-portrait"
import { Heading } from "./react-pdf-partials/text-heading"
import { SubHeading } from "./react-pdf-partials/text-subheading"
import { Column } from "./react-pdf-partials/view-column"
import { Row } from "./react-pdf-partials/view-row"
import { Section } from "./react-pdf-partials/view-section"
import { GithubIcon } from "./react-pdf-partials/icons/github-icon"
import { LinkedInIcon } from "./react-pdf-partials/icons/linkedin-icon"
import { GlobeIcon } from "./react-pdf-partials/icons/globe-icon"

Font.register({
  family: "Beiruti",
  fonts: [
    {
      src: "/fonts/Beiruti-ExtraLight.ttf",
      fontWeight: 200,
    },
    {
      src: "/fonts/Beiruti-Light.ttf",
      fontWeight: 300,
    },
    {
      src: "/fonts/Beiruti-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/Beiruti-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "/fonts/Beiruti-SemiBold.ttf",
      fontWeight: 600,
    },
    {
      src: "/fonts/Beiruti-Bold.ttf",
      fontWeight: 700,
    },
  ],
})

/* Disables hyphenation */
Font.registerHyphenationCallback((word) => [word])

export const colors = {
  background: "#f7f7f7",
  foreground: "#011119",
  primary: "#11caff",
  muted: "#576eb7",
  accent: "#e44112",
  link: "#4066c7",
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    color: colors.foreground,
    backgroundColor: colors.background,
    fontFamily: "Beiruti",
    fontSize: 13,
  },
  section: {
    padding: 10,
    flexGrow: 1,
  },
  link: {
    color: colors.link,
    letterSpacing: 0.2,
  },
  wrapper: {
    flexDirection: "row",
    flex: 3,
    width: "100%",
    gap: 4,
  },
})

// Create Document Component
export const Template001 = ({ cvData }: { cvData: CvDataState }) => {
  const { personal, skills, experience, education, languages, passions } = cvData
  const docTitle = `CV-${personal.fullName.split(" ").join("")}-${new Date().getFullYear()}-${new Date().getMonth() + 1}`

  return (
    <Document title={docTitle} creator={siteConfig.creator}>
      <Page size="A4" style={styles.page}>
        <Column width={"30%"}>
          <Section justifyContent="flex-start" alignItems="center" paddingRight={0}>
            <Portrait
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlQE4Q7T5S7zR47fVlpqJmElUdobrdkbrZRg&s"
              borderRadius={5}
            />
          </Section>
        </Column>

        <Column width={"70%"}>
          <Section paddingLeft={0} minHeight={155}>
            <Heading marginBottom={1}>{personal.fullName.toUpperCase()}</Heading>
            <SubHeading marginBottom={12} color={colors.accent}>
              {skills.occupation}
            </SubHeading>
            <Row marginBottom={6}>
              <View style={styles.wrapper}>
                <MailIcon />
                <Link src={`mailto:${personal.email}`} style={styles.link}>
                  {personal.email}
                </Link>
              </View>
              <View style={[styles.wrapper, { flex: 2 }]}>
                <LinkedInIcon />
                <Link src={"https://www.linkedin.com/in/attila-beli/"} style={styles.link}>
                  LinkedIn
                </Link>
              </View>
              <View style={[styles.wrapper, { flex: 2 }]}>
                <GlobeIcon />
                <Link src={"https://www.attilabeli.com"} style={styles.link}>
                  Webpage
                </Link>
              </View>
            </Row>
            <Row marginBottom={6}>
              <View style={styles.wrapper}>
                <PhoneIcon />
                <Link src={`tel:${personal.phone}`} style={styles.link}>
                  {personal.phone}
                </Link>
              </View>
              <View style={[styles.wrapper, { flex: 2 }]}>
                <GithubIcon />
                <Link src={"https://github.com/myrddral"} style={styles.link}>
                  GitHub
                </Link>
              </View>
              <View style={[styles.wrapper, { flex: 2 }]}>
                <MapPinIcon />
                <Text>{personal.location}</Text>
              </View>
            </Row>
            <Row>
              <View style={styles.wrapper}>
                <CakeIcon />
                {/* <Text>{format(personal.birthDate, "yyyy-MM-dd")}</Text> */}
                <Text>1984. NOVEMBER</Text>
              </View>
            </Row>
          </Section>

          <Section title="Skills" paddingLeft={0}>
            <Text>{skills.skillsList}</Text>
          </Section>

          <Section title="Work Experience" paddingLeft={0}>
            <Row gap={4}>
              <Text style={{ fontSize: 14, fontWeight: "semibold", color: colors.accent }}>
                {experience.position}
              </Text>
            </Row>
            <Row gap={4} marginBottom={4}>
              <Text style={{ fontSize: 11, opacity: 0.8 }}>
                {experience.startYear}. NOVEMBER - {experience.endYear}. JUNE /
              </Text>
              <Text style={{ fontSize: 11, opacity: 0.8, fontWeight: "semibold" }}>
                {experience.employer}
              </Text>
            </Row>
            <Text style={{ textIndent: -10, paddingLeft: 10 }}>{experience.description}</Text>
          </Section>

          <Section title="Education" paddingLeft={0} >
            <Row gap={4}>
              <Text style={{ fontSize: 14, fontWeight: "semibold", color: colors.accent }}>
                {education.specialization}
              </Text>
              <Text style={{ fontWeight: "semibold" }}>{education.major}</Text>
            </Row>
            <Row gap={4} marginBottom={4}>
              <Text style={{ fontSize: 11, opacity: 0.8 }}>
                {education.startYear}. OCTOBER - {education.endYear}. APRIL /
              </Text>
              <Text style={{ fontSize: 11, opacity: 0.8, fontWeight: "semibold" }}>
                {education.institution}
              </Text>
            </Row>
            <Text>{education.description}</Text>
          </Section>

          <Section title="Languages" paddingLeft={0}>
            <Row gap={4}>
              <Text>
                {languages.language} ({languages.level})
              </Text>
            </Row>
          </Section>

          <Section title="Passions" paddingLeft={0}>
            <Row gap={4}>
              <Text>{passions.passionsList}</Text>
            </Row>
          </Section>
        </Column>
      </Page>
    </Document>
  )
}
