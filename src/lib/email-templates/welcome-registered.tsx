import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { brandBar, bullet, button, container, footer, h1, hr, main, rule, signature, tagline, text } from './theme'

interface Props {
  firstName?: string
  siteUrl?: string
}

const Email = ({ firstName, siteUrl = 'https://www.meltawaysspa.com/account' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We're delighted to have you here.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brandBar}>Meltaways Spa</Text>
        <Hr style={rule} />
        <Heading style={h1}>Welcome to Meltaways Spa! 🌿✨</Heading>
        {firstName ? <Text style={text}>Hi {firstName},</Text> : null}
        <Text style={text}>We're delighted to have you here.</Text>
        <Text style={text}>
          At Meltaways Spa, we believe every transformation begins with a single step. Whether your goal is
          body sculpting, skin rejuvenation, wellness, relaxation, or advanced aesthetic treatments, our team
          is committed to providing personalized care and exceptional results.
        </Text>
        <Text style={text}>Use this app to:</Text>
        <Text style={bullet}>— Book appointments with ease</Text>
        <Text style={bullet}>— Explore our treatments and services</Text>
        <Text style={bullet}>— View your treatment plans and progress</Text>
        <Text style={bullet}>— Receive appointment reminders and updates</Text>
        <Text style={bullet}>— Stay informed about exclusive promotions and VIP member benefits</Text>
        <Text style={{ ...text, marginTop: '18px' }}>
          Thank you for choosing Meltaways Spa. We look forward to being part of your journey to greater
          confidence, health, and beauty.
        </Text>
        <Section style={{ textAlign: 'center', margin: '30px 0 10px' }}>
          <Button style={button} href={siteUrl}>Open My Account</Button>
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
  subject: 'Welcome to Meltaways Spa! 🌿✨',
  displayName: 'Registration Confirmation',
  previewData: { firstName: 'Jane' },
} satisfies TemplateEntry
