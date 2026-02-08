import { useState } from 'react'
import { useSettingsStore } from '../../store'
import { Key, Eye, EyeOff, Save, Shield, Zap, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const {
    geminiApiKey,
    openrouterApiKey,
    autoSave,
    autoSaveInterval,
    setGeminiApiKey,
    setOpenrouterApiKey,
    setAutoSave,
    setAutoSaveInterval,
  } = useSettingsStore()

  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [showOpenrouterKey, setShowOpenrouterKey] = useState(false)
  const [localGeminiKey, setLocalGeminiKey] = useState(geminiApiKey)
  const [localOpenrouterKey, setLocalOpenrouterKey] = useState(openrouterApiKey)

  const handleSave = () => {
    setGeminiApiKey(localGeminiKey)
    setOpenrouterApiKey(localOpenrouterKey)
    toast.success('Settings saved successfully!')
  }

  const testGeminiKey = async () => {
    if (!localGeminiKey) {
      toast.error('Enter a Gemini API key first')
      return
    }
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${localGeminiKey}`
      )
      if (response.ok) {
        toast.success('Gemini API key is valid!')
      } else {
        toast.error('Invalid Gemini API key')
      }
    } catch {
      toast.error('Failed to connect to Gemini API')
    }
  }

  const testOpenrouterKey = async () => {
    if (!localOpenrouterKey) {
      toast.error('Enter an OpenRouter API key first')
      return
    }
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${localOpenrouterKey}` },
      })
      if (response.ok) {
        toast.success('OpenRouter API key is valid!')
      } else {
        toast.error('Invalid OpenRouter API key')
      }
    } catch {
      toast.error('Failed to connect to OpenRouter API')
    }
  }

  return (
    <div className="p-6 max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-surface-400 mt-1">
          Configure API keys and application preferences. All settings are stored locally in your browser.
        </p>
      </div>

      {/* API Keys Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Key size={18} className="text-primary-400" />
          <h2 className="text-lg font-semibold text-white">API Keys</h2>
        </div>

        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 space-y-5">
          {/* Gemini API Key */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-surface-200">
              <Zap size={14} className="text-yellow-400" />
              Google Gemini API Key
            </label>
            <p className="text-xs text-surface-500">
              Used for device image analysis and code generation. Get your key at{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={localGeminiKey}
                  onChange={(e) => setLocalGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2.5 bg-surface-800 border border-surface-700 rounded-lg
                    text-sm text-surface-200 placeholder-surface-600 focus:outline-none focus:border-primary-500
                    pr-10 font-mono"
                />
                <button
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
                >
                  {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                onClick={testGeminiKey}
                className="px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-xs text-surface-400
                  hover:border-surface-600 hover:text-surface-300 transition-colors"
              >
                Test
              </button>
            </div>
          </div>

          {/* OpenRouter API Key */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-surface-200">
              <Shield size={14} className="text-green-400" />
              OpenRouter API Key
            </label>
            <p className="text-xs text-surface-500">
              Used for cross-validation with Claude and other models. Get your key at{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:underline"
              >
                OpenRouter
              </a>
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={showOpenrouterKey ? 'text' : 'password'}
                  value={localOpenrouterKey}
                  onChange={(e) => setLocalOpenrouterKey(e.target.value)}
                  placeholder="sk-or-..."
                  className="w-full px-3 py-2.5 bg-surface-800 border border-surface-700 rounded-lg
                    text-sm text-surface-200 placeholder-surface-600 focus:outline-none focus:border-primary-500
                    pr-10 font-mono"
                />
                <button
                  onClick={() => setShowOpenrouterKey(!showOpenrouterKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
                >
                  {showOpenrouterKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                onClick={testOpenrouterKey}
                className="px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-xs text-surface-400
                  hover:border-surface-600 hover:text-surface-300 transition-colors"
              >
                Test
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <Shield size={14} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-300/80">
              API keys are stored in your browser's localStorage and never sent to any server other than
              the respective API providers (Google, OpenRouter). Clear browser data to remove them.
            </p>
          </div>
        </div>
      </section>

      {/* Auto-Save Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <RefreshCw size={18} className="text-primary-400" />
          <h2 className="text-lg font-semibold text-white">Auto-Save</h2>
        </div>

        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-surface-200">Enable Auto-Save</p>
              <p className="text-xs text-surface-500">Automatically save project state periodically</p>
            </div>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="w-5 h-5 rounded bg-surface-800 border-surface-600 text-primary-500 focus:ring-primary-500/30"
            />
          </label>

          {autoSave && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-300">
                Save Interval
              </label>
              <select
                value={autoSaveInterval}
                onChange={(e) => setAutoSaveInterval(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-surface-200"
              >
                <option value={15000}>Every 15 seconds</option>
                <option value={30000}>Every 30 seconds</option>
                <option value={60000}>Every 1 minute</option>
                <option value={300000}>Every 5 minutes</option>
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
      >
        <Save size={16} />
        Save Settings
      </button>
    </div>
  )
}
