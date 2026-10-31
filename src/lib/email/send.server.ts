import { createClient } from '@supabase/supabase-js'
import { TEMPLATES } from '@/lib/email-templates/registry'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

function redactEmail(email?: string | null): string {
  if (!email) return '***'
  const [l, d] = email.split('@')
  return l && d ? `${l[0]}***@${d}` : '***'
}

export interface SendAppEmailInput {
  templateName: string
  recipientEmail: string
  idempotencyKey?: string
  templateData?: Record<string, any>
  /** Skip if an email with this template was already logged for the recipient. */
  onlyOnce?: boolean
}

/**
 * Server-side app email send. Sends through the managed email API and keeps
 * writing outcome rows to email_send_log (used by onlyOnce checks).
 */
export async function sendAppEmail({
  templateName,
  recipientEmail,
  idempotencyKey,
  templateData = {},
  onlyOnce = false,
}: SendAppEmailInput): Promise<{ success: boolean; reason?: string }> {
  const template = TEMPLATES[templateName]
  if (!template) return { success: false, reason: 'template_not_found' }
  const to = (template.to || recipientEmail || '').toLowerCase()
  if (!to.includes('@')) return { success: false, reason: 'no_recipient' }

  const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey) : null

  const log = async (status: 'sent' | 'suppressed' | 'failed', error_message?: string) => {
    if (!supabase) return
    const { error } = await supabase.from('email_send_log').insert({
      message_id: null, template_name: templateName, recipient_email: to, status,
      ...(error_message ? { error_message } : {}),
    })
    if (error) console.error('email_send_log insert failed', { code: error.code, message: error.message })
  }

  if (onlyOnce && supabase) {
    const { data: prior } = await supabase
      .from('email_send_log').select('id')
      .eq('template_name', templateName).eq('recipient_email', to).limit(1)
    if (prior?.length) return { success: false, reason: 'already_sent' }
  }

  try {
    const result = await sendTemplateEmail(templateName, to, { templateData, idempotencyKey })
    if (!result.sent) {
      await log('suppressed')
      return { success: false, reason: 'email_suppressed' }
    }
    await log('sent')
    return { success: true }
  } catch (err: any) {
    console.error('sendAppEmail failed', { templateName, recipient: redactEmail(to), message: err?.message })
    await log('failed', String(err?.message ?? 'Send failed').slice(0, 500))
    return { success: false, reason: 'send_failed' }
  }
}
