import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../../store'
import SceneCanvas from '../../components/canvas/SceneCanvas'
import TimelineBar from '../../components/canvas/TimelineBar'
import DeviceSelector from '../../components/ui/DeviceSelector'
import ScreenshotUpload from '../../components/ui/ScreenshotUpload'
import TemplateGallery from '../../components/ui/TemplateGallery'
import CustomizePanel from '../../components/ui/CustomizePanel'
import ExportDialog from '../../components/export/ExportDialog'
import {
  Smartphone,
  Upload,
  Film,
  Palette,
  Download,
  Settings,
  ChevronDown,
  ChevronUp,
  Maximize2,
  RotateCcw,
} from 'lucide-react'

interface StepConfig {
  id: string
  label: string
  icon: React.ElementType
  panel: string
}

const steps: StepConfig[] = [
  { id: 'devices', label: 'Select Device', icon: Smartphone, panel: 'devices' },
  { id: 'upload', label: 'Upload Screenshot', icon: Upload, panel: 'upload' },
  { id: 'templates', label: 'Choose Animation', icon: Film, panel: 'templates' },
  { id: 'customize', label: 'Customize', icon: Palette, panel: 'customize' },
]

export default function MockupStudio() {
  const {
    activePanel,
    setActivePanel,
    selectedDeviceId,
    screenshotDataUrl,
    selectedTemplateId,
    resetProject,
    setExportProgress,
  } = useAppStore()

  const [showExport, setShowExport] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [expandedStep, setExpandedStep] = useState<string>(activePanel)

  const getStepStatus = (stepId: string): 'complete' | 'current' | 'pending' => {
    if (stepId === 'devices' && selectedDeviceId) return 'complete'
    if (stepId === 'upload' && screenshotDataUrl) return 'complete'
    if (stepId === 'templates' && selectedTemplateId) return 'complete'
    if (stepId === activePanel) return 'current'
    return 'pending'
  }

  const handleExport = () => {
    // Start export process
    setExportProgress({
      status: 'rendering',
      currentFrame: 0,
      totalFrames: 120,
      percentage: 0,
    })

    // Simulate export for now
    let frame = 0
    const interval = setInterval(() => {
      frame += 3
      if (frame >= 120) {
        clearInterval(interval)
        setExportProgress({
          status: 'complete',
          currentFrame: 120,
          totalFrames: 120,
          percentage: 100,
          downloadUrl: '#',
          fileSize: 14_200_000,
        })
      } else {
        setExportProgress({
          status: frame > 100 ? 'encoding' : 'rendering',
          currentFrame: frame,
          totalFrames: 120,
          percentage: Math.round((frame / 120) * 100),
        })
      }
    }, 100)
  }

  return (
    <div className="h-screen flex flex-col bg-surface-950">
      {/* Top Bar */}
      <header className="h-12 flex items-center justify-between px-4 bg-surface-900 border-b border-surface-800 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-white tracking-tight">MOCKUP STUDIO</h1>
          <span className="text-[10px] px-1.5 py-0.5 bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/30">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetProject}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-surface-400 hover:text-surface-300 hover:bg-surface-800 rounded-lg transition-colors"
          >
            <RotateCcw size={12} />
            New
          </button>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-surface-400 hover:text-surface-300 hover:bg-surface-800 rounded-lg transition-colors"
          >
            <Settings size={12} />
            Admin
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {!isFullscreen && (
          <aside className="w-72 bg-surface-900/50 border-r border-surface-800 flex flex-col overflow-hidden">
            {/* Step Accordion */}
            <div className="flex-1 overflow-y-auto">
              {steps.map((step) => {
                const status = getStepStatus(step.id)
                const isExpanded = expandedStep === step.id
                return (
                  <div key={step.id} className="border-b border-surface-800">
                    <button
                      onClick={() => {
                        setExpandedStep(isExpanded ? '' : step.id)
                        setActivePanel(step.panel as any)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                        isExpanded ? 'bg-surface-800/50' : 'hover:bg-surface-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Step indicator */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            status === 'complete'
                              ? 'bg-green-500/20 text-green-400'
                              : status === 'current'
                                ? 'bg-primary-500/20 text-primary-400'
                                : 'bg-surface-700 text-surface-500'
                          }`}
                        >
                          {status === 'complete' ? (
                            <span className="text-[10px]">✓</span>
                          ) : (
                            <step.icon size={12} />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            status === 'current' ? 'text-white' : 'text-surface-300'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-surface-500" />
                      ) : (
                        <ChevronDown size={14} className="text-surface-500" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4">
                        {step.id === 'devices' && <DeviceSelector />}
                        {step.id === 'upload' && <ScreenshotUpload />}
                        {step.id === 'templates' && <TemplateGallery />}
                        {step.id === 'customize' && <CustomizePanel />}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Export Button */}
            <div className="p-4 border-t border-surface-800">
              <button
                onClick={() => {
                  setExportProgress({
                    status: 'idle',
                    currentFrame: 0,
                    totalFrames: 0,
                    percentage: 0,
                  })
                  setShowExport(true)
                }}
                disabled={!selectedDeviceId || !selectedTemplateId}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600
                  disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <Download size={16} />
                Export Video
              </button>
            </div>
          </aside>
        )}

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <SceneCanvas />
          <TimelineBar />

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-surface-900/80 backdrop-blur-sm text-surface-400
              hover:text-white border border-surface-700 transition-colors"
          >
            <Maximize2 size={14} />
          </button>

          {/* Empty state */}
          {!selectedDeviceId && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <Smartphone size={48} className="mx-auto mb-3 text-surface-700" />
                <p className="text-lg font-medium text-surface-500">Select a device to get started</p>
                <p className="text-sm text-surface-600 mt-1">Choose from the sidebar on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExport}
        onClose={() => setShowExport(false)}
        onExport={handleExport}
      />
    </div>
  )
}
