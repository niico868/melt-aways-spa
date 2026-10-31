import { createEmailWebhookHandler } from '@lovable.dev/email-js'
import { createFileRoute } from '@tanstack/react-router'

type Reason = 'bounce' | 'complaint' | 'unsubscribe'
const STATUS = { bounce: 'bounced', complaint: 'complained', unsubscribe: 'suppressed' } as const
const MESSAGE = {
  bounce: 'Permanent bounce — email address is invalid or rejected',
  complaint: 'Spam complaint — recipient marked email as spam',
  unsubscribe: 'Recipient unsubscribed',
} as const

async function record(reason: Reason, event: any) {
  const recipient = String(event?.data?.recipient ?? '').toLowerCase()
  if (!recipient) return
  const { createClient } = await import('@supabase/supabase-js')
  const url = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Server configuration error')
  const supabase = createClient(url, key)

  const { error: e1 } = await supabase
    .from('suppressed_emails')
    .upsert({ email: recipient, reason, metadata: null }, { onConflict: 'email' })
  if (e1) {
    console.error('suppressed_emails upsert failed', { code: e1.code, message: e1.message, event_id: event.event_id })
    throw new Error('suppression write failed')
  }
  const { error: e2 } = await supabase.from('email_send_log').insert({
    message_id: null, template_name: 'system', recipient_email: recipient,
    status: STATUS[reason], error_message: MESSAGE[reason], metadata: null,
  })
  if (e2) {
    console.error('email_send_log insert failed', { code: e2.code, message: e2.message, event_id: event.event_id })
    throw new Error('log write failed')
  }
}

export const Route = createFileRoute("/lovable/email/events")({
  server: {
    handlers: {
      POST: ({ request }) => {
        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) {
          console.error('Missing required environment variables')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }
        const handler = createEmailWebhookHandler({
          apiKey,
          on: {
            'email.bounced': async (event) => { await record('bounce', event) },
            'email.complaint': async (event) => { await record('complaint', event) },
            'email.unsubscribed': async (event) => { await record('unsubscribe', event) },
          },
        })
        return handler(request)
      },
    },
  },
})
