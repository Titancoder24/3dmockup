import type { DeviceMetadata, DeviceDimensions, DeviceCategory } from '../types'
import { lazy } from 'react'

// Lazy-loaded device components
const deviceComponents = {
  'iphone-15-pro': lazy(() => import('./phones/IPhone15Pro')),
  'samsung-s24-ultra': lazy(() => import('./phones/SamsungS24Ultra')),
  'ipad-pro-13': lazy(() => import('./tablets/IPadPro')),
  'macbook-pro-16': lazy(() => import('./laptops/MacBookPro')),
  'apple-watch-ultra': lazy(() => import('./watches/AppleWatchUltra')),
} as const

// Import metadata
import { metadata as iphone15ProMeta, dimensions as iphone15ProDims } from './phones/IPhone15Pro'
import { metadata as samsungS24Meta, dimensions as samsungS24Dims } from './phones/SamsungS24Ultra'
import { metadata as ipadProMeta, dimensions as ipadProDims } from './tablets/IPadPro'
import { metadata as macbookProMeta, dimensions as macbookProDims } from './laptops/MacBookPro'
import { metadata as watchUltraMeta, dimensions as watchUltraDims } from './watches/AppleWatchUltra'

export interface RegisteredDevice {
  metadata: DeviceMetadata
  dimensions: DeviceDimensions
  component: React.LazyExoticComponent<React.ComponentType<any>>
}

export const deviceRegistry: Record<string, RegisteredDevice> = {
  'iphone-15-pro': {
    metadata: iphone15ProMeta,
    dimensions: iphone15ProDims,
    component: deviceComponents['iphone-15-pro'],
  },
  'samsung-s24-ultra': {
    metadata: samsungS24Meta,
    dimensions: samsungS24Dims,
    component: deviceComponents['samsung-s24-ultra'],
  },
  'ipad-pro-13': {
    metadata: ipadProMeta,
    dimensions: ipadProDims,
    component: deviceComponents['ipad-pro-13'],
  },
  'macbook-pro-16': {
    metadata: macbookProMeta,
    dimensions: macbookProDims,
    component: deviceComponents['macbook-pro-16'],
  },
  'apple-watch-ultra': {
    metadata: watchUltraMeta,
    dimensions: watchUltraDims,
    component: deviceComponents['apple-watch-ultra'],
  },
}

export function getDeviceById(id: string): RegisteredDevice | undefined {
  return deviceRegistry[id]
}

export function getDevicesByCategory(category: DeviceCategory): RegisteredDevice[] {
  return Object.values(deviceRegistry).filter((d) => d.metadata.category === category)
}

export function getAllDevices(): RegisteredDevice[] {
  return Object.values(deviceRegistry)
}

export function searchDevices(query: string): RegisteredDevice[] {
  const lower = query.toLowerCase()
  return Object.values(deviceRegistry).filter(
    (d) =>
      d.metadata.name.toLowerCase().includes(lower) ||
      d.metadata.brand.toLowerCase().includes(lower) ||
      d.metadata.tags.some((t) => t.toLowerCase().includes(lower))
  )
}

export function getFeaturedDevices(): RegisteredDevice[] {
  return Object.values(deviceRegistry).filter((d) => d.metadata.featured)
}
