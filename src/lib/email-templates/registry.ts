import type { ComponentType } from 'react'

import { template as welcomeRegistered } from './welcome-registered'
import { template as consultationBooked } from './consultation-booked'
import { template as consultationRecommendation } from './consultation-recommendation'
import { template as treatmentPackageWelcome } from './treatment-package-welcome'
import { template as treatmentReminder } from './treatment-reminder'
import { template as treatmentComplete } from './treatment-complete'
import { template as treatmentFollowup } from './treatment-followup'
import { template as internalNewBooking } from './internal-new-booking'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'welcome-registered': welcomeRegistered,
  'consultation-booked': consultationBooked,
  'consultation-recommendation': consultationRecommendation,
  'treatment-package-welcome': treatmentPackageWelcome,
  'treatment-reminder': treatmentReminder,
  'treatment-complete': treatmentComplete,
  'treatment-followup': treatmentFollowup,
  'internal-new-booking': { ...internalNewBooking, to: 'meltawaystt@gmail.com' },
}
