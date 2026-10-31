import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { brandBar, button, container, footer, h1, hr, main, rule, signature, tagline, text } from './theme'

interface Props {
  firstName?: string
  contactUrl?: string
}

const Email = ({ firstName, contactUrl = 'https://www.meltawaysspa.com/contact' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We'd love to hear how you're feeling about your results.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brandBar}>Meltaways Spa</Text>
        <Hr style={rule} />
        <Heading style={h1}>Checking In 🌿</Heading>
        <Text style={text}>Hi {firstName || 'there'},</Text>
        <Text style={text}>
          It's been a while since your last visit to Meltaways Spa, and we wanted to reach out.
        </Text>
        <Text style={text}>
          Every client who walks through our doors becomes part of our story, and we take that seriously.
          Your treatment journey mattered to us, not just for the results, but for the trust you placed in
          our hands along the way.
        </Text>
        <Text style={text}>We would genuinely love to hear how are you feeling about your results.</Text>
        <Section style={{ textAlign: 'center', margin: '30px 0 10px' }}>
          <Button style={button} href={contactUrl}>Share How You're Doing</Button>
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
  subject: 'Checking In 🌿',
  displayName: 'One-Month Follow-Up',
  previewData: { firstName: 'Jane' },
} satisfies TemplateEntry
