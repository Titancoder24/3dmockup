import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../../store'
import { motion, AnimatePresence } from 'framer-motion'

import SceneCanvas from '../../components/canvas/SceneCanvas'
import TimelineBar from '../../components/canvas/TimelineBar'
import DeviceSelector from '../../components/ui/DeviceSelector'
import ScreenshotUpload from '../../components/ui/ScreenshotUpload'
import TemplateGallery from '../../components/ui/TemplateGallery'
import CustomizePanel from '../../components/ui/CustomizePanel'
import ExportDialog from '../../components/export/ExportDialog'

import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { ScrollArea } from '../../components/ui/scroll-area'

import {
  Cpu,
  ImageUp,
  Film,
  Wand2,
  Download,
  Settings2,
  Cuboid,
  X,
  Grip,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

type PanelId = 'devices' | 'screenshot' | 'template' | 'customize' | null

const dockItems = [
  { id: 'devices' as const, label: 'Device', icon: Cpu, description: 'Pick a 3D model' },
  { id: 'screenshot' as const, label: 'Screen', icon: ImageUp, description: 'Upload content' },
  { id: 'template' as const, label: 'Motion', icon: Film, description: 'Choose animation' },
  { id: 'customize' as const, label: 'Adjust', icon: Wand2, description: 'Colors & style' },
]

export default function MockupStudio() {
  const {
    selectedDeviceId,
    screenshotDataUrl,
    selectedTemplateId,
    setActivePanel,
    resetProject,
  } = useAppStore()

  const [openPanel, setOpenPanel] = useState<PanelId>(null)
  const [exportOpen, setExportOpen] = useState(false)

  const handleDockClick = (id: PanelId) => {
    if (openPanel === id) {
      setOpenPanel(null)
    } else {
      setOpenPanel(id)
      if (id) setActivePanel(id)
    }
  }

  const stepDone = (id: string) => {
    if (id === 'devices') return !!selectedDeviceId
    if (id === 'screenshot') return !!screenshotDataUrl
    if (id === 'template') return !!selectedTemplateId
    return false
  }

  const allReady = selectedDeviceId && screenshotDataUrl && selectedTemplateId

  const panelContent: Record<string, { title: string; comp: React.ReactNode }> = {
    devices: { title: 'Choose Device', comp: <DeviceSelector /> },
    screenshot: { title: 'Upload Screenshot', comp: <ScreenshotUpload /> },
    template: { title: 'Select Motion', comp: <TemplateGallery /> },
    customize: { title: 'Customize Look', comp: <CustomizePanel /> },
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#09090b]">
      {/* ──── Full-Screen Canvas ──── */}
      <div className="absolute inset-0 z-0">
        {selectedDeviceId ? (
          <SceneCanvas />
        ) : (
          /* Empty state — onboarding */
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-md px-6"
            >
              <div className="relative mx-auto w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-3xl bg-brand-500/20 animate-pulse-ring" />
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-iris-500 flex items-center justify-center animate-float-slow">
                  <Cuboid className="size-9 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-3">
                Build your
                <span className="block bg-gradient-to-r from-brand-400 to-iris-400 bg-clip-text text-transparent">
                  3D Mockup
                </span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                Pick a device below to start. Upload a screenshot, choose a motion, and export a stunning video in minutes.
              </p>
              <Button
                size="lg"
                className="gap-2 text-base px-8"
                onClick={() => handleDockClick('devices')}
              >
                Get Started
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* ──── Floating Top Bar ──── */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto glass rounded-xl px-3 py-2 flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <Cuboid className="size-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-sm font-bold tracking-tight">Mockup Studio</span>
          <Badge variant="outline" className="text-[9px] font-mono ml-1">BETA</Badge>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="glass border-white/[0.06] bg-transparent hover:bg-white/[0.06]"
            onClick={resetProject}
          >
            <Settings2 className="size-3.5" />
          </Button>
          <Link to="/admin">
            <Button
              variant="outline"
              size="sm"
              className="glass border-white/[0.06] bg-transparent hover:bg-white/[0.06]"
            >
              Admin
            </Button>
          </Link>
          <Button
            size="sm"
            disabled={!allReady}
            onClick={() => setExportOpen(true)}
            className="gap-1.5"
          >
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* ──── Floating Timeline ──── */}
      {selectedTemplateId && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute z-20 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-2.5 max-w-2xl w-full mx-4 transition-all duration-300 ${openPanel ? 'bottom-[380px]' : 'bottom-24'
            }`}
        >
          <TimelineBar />
        </motion.div>
      )}

      {/* ──── Bottom Dock ──── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex justify-center pb-4 pointer-events-none">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto glass rounded-2xl p-1.5 flex items-center gap-1"
        >
          {dockItems.map((item) => {
            const isActive = openPanel === item.id
            const isDone = stepDone(item.id)

            return (
              <button
                key={item.id}
                onClick={() => handleDockClick(item.id)}
                className={`
                  relative flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'hover:bg-white/[0.06] text-zinc-400 hover:text-white'
                  }
                `}
              >
                {isDone && !isActive && (
                  <div className="absolute -top-1 -right-1 size-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                    <CheckCircle className="size-3 text-white" strokeWidth={3} />
                  </div>
                )}
                <item.icon className="size-5" strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
              </button>
            )
          })}
        </motion.div>
      </div>

      {/* ──── Slide-Up Drawer Panel ──── */}
      <AnimatePresence>
        {openPanel && panelContent[openPanel] && (
          <motion.div
            key={openPanel}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto"
            style={{ height: '360px' }}
          >
            <div className="h-full glass rounded-t-3xl flex flex-col">
              {/* Drag handle */}
              <div className="flex justify-center pt-2.5 pb-1 shrink-0">
                <div className="w-8 h-1 bg-white/[0.12] rounded-full" />
              </div>

              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 pb-3 shrink-0">
                <div>
                  <h2 className="text-base font-bold tracking-tight">{panelContent[openPanel].title}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setOpenPanel(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Panel Content */}
              <ScrollArea className="flex-1 px-6 pb-4">
                {panelContent[openPanel].comp}
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──── Export Dialog ──── */}
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onExport={() => { }}
      />
    </div>
  )
}
