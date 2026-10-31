import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { brandBar, button, container, footer, h1, hr, main, rule, signature, tagline, text } from './theme'

interface Props {
  firstName?: string
  viewUrl?: string
}

const Email = ({ firstName, viewUrl = 'https://www.meltawaysspa.com' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thank you for booking your consultation with us.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brandBar}>Meltaways Spa</Text>
        <Hr style={rule} />
        <Heading style={h1}>Welcome to Meltaways Spa! 🌿</Heading>
        {firstName ? <Text style={text}>Hi {firstName},</Text> : null}
        <Text style={text}>Thank you for booking your consultation with us.</Text>
        <Text style={text}>
          We're excited to be part of your wellness and transformation journey. During your consultation,
          one of our experienced specialists will assess your goals, answer your questions, and recommend a
          personalized treatment plan designed specifically for you.
        </Text>
        <Text style={text}>
          Our mission is to help you look and feel your absolute best through safe, effective, and
          results-driven treatments.
        </Text>
        <Text style={text}>
          We look forward to meeting you and helping you begin your transformation!
        </Text>
        <Section style={{ textAlign: 'center', margin: '30px 0 10px' }}>
          <Button style={button} href={viewUrl}>Explore Our Treatments</Button>
        </Section>
        <Text style={signature}>Meltaways Spa</Text>
        <Text style={tagline}>Where we destroy the fat and reveal the you inside ✨️</Text>
        <Hr style={hr} />
        <Text style={footer}>Meltaways Spa · care@meltawaysspa.com</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Welcome to Meltaways Spa! 🌿',
  displayName: 'Consultation Booked',
  previewData: { firstName: 'Jane' },
} satisfies TemplateEntry
