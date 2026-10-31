import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

/** Welcome email to the signed-in user's own address (one-time per user). */
export const sendWelcomeEmail = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ firstName: z.string().max(100).optional() }).parse(d))
  .handler(async ({ data, context }) => {
    const email = (context.claims as any)?.email as string | undefined
    if (!email) return { success: false, reason: 'no_email' }
    const { sendAppEmail } = await import('./send.server')
    return sendAppEmail({
      templateName: 'welcome-registered',
      recipientEmail: email,
      idempotencyKey: `welcome-${context.userId}`,
      templateData: { firstName: data.firstName },
    })
  })

/** Treatment-complete congratulations for a customer the staff user can see. */
export const sendTreatmentCompleteEmail = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ customerId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: customer, error } = await context.supabase
      .from('customers').select('id, email, full_name').eq('id', data.customerId).maybeSingle()
    if (error || !customer?.email) return { success: false, reason: 'not_found' }
    const { sendAppEmail } = await import('./send.server')
    return sendAppEmail({
      templateName: 'treatment-complete',
      recipientEmail: customer.email,
      idempotencyKey: `treatment-complete-${customer.id}`,
      templateData: { firstName: String(customer.full_name || '').trim().split(/\s+/)[0] },
    })
  })
