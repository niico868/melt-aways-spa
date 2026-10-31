import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  firstName?: string
  treatmentName?: string
  totalSessions?: string | number
  firstSessionDate?: string
  firstSessionTime?: string
  branchName?: string
  branchAddress?: string
  viewUrl?: string
}

const Email = ({
  firstName,
  treatmentName,
  totalSessions,
  firstSessionDate,
  firstSessionTime,
  branchName,
  branchAddress,
  viewUrl = 'https://www.meltawaysspa.com/account',
}: Props) => {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your treatment plan is ready to begin.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Your Meltaways Spa Treatment Journey ✨</Heading>
          <Text style={text}>{greeting}</Text>
          <Text style={text}>Congratulations on starting your treatment package.</Text>
          <Text style={text}>
            Thank you for trusting Meltaways Spa with your transformation. Your commitment is the first
            step toward achieving your goals, and we're honored to be part of your journey.
          </Text>
          <Section style={card}>
            <Text style={cardLabel}>Your treatment plan</Text>
            {treatmentName ? (
              <Text style={cardRow}><strong>Treatment:</strong> {treatmentName}</Text>
            ) : null}
            {totalSessions ? (
              <Text style={cardRow}><strong>Number of sessions:</strong> {totalSessions}</Text>
            ) : null}
            {firstSessionDate && firstSessionTime ? (
              <Text style={cardRow}>
                <strong>First session:</strong> {firstSessionDate} at {firstSessionTime}
              </Text>
            ) : null}
            {branchName ? (
              <Text style={cardRow}>
                <strong>Location:</strong>
                <br />
                {branchName}
                {branchAddress ? (<><br />{branchAddress}</>) : null}
              </Text>
            ) : null}
          </Section>
          <Text style={text}>
            Throughout your package, our team will guide you every step of the way with personalized
            care, professional support and treatments tailored to your individual needs.
          </Text>
          <Text style={text}>
            Remember, meaningful progress comes through consistency. Attending your scheduled sessions
            and following the guidance provided by our team may help you get the most from your treatment
            plan.
          </Text>
          <Text style={text}>We can't wait to support your progress and celebrate each milestone with you.</Text>
          <Text style={tagline}>Welcome to your transformation.</Text>
          <Text style={text}>
            With care,
            <br />
            The Meltaways Spa Team
          </Text>
          <Section style={{ textAlign: 'center', margin: '28px 0 8px' }}>
            <Button style={button} href={viewUrl}>
              View My Treatment Plan
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>Meltaways Spa · care@meltawaysspa.com</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: 'Welcome to Your Meltaways Spa Treatment Journey ✨',
  displayName: 'Treatment Package — Welcome',
  previewData: {
    firstName: 'Jane',
    treatmentName: 'Cavitation & Skin Tightening',
    totalSessions: 6,
    firstSessionDate: 'Monday, 24 August 2026',
    firstSessionTime: '11:00 AM',
    branchName: 'Meltaways Spa — El Dorado',
    branchAddress: '123 Main Road, El Dorado, Trinidad',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#111111', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#3f3f46', lineHeight: '1.6', margin: '0 0 14px' }
const card = { backgroundColor: '#faf7f4', borderRadius: '10px', padding: '16px 18px', margin: '18px 0' }
const cardLabel = { fontSize: '12px', color: '#7a5a3f', textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '0 0 8px' }
const cardRow = { fontSize: '14px', color: '#3f3f46', lineHeight: '1.6', margin: '0 0 6px' }
const tagline = { fontSize: '13px', color: '#7a5a3f', fontStyle: 'italic' as const, margin: '18px 0' }
const button = {
  backgroundColor: '#111111',
  color: '#ffffff',
  fontSize: '14px',
  borderRadius: '8px',
  padding: '12px 22px',
  textDecoration: 'none',
}
const hr = { borderColor: '#eeeeee', margin: '28px 0 12px' }
const footer = { fontSize: '12px', color: '#999999', margin: 0 }