import type { Texture } from 'three'

// ============================================================
// Device Types
// ============================================================

export type DeviceCategory = 'phone' | 'tablet' | 'laptop' | 'watch'

export interface DeviceColor {
  name: string
  hex: string
}

export interface DeviceMetadata {
  id: string
  name: string
  brand: string
  category: DeviceCategory
  year: number
  colors: DeviceColor[]
  defaultColor: string
  tags: string[]
  thumbnail?: string
  featured?: boolean
}

export interface DeviceDimensions {
  width: number
  height: number
  depth: number
  screenWidth: number
  screenHeight: number
  screenOffsetX: number
  screenOffsetY: number
  screenOffsetZ: number
  cornerRadius: number
}

export interface DeviceComponentProps {
  screen?: Texture | null
  color?: string
  rotation?: [number, number, number]
  position?: [number, number, number]
  scale?: [number, number, number]
}

export interface DeviceEntry {
  metadata: DeviceMetadata
  dimensions: DeviceDimensions
  componentCode?: string
}

// ============================================================
// Animation Template Types
// ============================================================

export type TemplateCategory = 'floating' | 'desk' | 'cinematic' | 'hand' | 'multi'

export interface AnimationState {
  camera: {
    position: [number, number, number]
    target: [number, number, number]
    fov: number
  }
  device: {
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
  }
  background: string | { type: 'gradient'; colors: string[]; angle?: number }
  lighting: {
    ambient: number
    directional: {
      position: [number, number, number]
      intensity: number
    }
  }
}

export interface MotionTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  duration: number
  fps: number
  tags: string[]
  previewGif?: string
  animate: (frame: number, totalFrames: number, deviceType: DeviceCategory) => AnimationState
}

// ============================================================
// Text Overlay Types
// ============================================================

export interface TextOverlay {
  id: string
  text: string
  font: string
  size: number
  weight: 300 | 400 | 500 | 600 | 700
  color: string
  position: { x: number; y: number }
  animation: 'none' | 'fade-in' | 'fade-out' | 'slide-in'
  animationDelay: number
}

// ============================================================
// Export Types
// ============================================================

export type ExportResolution = '720p' | '1080p' | '4k'
export type ExportFormat = 'mp4' | 'webm' | 'gif'

export interface ExportSettings {
  resolution: ExportResolution
  fps: number
  format: ExportFormat
  quality: number // 1-10
}

export interface ExportProgress {
  status: 'idle' | 'rendering' | 'encoding' | 'complete' | 'error'
  currentFrame: number
  totalFrames: number
  percentage: number
  estimatedTimeRemaining?: number
  error?: string
  downloadUrl?: string
  fileSize?: number
}

export const RESOLUTION_MAP: Record<ExportResolution, { width: number; height: number }> = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '4k': { width: 3840, height: 2160 },
}

// ============================================================
// Project Types
// ============================================================

export interface Project {
  id: string
  name: string
  deviceId: string
  deviceColor: string
  screenshotDataUrl?: string
  templateId: string
  background: string | { type: 'gradient'; colors: string[]; angle?: number }
  textOverlays: TextOverlay[]
  customRotation: [number, number, number]
  createdAt: number
  updatedAt: number
}

// ============================================================
// Admin / AI Analysis Types
// ============================================================

export interface AIAnalysisResult {
  model: string
  device: {
    name: string
    brand: string
    type: DeviceCategory
    year: number
  }
  dimensions: DeviceDimensions
  materials: {
    bodyMaterial: string
    baseColor: string
    metalness: number
    roughness: number
  }
  features: {
    notchType: string
    notchPosition: { x: number; y: number }
    notchSize: { width: number; height: number }
    cameraModule: {
      shape: string
      position: { x: number; y: number; z: number }
      size: { width: number; height: number }
      protrusion: number
      lensCount: number
    }
    buttons: Array<{
      name: string
      position: { x: number; y: number }
      size: { width: number; height: number }
    }>
  }
  colors: DeviceColor[]
}

export interface AnalysisComparison {
  field: string
  valueA: number | string
  valueB: number | string
  percentDiff?: number
  status: 'match' | 'minor' | 'significant'
}

// ============================================================
// Settings Types
// ============================================================

export interface AppSettings {
  geminiApiKey: string
  openrouterApiKey: string
  autoSave: boolean
  autoSaveInterval: number
  defaultExportSettings: ExportSettings
  showOnboarding: boolean
}
