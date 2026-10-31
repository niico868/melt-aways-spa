import * as React from 'react'

import {
  Body,
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
  appointmentDate?: string
  appointmentTime?: string
  branchName?: string
  branchAddress?: string
  preparationInstructions?: string
}

const Email = ({
  firstName,
  treatmentName,
  appointmentDate,
  appointmentTime,
  branchName,
  branchAddress,
  preparationInstructions,
}: Props) => {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Here's what you need to know before your next session.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>A Reminder for Your Upcoming Treatment</Heading>
          <Text style={text}>{greeting}</Text>
          <Text style={text}>
            This is a friendly reminder that your next Meltaways Spa treatment is coming up.
          </Text>
          <Section style={card}>
            {treatmentName ? (
              <Text style={cardRow}><strong>Treatment:</strong> {treatmentName}</Text>
            ) : null}
            {appointmentDate ? (
              <Text style={cardRow}><strong>Date:</strong> {appointmentDate}</Text>
            ) : null}
            {appointmentTime ? (
              <Text style={cardRow}><strong>Time:</strong> {appointmentTime}</Text>
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
          {preparationInstructions ? (
            <>
              <Text style={sectionLabel}>Before your appointment</Text>
              <Text style={text}>{preparationInstructions}</Text>
            </>
          ) : null}
          <Text style={text}>
            These instructions are based on your scheduled treatment. If anything about your health,
            medication or circumstances has changed since your last appointment, please let our team know
            before treatment.
          </Text>
          <Text style={text}>
            Do not stop or change any prescribed medication unless instructed by the medical professional
            responsible for your care.
          </Text>
          <Text style={text}>We look forward to seeing you and continuing your progress.</Text>
          <Text style={text}>
            With care,
            <br />
            The Meltaways Spa Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>Meltaways Spa · care@meltawaysspa.com</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: 'A Reminder for Your Upcoming Treatment',
  displayName: 'Treatment — Upcoming Reminder',
  previewData: {
    firstName: 'Jane',
    treatmentName: 'Cavitation & Skin Tightening',
    appointmentDate: 'Wednesday, 26 August 2026',
    appointmentTime: '2:00 PM',
    branchName: 'Meltaways Spa — El Dorado',
    branchAddress: '123 Main Road, El Dorado, Trinidad',
    preparationInstructions:
      'Please arrive well hydrated, eat a light meal beforehand, and wear comfortable clothing. Avoid caffeine and alcohol for 24 hours prior to your session.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#111111', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#3f3f46', lineHeight: '1.6', margin: '0 0 14px' }
const sectionLabel = { fontSize: '13px', color: '#7a5a3f', fontWeight: 'bold' as const, margin: '18px 0 8px' }
const card = { backgroundColor: '#faf7f4', borderRadius: '10px', padding: '16px 18px', margin: '18px 0' }
const cardRow = { fontSize: '14px', color: '#3f3f46', lineHeight: '1.6', margin: '0 0 6px' }
const hr = { borderColor: '#eeeeee', margin: '28px 0 12px' }
const footer = { fontSize: '12px', color: '#999999', margin: 0 }