import * as React from 'react'
import { render } from '@react-email/render'
import { TEMPLATES } from '@/lib/email-templates/registry'

export async function assertAdmin(context: any) {
  const { data, error } = await context.supabase.rpc('has_role', {
    _user_id: context.userId,
    _role: 'admin',
  })
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Forbidden — admin only')
}

export function listTemplates() {
  return Object.entries(TEMPLATES).map(([name, entry]) => ({
    name,
    displayName: entry.displayName || name,
    previewData: entry.previewData ?? {},
    fixedRecipient: entry.to ?? null,
  }))
}

export async function renderTemplate(name: string, data: Record<string, any>) {
  const entry = TEMPLATES[name]
  if (!entry) throw new Error(`Unknown template: ${name}`)
  const subject =
    typeof entry.subject === 'function' ? entry.subject(data) : entry.subject
  const html = await render(React.createElement(entry.component, data))
  return { subject, html }
}