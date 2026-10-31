import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export const listEmailTemplates = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin, listTemplates } = await import('./email-preview.server')
    await assertAdmin(context)
    return listTemplates()
  })

export const renderEmailTemplate = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { name: string; data?: Record<string, any> }) => d)
  .handler(async ({ data, context }) => {
    const { assertAdmin, renderTemplate } = await import('./email-preview.server')
    await assertAdmin(context)
    return renderTemplate(data.name, data.data ?? {})
  })

export const sendTestEmail = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { name: string; recipientEmail: string; data?: Record<string, any> }) => d)
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import('./email-preview.server')
    await assertAdmin(context)
    const { sendAppEmail } = await import('./email/send.server')
    return sendAppEmail({
      templateName: data.name,
      recipientEmail: data.recipientEmail,
      idempotencyKey: `test-${data.name}-${Date.now()}`,
      templateData: data.data ?? {},
    })
  })