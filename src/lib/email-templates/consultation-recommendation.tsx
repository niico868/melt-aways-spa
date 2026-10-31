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
  recommendedTreatment?: string
  recommendedSessions?: string
  treatmentGoal?: string
  recommendationSummary?: string
  viewUrl?: string
}

const Email = ({
  firstName,
  recommendedTreatment,
  recommendedSessions,
  treatmentGoal,
  recommendationSummary,
  viewUrl = 'https://www.meltawaysspa.com/account',
}: Props) => {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Review the next step in your Meltaways Spa journey.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Personalized Treatment Recommendation Is Ready</Heading>
          <Text style={text}>{greeting}</Text>
          <Text style={text}>Thank you for completing your consultation with Meltaways Spa.</Text>
          <Text style={text}>
            Based on the goals, concerns and information discussed during your consultation, our team has
            prepared a personalized treatment recommendation for you.
          </Text>
          <Section style={card}>
            <Text style={cardLabel}>Your recommended treatment</Text>
            {recommendedTreatment ? (
              <Text style={cardRow}><strong>Treatment:</strong> {recommendedTreatment}</Text>
            ) : null}
            {recommendedSessions ? (
              <Text style={cardRow}><strong>Recommended plan:</strong> {recommendedSessions}</Text>
            ) : null}
            {treatmentGoal ? (
              <Text style={cardRow}><strong>Primary goal:</strong> {treatmentGoal}</Text>
            ) : null}
          </Section>
          {recommendationSummary ? (
            <>
              <Text style={sectionLabel}>Our recommendation</Text>
              <Text style={text}>{recommendationSummary}</Text>
            </>
          ) : null}
          <Text style={text}>
            This recommendation has been prepared around your individual needs and the outcome you would
            like to work toward. Treatment suitability, expected progress and any important
            considerations will be discussed with you before your plan begins.
          </Text>
          <Text style={text}>
            When you're ready, you can review your recommendation and contact our team to confirm the
            next step.
          </Text>
          <Text style={text}>We're excited to continue supporting your journey.</Text>
          <Text style={tagline}>Where Confidence Begins and Your Transformation Starts.</Text>
          <Text style={text}>
            With care,
            <br />
            The Meltaways Spa Team
          </Text>
          <Section style={{ textAlign: 'center', margin: '28px 0 8px' }}>
            <Button style={button} href={viewUrl}>
              View My Recommendation
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
  subject: 'Your Personalized Treatment Recommendation Is Ready',
  displayName: 'Consultation — Treatment Recommendation',
  previewData: {
    firstName: 'Jane',
    recommendedTreatment: 'Cavitation & Skin Tightening',
    recommendedSessions: '6 sessions over 8 weeks',
    treatmentGoal: 'Contour the midsection and improve skin firmness',
    recommendationSummary:
      'Based on your goals, we recommend a combined body-contouring plan intended to gently reduce localized fat and support smoother, firmer skin. Progress can vary and will be reviewed at each visit so we can adapt your plan as needed.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#111111', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#3f3f46', lineHeight: '1.6', margin: '0 0 14px' }
const sectionLabel = { fontSize: '13px', color: '#7a5a3f', fontWeight: 'bold' as const, margin: '18px 0 8px' }
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