import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  DeviceEntry,
  MotionTemplate,
  TextOverlay,
  ExportSettings,
  ExportProgress,
  AppSettings,
  DeviceCategory,
} from '../types'

// ============================================================
// App Store - Main application state
// ============================================================

interface AppState {
  // Device selection
  selectedDeviceId: string | null
  selectedDeviceColor: string
  devices: DeviceEntry[]

  // Screenshot
  screenshotDataUrl: string | null

  // Template
  selectedTemplateId: string | null
  templates: MotionTemplate[]

  // Customization
  background: string | { type: 'gradient'; colors: string[]; angle?: number }
  customRotation: [number, number, number]
  textOverlays: TextOverlay[]

  // Playback
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  isLooping: boolean

  // Export
  exportSettings: ExportSettings
  exportProgress: ExportProgress

  // UI
  activePanel: 'devices' | 'upload' | 'templates' | 'customize' | 'export'
  showOnboarding: boolean

  // Actions
  setSelectedDevice: (id: string | null) => void
  setSelectedDeviceColor: (color: string) => void
  setScreenshot: (dataUrl: string | null) => void
  setSelectedTemplate: (id: string | null) => void
  setBackground: (bg: string | { type: 'gradient'; colors: string[]; angle?: number }) => void
  setCustomRotation: (rotation: [number, number, number]) => void
  addTextOverlay: (overlay: TextOverlay) => void
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void
  removeTextOverlay: (id: string) => void
  setIsPlaying: (playing: boolean) => void
  setCurrentFrame: (frame: number) => void
  setPlaybackSpeed: (speed: number) => void
  setIsLooping: (looping: boolean) => void
  setExportSettings: (settings: Partial<ExportSettings>) => void
  setExportProgress: (progress: Partial<ExportProgress>) => void
  setActivePanel: (panel: AppState['activePanel']) => void
  setShowOnboarding: (show: boolean) => void
  addDevice: (device: DeviceEntry) => void
  addTemplate: (template: MotionTemplate) => void
  resetProject: () => void
}

const defaultExportSettings: ExportSettings = {
  resolution: '1080p',
  fps: 30,
  format: 'mp4',
  quality: 8,
}

const defaultExportProgress: ExportProgress = {
  status: 'idle',
  currentFrame: 0,
  totalFrames: 0,
  percentage: 0,
}

export const useAppStore = create<AppState>()((set) => ({
  selectedDeviceId: null,
  selectedDeviceColor: '#1d1d1f',
  devices: [],
  screenshotDataUrl: null,
  selectedTemplateId: null,
  templates: [],
  background: { type: 'gradient', colors: ['#667eea', '#764ba2'], angle: 135 },
  customRotation: [0, 0, 0],
  textOverlays: [],
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  isLooping: true,
  exportSettings: defaultExportSettings,
  exportProgress: defaultExportProgress,
  activePanel: 'devices',
  showOnboarding: true,

  setSelectedDevice: (id) => set({ selectedDeviceId: id, activePanel: id ? 'upload' : 'devices' }),
  setSelectedDeviceColor: (color) => set({ selectedDeviceColor: color }),
  setScreenshot: (dataUrl) => set({ screenshotDataUrl: dataUrl, activePanel: dataUrl ? 'templates' : 'upload' }),
  setSelectedTemplate: (id) => set({ selectedTemplateId: id, activePanel: id ? 'customize' : 'templates' }),
  setBackground: (bg) => set({ background: bg }),
  setCustomRotation: (rotation) => set({ customRotation: rotation }),
  addTextOverlay: (overlay) => set((s) => ({ textOverlays: [...s.textOverlays, overlay] })),
  updateTextOverlay: (id, updates) =>
    set((s) => ({
      textOverlays: s.textOverlays.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTextOverlay: (id) => set((s) => ({ textOverlays: s.textOverlays.filter((t) => t.id !== id) })),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentFrame: (frame) => set({ currentFrame: frame }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setIsLooping: (looping) => set({ isLooping: looping }),
  setExportSettings: (settings) => set((s) => ({ exportSettings: { ...s.exportSettings, ...settings } })),
  setExportProgress: (progress) => set((s) => ({ exportProgress: { ...s.exportProgress, ...progress } })),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setShowOnboarding: (show) => set({ showOnboarding: show }),
  addDevice: (device) => set((s) => ({ devices: [...s.devices, device] })),
  addTemplate: (template) => set((s) => ({ templates: [...s.templates, template] })),
  resetProject: () =>
    set({
      selectedDeviceId: null,
      selectedDeviceColor: '#1d1d1f',
      screenshotDataUrl: null,
      selectedTemplateId: null,
      background: { type: 'gradient', colors: ['#667eea', '#764ba2'], angle: 135 },
      customRotation: [0, 0, 0],
      textOverlays: [],
      isPlaying: false,
      currentFrame: 0,
      exportProgress: defaultExportProgress,
      activePanel: 'devices',
    }),
}))

// ============================================================
// Settings Store - Persisted to localStorage
// ============================================================

interface SettingsState extends AppSettings {
  setGeminiApiKey: (key: string) => void
  setOpenrouterApiKey: (key: string) => void
  setAutoSave: (enabled: boolean) => void
  setAutoSaveInterval: (interval: number) => void
  setDefaultExportSettings: (settings: ExportSettings) => void
  updateSettings: (settings: Partial<AppSettings>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      geminiApiKey: '',
      openrouterApiKey: '',
      autoSave: true,
      autoSaveInterval: 30000,
      defaultExportSettings: defaultExportSettings,
      showOnboarding: true,

      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setOpenrouterApiKey: (key) => set({ openrouterApiKey: key }),
      setAutoSave: (enabled) => set({ autoSave: enabled }),
      setAutoSaveInterval: (interval) => set({ autoSaveInterval: interval }),
      setDefaultExportSettings: (settings) => set({ defaultExportSettings: settings }),
      updateSettings: (settings) => set(settings),
    }),
    {
      name: 'mockup-studio-settings',
    }
  )
)

// ============================================================
// Admin Store - Device creation & template management
// ============================================================

interface AdminState {
  // Device creation
  uploadedImages: string[]
  analysisResults: { geminiPro?: unknown; geminiFla?: unknown }
  generatedCode: string
  isAnalyzing: boolean
  isGenerating: boolean

  // Template creation
  templateCode: string
  isGeneratingTemplate: boolean

  // Actions
  setUploadedImages: (images: string[]) => void
  addUploadedImage: (image: string) => void
  removeUploadedImage: (index: number) => void
  setAnalysisResults: (results: AdminState['analysisResults']) => void
  setGeneratedCode: (code: string) => void
  setIsAnalyzing: (analyzing: boolean) => void
  setIsGenerating: (generating: boolean) => void
  setTemplateCode: (code: string) => void
  setIsGeneratingTemplate: (generating: boolean) => void
  resetDeviceCreation: () => void
}

export const useAdminStore = create<AdminState>()((set) => ({
  uploadedImages: [],
  analysisResults: {},
  generatedCode: '',
  isAnalyzing: false,
  isGenerating: false,
  templateCode: '',
  isGeneratingTemplate: false,

  setUploadedImages: (images) => set({ uploadedImages: images }),
  addUploadedImage: (image) => set((s) => ({ uploadedImages: [...s.uploadedImages, image] })),
  removeUploadedImage: (index) =>
    set((s) => ({ uploadedImages: s.uploadedImages.filter((_, i) => i !== index) })),
  setAnalysisResults: (results) => set({ analysisResults: results }),
  setGeneratedCode: (code) => set({ generatedCode: code }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setTemplateCode: (code) => set({ templateCode: code }),
  setIsGeneratingTemplate: (generating) => set({ isGeneratingTemplate: generating }),
  resetDeviceCreation: () =>
    set({
      uploadedImages: [],
      analysisResults: {},
      generatedCode: '',
      isAnalyzing: false,
      isGenerating: false,
    }),
}))
