import { useAppStore } from '../../store'
import { estimateFileSize, downloadFile, formatFileSize } from '../../utils/export'
import type { ExportResolution, ExportFormat } from '../../types'
import { Download, X, Monitor, Film, Sliders, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface ExportDialogProps {
  open: boolean
  onClose: () => void
  onExport: () => void
}

export default function ExportDialog({ open, onClose, onExport }: ExportDialogProps) {
  const { exportSettings, exportProgress, setExportSettings } = useAppStore()
  const { selectedTemplateId } = useAppStore()

  if (!open) return null

  const estimatedSize = estimateFileSize(exportSettings, 4) // default 4s duration

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-900 border border-surface-700 rounded-xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-700">
          <h2 className="text-lg font-semibold text-white">Export Video</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-700 text-surface-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {exportProgress.status === 'idle' && (
            <>
              {/* Resolution */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-surface-300">
                  <Monitor size={12} />
                  Resolution
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['720p', '1080p', '4k'] as ExportResolution[]).map((res) => (
                    <button
                      key={res}
                      onClick={() => setExportSettings({ resolution: res })}
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                        exportSettings.resolution === res
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-surface-700 bg-surface-800 text-surface-400 hover:border-surface-600'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* FPS */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-surface-300">
                  <Film size={12} />
                  Frame Rate
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[24, 30, 60].map((fps) => (
                    <button
                      key={fps}
                      onClick={() => setExportSettings({ fps })}
                      className={`py-2 rounded-lg border text-sm transition-all ${
                        exportSettings.fps === fps
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-surface-700 bg-surface-800 text-surface-400 hover:border-surface-600'
                      }`}
                    >
                      {fps} fps
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-surface-300">Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mp4', 'webm', 'gif'] as ExportFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setExportSettings({ format: fmt })}
                      className={`py-2 rounded-lg border text-sm uppercase transition-all ${
                        exportSettings.format === fmt
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-surface-700 bg-surface-800 text-surface-400 hover:border-surface-600'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-surface-300">
                  <Sliders size={12} />
                  Quality
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={exportSettings.quality}
                    onChange={(e) => setExportSettings({ quality: parseInt(e.target.value) })}
                    className="flex-1 h-1.5 bg-surface-700 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="text-sm text-surface-400 w-8 text-right">
                    {exportSettings.quality}
                  </span>
                </div>
              </div>

              {/* Estimated Size */}
              <div className="flex items-center justify-between py-2 px-3 bg-surface-800 rounded-lg border border-surface-700">
                <span className="text-xs text-surface-400">Estimated file size</span>
                <span className="text-sm font-medium text-surface-200">~{estimatedSize}</span>
              </div>
            </>
          )}

          {/* Progress */}
          {(exportProgress.status === 'rendering' || exportProgress.status === 'encoding') && (
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3">
                <Loader2 size={20} className="text-primary-500 animate-spin" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {exportProgress.status === 'rendering'
                      ? `Rendering frame ${exportProgress.currentFrame} of ${exportProgress.totalFrames}...`
                      : 'Encoding video...'}
                  </p>
                  <p className="text-xs text-surface-400">Please wait, this may take a moment</p>
                </div>
              </div>
              <div className="w-full h-2 bg-surface-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress.percentage}%` }}
                />
              </div>
              <p className="text-xs text-surface-500 text-center">{exportProgress.percentage}%</p>
            </div>
          )}

          {/* Complete */}
          {exportProgress.status === 'complete' && (
            <div className="space-y-3 py-4 text-center">
              <CheckCircle size={40} className="text-green-500 mx-auto" />
              <p className="text-lg font-semibold text-white">Export Complete!</p>
              {exportProgress.fileSize && (
                <p className="text-sm text-surface-400">
                  File size: {formatFileSize(exportProgress.fileSize)}
                </p>
              )}
              {exportProgress.downloadUrl && (
                <button
                  onClick={() => {
                    downloadFile(exportProgress.downloadUrl!, `mockup-${Date.now()}.${exportSettings.format}`)
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
              )}
            </div>
          )}

          {/* Error */}
          {exportProgress.status === 'error' && (
            <div className="space-y-3 py-4 text-center">
              <AlertCircle size={40} className="text-red-500 mx-auto" />
              <p className="text-sm font-medium text-red-400">Export Failed</p>
              <p className="text-xs text-surface-400">{exportProgress.error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-surface-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-surface-400 hover:text-surface-300 transition-colors"
          >
            {exportProgress.status === 'complete' ? 'Close' : 'Cancel'}
          </button>
          {exportProgress.status === 'idle' && (
            <button
              onClick={onExport}
              disabled={!selectedTemplateId}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              Export Video
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
