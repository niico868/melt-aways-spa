import * as React from 'react'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { brandBar, container, footer, h1, hr, main, rule, text } from './theme'

interface Props {
  clientName?: string
  clientPhone?: string
  clientEmail?: string
  bookingType?: string
  service?: string
  preferredDate?: string
  preferredTime?: string
  location?: string
  notes?: string
  submittedAt?: string
}

const label: React.CSSProperties = {
  ...text,
  margin: '0 0 6px',
}

const Row = ({ name, value }: { name: string; value?: string }) =>
  value ? (
    <Text style={label}>
      <strong>{name}:</strong> {value}
    </Text>
  ) : null

const Email = ({
  clientName = 'New client',
  clientPhone,
  clientEmail,
  bookingType = 'Consultation request',
  service,
  preferredDate,
  preferredTime,
  location,
  notes,
  submittedAt,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New booking: ${clientName}${service ? ` — ${service}` : ''}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brandBar}>Meltaways Spa</Text>
        <Hr style={rule} />
        <Heading style={h1}>New booking request</Heading>
        <Row name="Type" value={bookingType} />
        <Row name="Name" value={clientName} />
        <Row name="Phone" value={clientPhone} />
        <Row name="Email" value={clientEmail} />
        <Row name="Service / package" value={service} />
        <Row name="Preferred date" value={preferredDate} />
        <Row name="Preferred time" value={preferredTime} />
        <Row name="Location" value={location} />
        <Row name="Submitted" value={submittedAt} />
        {notes ? (
          <>
            <Hr style={rule} />
            <Text style={text}>{notes}</Text>
          </>
        ) : null}
        <Hr style={hr} />
        <Text style={footer}>
          Internal notification · view and manage this lead in the Melt Away Spa Digital Hub.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `New booking: ${data['clientName'] || 'client'}${data['service'] ? ` — ${data['service']}` : ''}`,
  displayName: 'Internal — New Booking Alert',
  previewData: {
    clientName: 'Jane Doe',
    clientPhone: '+1 868 555 0123',
    clientEmail: 'jane@example.com',
    bookingType: 'Consultation request',
    service: 'Melt & Contour Plan',
    preferredDate: '2026-09-02',
    preferredTime: '10:00 AM',
    location: 'El Dorado',
    notes: 'Interested in abdomen and waist.',
    submittedAt: '23 Aug 2026, 7:14 PM',
  },
} satisfies TemplateEntry
