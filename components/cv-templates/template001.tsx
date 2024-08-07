/* eslint-disable jsx-a11y/alt-text */
"use client"
import type { CvDataState } from "@/lib/stores/cv-data-store.types"

import { siteConfig } from "@/config/site"
import { Document, Link, Page, Text, View } from "@react-pdf/renderer"
import { formatDate } from "@/lib/utils"
import { hu } from "date-fns/locale"
import { colors } from "./config/colors"
import { registerFontFamily } from "./config/fonts"
import { styles } from "./config/styles"
import { LinearGradBg } from "./primitives/backgrounds/linear-gradient"
import { CakeIcon } from "./primitives/icons/cake-icon"
import { GithubIcon } from "./primitives/icons/github-icon"
import { GlobeIcon } from "./primitives/icons/globe-icon"
import { LinkedInIcon } from "./primitives/icons/linkedin-icon"
import { MailIcon } from "./primitives/icons/mail-icon"
import { MapPinIcon } from "./primitives/icons/map-icon"
import { PhoneIcon } from "./primitives/icons/phone-icon"
import { Portrait } from "./primitives/image-portrait"
import { Heading } from "./primitives/text-heading"
import { SubHeading } from "./primitives/text-subheading"
import { Column } from "./primitives/view-column"
import { Row } from "./primitives/view-row"
import { Section } from "./primitives/view-section"
import { Fragment } from "react"

registerFontFamily("Beiruti")

export const Template001 = ({ cvData }: { cvData: CvDataState }) => {
  const { personal, links, skills, experience, education, languages, interests } = cvData
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
                <Text>{formatDate(personal.birthDate)}</Text>
              </View>
            </Row>
          </Section>

          <Section title="Szakmai Ismeretek" paddingLeft={0}>
            <Text>{skills.skillsList}</Text>
          </Section>

          <Section title="Munkatapasztalat" paddingLeft={0}>
            {experience.map((exp, index) => {
              if (!exp.position || !exp.employer || !exp.startDate || !exp.endDate) return null
              return (
                <Fragment key={index}>
                  <Row gap={4}>
                    <Text style={{ fontSize: 14, fontWeight: "semibold", color: colors.accent }}>
                      {exp.position}
                    </Text>
                    <Text>|</Text>
                    <Text
                      style={{ fontSize: 11, opacity: 0.8, fontWeight: "semibold", verticalAlign: "sub" }}
                    >
                      {exp.employer}
                    </Text>
                  </Row>
                  <Row gap={4} marginBottom={4}>
                    <Text style={{ fontSize: 11, opacity: 0.8 }}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </Text>
                  </Row>
                  <Text style={{ textIndent: -10, paddingLeft: 10 }}>{exp.description}</Text>
                </Fragment>
              )
            })}
          </Section>

          <Section title="Tanulmányok" paddingLeft={0}>
            {education.map((edu, index) => {
              if (!edu.specialization || !edu.institution || !edu.startDate || !edu.endDate) return null
              return (
                <Fragment key={index}>
                  <Row key={index} gap={4}>
                    <Text style={{ fontSize: 14, fontWeight: "semibold", color: colors.accent }}>
                      {edu.specialization}
                    </Text>
                    {edu.major ? <Text style={{ fontWeight: "semibold" }}>{edu.major}</Text> : null}
                    <Text>|</Text>
                    <Text
                      style={{ fontSize: 11, opacity: 0.8, fontWeight: "semibold", verticalAlign: "sub" }}
                    >
                      {edu.institution}
                    </Text>
                  </Row>
                  <Row gap={4} marginBottom={4}>
                    <Text style={{ fontSize: 11, opacity: 0.8 }}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Text>
                  </Row>
                  <Text>{edu.description}</Text>
                </Fragment>
              )
            })}
          </Section>

          <Section title="Nyelvismeret" paddingLeft={0}>
            {languages.map((lang, index) => {
              if (!lang.language || !lang.level) return null
              return (
                <Row key={index} gap={4}>
                  <Text>
                    {lang.language} ({lang.level})
                  </Text>
                </Row>
              )
            })}
          </Section>

          <Section title="Érdeklődés" paddingLeft={0}>
            <Row gap={4}>
              <Text>{interests.topic}</Text>
            </Row>
          </Section>
        </Column>
      </Page>
    </Document>
  )
}
