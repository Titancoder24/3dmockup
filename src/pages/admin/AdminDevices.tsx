import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useAdminStore, useSettingsStore } from '../../store'
import { analyzeWithGemini, generateDeviceCode } from '../../utils/ai'
import { getAllDevices } from '../../devices/registry'
import {
  Upload,
  Zap,
  Code,
  Eye,
  Trash2,
  Loader2,
  CheckCircle,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDevices() {
  const {
    uploadedImages,
    generatedCode,
    isAnalyzing,
    isGenerating,
    addUploadedImage,
    removeUploadedImage,
    setIsAnalyzing,
    setGeneratedCode,
    setIsGenerating,
    setAnalysisResults,
    resetDeviceCreation,
  } = useAdminStore()

  const { geminiApiKey } = useSettingsStore()
  const [analysisText, setAnalysisText] = useState('')
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('library')

  const devices = getAllDevices()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          addUploadedImage(reader.result as string)
        }
        reader.readAsDataURL(file)
      })
    },
    [addUploadedImage]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
  })

  const handleAnalyze = async (model: 'gemini-2.0-flash' | 'gemini-2.0-pro') => {
    if (!geminiApiKey) {
      toast.error('Set your Gemini API key in Settings first')
      return
    }
    if (uploadedImages.length === 0) {
      toast.error('Upload device images first')
      return
    }

    setIsAnalyzing(true)
    try {
      const result = await analyzeWithGemini(geminiApiKey, uploadedImages, model)
      setAnalysisText(result)
      setAnalysisResults({ geminiPro: result })
      toast.success(`Analysis complete (${model})`)
    } catch (error) {
      toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateCode = async () => {
    if (!geminiApiKey) {
      toast.error('Set your Gemini API key in Settings first')
      return
    }
    if (!analysisText) {
      toast.error('Run analysis first')
      return
    }

    setIsGenerating(true)
    try {
      const code = await generateDeviceCode(geminiApiKey, analysisText)
      setGeneratedCode(code)
      toast.success('Code generated successfully!')
    } catch (error) {
      toast.error(`Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Device Manager</h1>
          <p className="text-sm text-surface-400 mt-1">
            Create and manage 3D device components using AI analysis.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'library'
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/30'
                : 'bg-surface-800 text-surface-400 border border-surface-700'
            }`}
          >
            Library ({devices.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'create'
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/30'
                : 'bg-surface-800 text-surface-400 border border-surface-700'
            }`}
          >
            + Create New
          </button>
        </div>
      </div>

      {activeTab === 'library' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {devices.map((device) => (
            <div
              key={device.metadata.id}
              className="bg-surface-900 border border-surface-800 rounded-xl p-4 hover:border-surface-700 transition-colors"
            >
              <div className="w-full aspect-[3/4] bg-surface-800 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-4xl">
                  {device.metadata.category === 'phone' && '📱'}
                  {device.metadata.category === 'tablet' && '📱'}
                  {device.metadata.category === 'laptop' && '💻'}
                  {device.metadata.category === 'watch' && '⌚'}
                </span>
              </div>
              <p className="text-sm font-medium text-surface-200">{device.metadata.name}</p>
              <p className="text-xs text-surface-500">{device.metadata.brand} &middot; {device.metadata.year}</p>
              <div className="flex gap-1 mt-2">
                {device.metadata.colors.map((c) => (
                  <div
                    key={c.hex}
                    className="w-4 h-4 rounded-full border border-surface-700"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {device.metadata.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 bg-surface-800 rounded text-[10px] text-surface-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Upload & Analysis */}
          <div className="space-y-4">
            {/* Upload */}
            <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2">
                <Upload size={14} />
                Step 1: Upload Reference Images
              </h3>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-500/5'
                    : 'border-surface-600 hover:border-surface-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload size={20} className="mx-auto mb-2 text-surface-500" />
                <p className="text-xs text-surface-400">Drag images or click to browse (max 5)</p>
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt={`Ref ${i + 1}`} className="w-full h-20 object-cover rounded-lg" />
                      <button
                        onClick={() => removeUploadedImage(i)}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Analysis */}
            <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2">
                <Zap size={14} />
                Step 2: AI Analysis
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAnalyze('gemini-2.0-pro')}
                  disabled={isAnalyzing || uploadedImages.length === 0}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-yellow-500/10 border border-yellow-500/30
                    rounded-lg text-sm font-medium text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-50 transition-colors"
                >
                  {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  Gemini Pro
                </button>
                <button
                  onClick={() => handleAnalyze('gemini-2.0-flash')}
                  disabled={isAnalyzing || uploadedImages.length === 0}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-500/10 border border-blue-500/30
                    rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 transition-colors"
                >
                  {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  Gemini Flash
                </button>
              </div>

              {analysisText && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs text-green-400 font-medium">Analysis Complete</span>
                  </div>
                  <pre className="p-3 bg-surface-800 rounded-lg text-xs text-surface-300 overflow-auto max-h-[300px] font-mono">
                    {analysisText}
                  </pre>
                </div>
              )}
            </div>

            {/* Generate Code */}
            <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2">
                <Code size={14} />
                Step 3: Generate Component
              </h3>

              <button
                onClick={handleGenerateCode}
                disabled={isGenerating || !analysisText}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600
                  disabled:opacity-50 rounded-lg text-sm font-medium text-white transition-colors"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Code size={14} />}
                Generate Three.js Component
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={resetDeviceCreation}
              className="flex items-center gap-2 text-xs text-surface-500 hover:text-surface-400 transition-colors"
            >
              <Trash2 size={12} />
              Reset & Start Over
            </button>
          </div>

          {/* Right: Code Preview */}
          <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2">
              <Eye size={14} />
              Generated Code Preview
            </h3>

            {generatedCode ? (
              <div className="space-y-3">
                <pre className="p-4 bg-surface-950 rounded-lg text-xs text-surface-300 overflow-auto max-h-[600px] font-mono leading-relaxed">
                  {generatedCode}
                </pre>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode)
                      toast.success('Code copied to clipboard!')
                    }}
                    className="px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-xs text-surface-400 hover:text-surface-300 transition-colors"
                  >
                    Copy Code
                  </button>
                  <button className="px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-400 hover:bg-green-500/20 transition-colors">
                    Save to Library
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-surface-600">
                <div className="text-center">
                  <Code size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Generated code will appear here</p>
                  <p className="text-xs mt-1">Upload images and run analysis first</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
