import type { MotionTemplate, TemplateCategory } from '../types'

import { Rotation360 } from './floating/Rotation360'
import { FloatBounce } from './floating/FloatBounce'
import { SlowSpin } from './floating/SlowSpin'
import { ZoomReveal } from './cinematic/ZoomReveal'
import { ZoomOut } from './cinematic/ZoomOut'
import { DeskSetup } from './desk/DeskSetup'

export const templateRegistry: Record<string, MotionTemplate> = {
  'rotation-360': Rotation360,
  'float-bounce': FloatBounce,
  'slow-spin': SlowSpin,
  'cinematic-zoom-reveal': ZoomReveal,
  'cinematic-zoom-out': ZoomOut,
  'desk-setup': DeskSetup,
}

export function getTemplateById(id: string): MotionTemplate | undefined {
  return templateRegistry[id]
}

export function getTemplatesByCategory(category: TemplateCategory): MotionTemplate[] {
  return Object.values(templateRegistry).filter((t) => t.category === category)
}

export function getAllTemplates(): MotionTemplate[] {
  return Object.values(templateRegistry)
}

export function searchTemplates(query: string): MotionTemplate[] {
  const lower = query.toLowerCase()
  return Object.values(templateRegistry).filter(
    (t) =>
      t.name.toLowerCase().includes(lower) ||
      t.description.toLowerCase().includes(lower) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lower))
  )
}
