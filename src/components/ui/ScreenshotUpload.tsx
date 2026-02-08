import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useAppStore } from '../../store'
import { Upload, Image, X } from 'lucide-react'

export default function ScreenshotUpload() {
  const { screenshotDataUrl, setScreenshot } = useAppStore()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        setScreenshot(reader.result as string)
      }
      reader.readAsDataURL(file)
    },
    [setScreenshot]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  })

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider">
        Upload Screenshot
      </h3>

      {screenshotDataUrl ? (
        <div className="space-y-2">
          <div className="relative rounded-lg overflow-hidden border border-surface-700">
            <img
              src={screenshotDataUrl}
              alt="Screenshot preview"
              className="w-full h-auto max-h-[200px] object-contain bg-surface-800"
            />
            <button
              onClick={() => setScreenshot(null)}
              className="absolute top-2 right-2 p-1 rounded-full bg-surface-900/80 text-surface-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <button
            {...getRootProps()}
            className="w-full py-2 text-xs text-surface-400 hover:text-surface-300 border border-surface-700 rounded-lg hover:border-surface-600 transition-colors"
          >
            <input {...getInputProps()} />
            Replace Screenshot
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary-500 bg-primary-500/5'
              : 'border-surface-600 hover:border-surface-500 hover:bg-surface-800/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload
            size={24}
            className={`mx-auto mb-2 ${isDragActive ? 'text-primary-400' : 'text-surface-500'}`}
          />
          <p className="text-sm text-surface-300">
            {isDragActive ? 'Drop your screenshot here' : 'Drag & drop screenshot'}
          </p>
          <p className="text-xs text-surface-500 mt-1">or click to browse</p>
          <p className="text-[10px] text-surface-600 mt-2">JPG, PNG, WEBP &middot; Max 50MB</p>
        </div>
      )}
    </div>
  )
}
