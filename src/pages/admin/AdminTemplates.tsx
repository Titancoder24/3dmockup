import { useState } from 'react'
import { useAdminStore, useSettingsStore } from '../../store'
import { generateTemplateCode } from '../../utils/ai'
import { getAllTemplates } from '../../templates/registry'
import { Film, Zap, Code, Play, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminTemplates() {
  const { templateCode, isGeneratingTemplate, setTemplateCode, setIsGeneratingTemplate } = useAdminStore()
  const { geminiApiKey } = useSettingsStore()
  const [description, setDescription] = useState('')
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('library')

  const templates = getAllTemplates()

  const handleGenerate = async () => {
    if (!geminiApiKey) {
      toast.error('Set your Gemini API key in Settings first')
      return
    }
    if (!description.trim()) {
      toast.error('Describe your animation first')
      return
    }

    setIsGeneratingTemplate(true)
    try {
      const code = await generateTemplateCode(geminiApiKey, description)
      setTemplateCode(code)
      toast.success('Template code generated!')
    } catch (error) {
      toast.error(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGeneratingTemplate(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Motion Templates</h1>
          <p className="text-sm text-surface-400 mt-1">
            Create and manage animation templates for device mockups.
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
            Library ({templates.length})
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-surface-900 border border-surface-800 rounded-xl p-5 hover:border-surface-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-surface-200">{template.name}</p>
                  <p className="text-xs text-surface-500 mt-1">{template.description}</p>
                </div>
                <Play size={16} className="text-surface-500 shrink-0" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-800 text-surface-400 border border-surface-700">
                  {template.category}
                </span>
                <span className="text-[10px] text-surface-500">{template.duration}s @ {template.fps}fps</span>
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {template.tags.map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 bg-surface-800 rounded text-[10px] text-surface-600">
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
          {/* Left: Description & Generate */}
          <div className="space-y-4">
            <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2">
                <Film size={14} />
                Describe Your Animation
              </h3>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the animation in detail...&#10;&#10;Example: Create a floating rotation animation. The device should rotate 360 degrees around its Y axis over 4 seconds at 30fps. Add a gentle float motion with soft lighting..."
                className="w-full h-48 px-3 py-2.5 bg-surface-800 border border-surface-700 rounded-lg
                  text-sm text-surface-200 placeholder-surface-600 focus:outline-none focus:border-primary-500 resize-none"
              />

              <button
                onClick={handleGenerate}
                disabled={isGeneratingTemplate || !description.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600
                  disabled:opacity-50 rounded-lg text-sm font-medium text-white transition-colors"
              >
                {isGeneratingTemplate ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Zap size={14} />
                )}
                Generate Template Code
              </button>
            </div>
          </div>

          {/* Right: Code Preview */}
          <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2">
              <Code size={14} />
              Generated Template Code
            </h3>

            {templateCode ? (
              <div className="space-y-3">
                <pre className="p-4 bg-surface-950 rounded-lg text-xs text-surface-300 overflow-auto max-h-[500px] font-mono leading-relaxed">
                  {templateCode}
                </pre>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(templateCode)
                      toast.success('Code copied!')
                    }}
                    className="px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-xs text-surface-400 hover:text-surface-300 transition-colors"
                  >
                    Copy Code
                  </button>
                  <button className="px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-400 hover:bg-green-500/20 transition-colors">
                    Save Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-surface-600">
                <div className="text-center">
                  <Code size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Template code will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
