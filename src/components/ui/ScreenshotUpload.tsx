import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useAppStore } from '../../store'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

import {
  Upload,
  ImageIcon,
  Trash2,
  Replace,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export default function ScreenshotUpload() {
  const { screenshotDataUrl, setScreenshot } = useAppStore()

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => setScreenshot(reader.result as string)
      reader.readAsDataURL(file)
    },
    [setScreenshot]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <AnimatePresence mode="wait">
      {!screenshotDataUrl ? (
        <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div
            {...getRootProps()}
            className={`
              relative rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden
              ${isDragActive
                ? 'bg-brand-500/10 border-2 border-brand-500 shadow-lg shadow-brand-500/10'
                : 'bg-white/[0.02] border-2 border-dashed border-white/[0.08] hover:border-brand-500/30 hover:bg-white/[0.03]'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className={`mx-auto size-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-brand-500/20' : 'bg-white/[0.04]'
              }`}>
              <Upload className={`size-7 ${isDragActive ? 'text-brand-400' : 'text-zinc-500'}`} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-bold mb-1">
              {isDragActive ? 'Release to upload' : 'Drop your screenshot here'}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse · PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <div className="flex gap-4 items-start">
            {/* Preview thumb */}
            <div className="relative w-32 h-auto rounded-xl overflow-hidden border border-white/[0.06] shrink-0 group">
              <img
                src={screenshotDataUrl}
                alt="Preview"
                className="w-full h-auto object-contain"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon className="size-5 text-white" />
              </div>
            </div>

            {/* Info + Actions */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px] font-bold gap-1">
                  <ShieldCheck className="size-3" />
                  Ready
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your screenshot will be mapped onto the device screen.
              </p>
              <div className="flex gap-2">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Replace className="size-3" />
                    Replace
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setScreenshot(null)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1.5"
                >
                  <Trash2 className="size-3" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
