import { useAppStore } from '../../store'
import { estimateFileSize, downloadFile, formatFileSize } from '../../utils/export'
import type { ExportResolution, ExportFormat } from '../../types'
import { motion, AnimatePresence } from 'framer-motion'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Slider } from '../../components/ui/slider'
import { Separator } from '../../components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '../../components/ui/toggle-group'

import {
  Download,
  MonitorPlay,
  Film,
  Gauge,
  Loader2,
  CheckCircle2,
  Zap,
} from 'lucide-react'

interface ExportDialogProps {
  open: boolean
  onClose: () => void
  onExport: () => void
}

export default function ExportDialog({ open, onClose, onExport }: ExportDialogProps) {
  const { exportSettings, exportProgress, setExportSettings, selectedTemplateId } = useAppStore()
  const estimatedSize = estimateFileSize(exportSettings, 4)

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Download className="size-4 text-primary-foreground" />
            </div>
            Export Video
          </DialogTitle>
          <DialogDescription>Configure render settings and export your mockup.</DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {exportProgress.status === 'idle' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Resolution */}
              <div className="space-y-2.5">
                <label className="text-xs font-medium flex items-center gap-2">
                  <MonitorPlay className="size-3.5 text-primary" />
                  Resolution
                </label>
                <ToggleGroup
                  type="single"
                  value={exportSettings.resolution}
                  onValueChange={(val) => val && setExportSettings({ resolution: val as ExportResolution })}
                  variant="outline"
                  className="w-full"
                >
                  {(['720p', '1080p', '4k'] as ExportResolution[]).map((res) => (
                    <ToggleGroupItem key={res} value={res} className="flex-1 text-xs font-semibold">
                      {res}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* FPS & Format */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <label className="text-xs font-medium flex items-center gap-2">
                    <Zap className="size-3.5 text-accent-500" />
                    FPS
                  </label>
                  <ToggleGroup
                    type="single"
                    value={String(exportSettings.fps)}
                    onValueChange={(val) => val && setExportSettings({ fps: Number(val) })}
                    variant="outline"
                    className="w-full"
                  >
                    {[24, 30, 60].map((fps) => (
                      <ToggleGroupItem key={fps} value={String(fps)} className="flex-1 text-[10px] font-bold">
                        {fps}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-medium flex items-center gap-2">
                    <Film className="size-3.5 text-accent-500" />
                    Format
                  </label>
                  <ToggleGroup
                    type="single"
                    value={exportSettings.format}
                    onValueChange={(val) => val && setExportSettings({ format: val as ExportFormat })}
                    variant="outline"
                    className="w-full"
                  >
                    {(['mp4', 'webm', 'gif'] as ExportFormat[]).map((fmt) => (
                      <ToggleGroupItem key={fmt} value={fmt} className="flex-1 text-[10px] font-bold uppercase">
                        {fmt}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium flex items-center gap-2">
                    <Gauge className="size-3.5 text-primary" />
                    Quality
                  </label>
                  <Badge variant="secondary" className="text-[10px] font-mono py-0">{exportSettings.quality}/10</Badge>
                </div>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[exportSettings.quality]}
                  onValueChange={(val) => setExportSettings({ quality: val[0] })}
                />
              </div>

              <Separator />

              {/* Estimate */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-muted-foreground">Estimated file size</span>
                <span className="text-xs font-mono font-semibold">{estimatedSize}</span>
              </div>
            </motion.div>
          )}

          {/* Rendering */}
          {(exportProgress.status === 'rendering' || exportProgress.status === 'encoding') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 flex flex-col items-center text-center gap-4">
              <div className="relative size-20">
                <svg className="size-20 -rotate-90">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" className="text-secondary" strokeWidth="4" />
                  <circle
                    cx="40" cy="40" r="36"
                    fill="none" stroke="currentColor" className="text-primary" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={226}
                    strokeDashoffset={226 - (226 * exportProgress.percentage) / 100}
                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-lg font-bold">{exportProgress.percentage}%</span>
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold">
                  {exportProgress.status === 'rendering' ? 'Rendering frames...' : 'Encoding video...'}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Frame {exportProgress.currentFrame} / {exportProgress.totalFrames}
                </p>
              </div>
            </motion.div>
          )}

          {/* Complete */}
          {exportProgress.status === 'complete' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 flex flex-col items-center text-center gap-4">
              <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">Export Complete</h3>
                <p className="text-xs text-muted-foreground mt-1">Your mockup video is ready.</p>
              </div>
              {exportProgress.fileSize && (
                <Badge variant="secondary" className="font-mono">{formatFileSize(exportProgress.fileSize)}</Badge>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {exportProgress.status === 'complete' ? 'Close' : 'Cancel'}
          </Button>

          {exportProgress.status === 'idle' && (
            <Button onClick={onExport} disabled={!selectedTemplateId}>
              Start Export
            </Button>
          )}

          {exportProgress.status === 'complete' && exportProgress.downloadUrl && (
            <Button
              onClick={() => downloadFile(exportProgress.downloadUrl!, `mockup-${Date.now()}.${exportSettings.format}`)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="size-4" />
              Download
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
