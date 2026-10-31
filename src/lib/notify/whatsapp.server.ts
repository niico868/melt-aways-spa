const GATEWAY_URL = 'https://connector-gateway.lovable.dev/twilio'

/** Business WhatsApp number that receives booking alerts (E.164, no spaces). */
const DEFAULT_TO = '+18683785630'
/** Twilio WhatsApp sender. Sandbox number works until a business sender is approved. */
const DEFAULT_FROM = '+14155238886'

export interface BookingAlert {
  bookingType: string
  clientName: string
  clientPhone?: string | null
  clientEmail?: string | null
  service?: string | null
  preferredDate?: string | null
  preferredTime?: string | null
  location?: string | null
  notes?: string | null
}

function buildMessage(a: BookingAlert): string {
  return [
    `🔔 New ${a.bookingType} — Melt Aways`,
    `Name: ${a.clientName}`,
    a.clientPhone ? `Phone: ${a.clientPhone}` : '',
    a.clientEmail ? `Email: ${a.clientEmail}` : '',
    a.service ? `Interest: ${a.service}` : '',
    a.preferredDate ? `Preferred: ${a.preferredDate}${a.preferredTime ? ' ' + a.preferredTime : ''}` : '',
    a.location ? `Location: ${a.location}` : '',
    a.notes ? `Notes: ${a.notes}` : '',
    'Open the Digital Hub to review.',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 1500)
}

/**
 * Sends a WhatsApp booking alert to the business number via the Twilio connector
 * gateway. Never throws — notification failures must not block a submission.
 */
export async function sendWhatsAppBookingAlert(alert: BookingAlert): Promise<{ sent: boolean; reason?: string }> {
  const lovableKey = process.env['LOVABLE_API_KEY']
  const twilioKey = process.env['TWILIO_API_KEY']
  if (!lovableKey || !twilioKey) return { sent: false, reason: 'missing_config' }

  const to = process.env['TWILIO_WHATSAPP_TO'] || DEFAULT_TO
  const from = process.env['TWILIO_WHATSAPP_FROM'] || DEFAULT_FROM

  try {
    const response = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        'X-Connection-Api-Key': twilioKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: `whatsapp:${to}`,
        From: `whatsapp:${from}`,
        Body: buildMessage(alert),
      }),
    })
    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`Twilio WhatsApp alert failed [${response.status}]: ${errorBody}`)
      return { sent: false, reason: `provider_${response.status}` }
    }
    return { sent: true }
  } catch (e) {
    console.error('Twilio WhatsApp alert threw', e)
    return { sent: false, reason: 'network_error' }
  }
}
