/* eslint-disable jsx-a11y/alt-text */
"use client"
import { siteConfig } from "@/config/site"
import type { CvDataState } from "@/lib/stores/cv-data-store"
import { Document, Link, Page, Text, View } from "@react-pdf/renderer"
import { format } from "date-fns"
import { colors } from "./config/colors"
import { registerFontFamily } from "./config/fonts"
import { styles } from "./config/styles"
import LinearGradBg from "./react-pdf-partials/backgrounds/linear-gradient"
import { CakeIcon } from "./react-pdf-partials/icons/cake-icon"
import { GithubIcon } from "./react-pdf-partials/icons/github-icon"
import { GlobeIcon } from "./react-pdf-partials/icons/globe-icon"
import { LinkedInIcon } from "./react-pdf-partials/icons/linkedin-icon"
import { MailIcon } from "./react-pdf-partials/icons/mail-icon"
import { MapPinIcon } from "./react-pdf-partials/icons/map-icon"
import { PhoneIcon } from "./react-pdf-partials/icons/phone-icon"
import { Portrait } from "./react-pdf-partials/image-portrait"
import { Heading } from "./react-pdf-partials/text-heading"
import { SubHeading } from "./react-pdf-partials/text-subheading"
import { Column } from "./react-pdf-partials/view-column"
import { Row } from "./react-pdf-partials/view-row"
import { Section } from "./react-pdf-partials/view-section"
import { hu } from "date-fns/locale"

registerFontFamily("Beiruti")

export const Template001 = ({ cvData }: { cvData: CvDataState }) => {
  const { personal, links, skills, experience, education, languages, passions } = cvData
  const docTitle =
    `CV-${personal.firstName}${personal.lastName}-${new Date().getFullYear()}-${new Date().getMonth() + 1}`.toLowerCase()

  return (
    <Document title={docTitle} creator={siteConfig.creator} creationDate={new Date()}>
      <Page size="A4" style={styles.page}>
        <Column width={"30%"}>
          <LinearGradBg direction="toRight" from={colors.background} to={colors.background} />
          <Section justifyContent="flex-start" alignItems="center" paddingRight={0}>
            <Portrait src={personal.picture} borderRadius={8} />
          </Section>
        </Column>

        <Column width={"70%"}>
          <Section paddingLeft={0} paddingTop={16} minHeight={155}>
            <Heading marginBottom={1}>
              {personal.lastName.toUpperCase()} {personal.firstName.toUpperCase()}
            </Heading>
            <SubHeading marginBottom={16} color={colors.accent}>
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
                <Link src={links.linkedin} style={styles.link}>
                  LinkedIn
                </Link>
              </View>
              <View style={[styles.wrapper, { flex: 2 }]}>
                <GlobeIcon />
                <Link src={links.webpage} style={styles.link}>
                  Weboldal
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
                <Link src={links.github} style={styles.link}>
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
                <Text>{format(personal.birthDate, "yyyy. MMMM", { locale: hu })}</Text>
              </View>
            </Row>
          </Section>

          <Section title="Szakmai Ismeretek" paddingLeft={0}>
            <Text>{skills.skillsList}</Text>
          </Section>

          <Section title="Munkatapasztalat" paddingLeft={0}>
            <Row gap={4}>
              <Text style={{ fontSize: 14, fontWeight: "semibold", color: colors.accent }}>
                {experience.position}
              </Text>
              <Text>|</Text>
              <Text style={{ fontSize: 11, opacity: 0.8, fontWeight: "semibold", verticalAlign: "sub" }}>
                {experience.employer}
              </Text>
            </Row>
            <Row gap={4} marginBottom={4}>
              <Text style={{ fontSize: 11, opacity: 0.8 }}>
                {format(experience.startDate, "yyyy. MMMM", { locale: hu })} -{" "}
                {format(experience.endDate, "yyyy. MMMM", { locale: hu })}
              </Text>
            </Row>
            <Text style={{ textIndent: -10, paddingLeft: 10 }}>{experience.description}</Text>
          </Section>

          <Section title="Tanulmányok" paddingLeft={0}>
            <Row gap={4}>
              <Text style={{ fontSize: 14, fontWeight: "semibold", color: colors.accent }}>
                {education.specialization}
              </Text>
              {education.major ? <Text style={{ fontWeight: "semibold" }}>{education.major}</Text> : null}
              <Text>|</Text>
              <Text style={{ fontSize: 11, opacity: 0.8, fontWeight: "semibold", verticalAlign: "sub" }}>
                {education.institution}
              </Text>
            </Row>
            <Row gap={4} marginBottom={4}>
              <Text style={{ fontSize: 11, opacity: 0.8 }}>
                {format(education.startDate, "yyyy. MMMM", { locale: hu })} -{" "}
                {format(education.endDate, "yyyy. MMMM", { locale: hu })}
              </Text>
            </Row>
            <Text>{education.description}</Text>
          </Section>

          <Section title="Nyelvismeret" paddingLeft={0}>
            <Row gap={4}>
              <Text>
                {languages.language} ({languages.level})
              </Text>
            </Row>
          </Section>

          <Section title="Érdeklődés" paddingLeft={0}>
            <Row gap={4}>
              <Text>{passions.passionsList}</Text>
            </Row>
          </Section>
        </Column>
      </Page>
    </Document>
  )
}
