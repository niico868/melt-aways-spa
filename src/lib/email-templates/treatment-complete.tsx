import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { brandBar, button, container, footer, h1, hr, main, rule, signature, text } from './theme'

interface Props {
  firstName?: string
  bookUrl?: string
}

const Email = ({ firstName, bookUrl = 'https://www.meltawaysspa.com/booking' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've completed your treatment package with Meltaways Spa.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brandBar}>Meltaways Spa</Text>
        <Hr style={rule} />
        <Heading style={h1}>Congratulations! 🎉</Heading>
        {firstName ? <Text style={text}>Hi {firstName},</Text> : null}
        <Text style={text}>You've successfully completed your treatment package with Meltaways Spa!</Text>
        <Text style={text}>
          Thank you for allowing us to be part of your transformation journey. We truly appreciate the trust
          you've placed in our team and hope you've enjoyed your experience with us.
        </Text>
        <Text style={text}>
          Your commitment and consistency have been key to your progress, and we encourage you to continue
          maintaining your results with a healthy lifestyle and any recommended maintenance treatments.
        </Text>
        <Text style={text}>
          We would love to welcome you back in the future and continue supporting your wellness and aesthetic
          goals.
        </Text>
        <Text style={text}>Thank you once again for choosing Meltaways Spa.</Text>
        <Text style={text}>We appreciate your support and look forward to you being your best!</Text>
        <Section style={{ textAlign: 'center', margin: '30px 0 10px' }}>
          <Button style={button} href={bookUrl}>Book A Maintenance Visit</Button>
        </Section>
        <Text style={{ ...text, textAlign: 'center', margin: '18px 0 4px' }}>With gratitude,</Text>
        <Text style={signature}>The Meltaways Spa Team</Text>
        <Hr style={hr} />
        <Text style={footer}>Meltaways Spa · care@meltawaysspa.com</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Congratulations on Completing Your Treatment! 🎉',
  displayName: 'Treatment Package Completed',
  previewData: { firstName: 'Jane' },
} satisfies TemplateEntry
