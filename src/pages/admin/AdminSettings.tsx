import { useState } from 'react'
import { useSettingsStore } from '../../store'
import { motion } from 'framer-motion'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Switch } from '../../components/ui/switch'
import { Separator } from '../../components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '../../components/ui/toggle-group'

import {
  KeyRound,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  Zap,
  Globe,
  HardDrive,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const {
    geminiApiKey, openrouterApiKey, autoSave, autoSaveInterval,
    setGeminiApiKey, setOpenrouterApiKey, setAutoSave, setAutoSaveInterval,
  } = useSettingsStore()

  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [showOpenrouterKey, setShowOpenrouterKey] = useState(false)
  const [localGeminiKey, setLocalGeminiKey] = useState(geminiApiKey)
  const [localOpenrouterKey, setLocalOpenrouterKey] = useState(openrouterApiKey)

  const handleSave = () => {
    setGeminiApiKey(localGeminiKey)
    setOpenrouterApiKey(localOpenrouterKey)
    toast.success('Settings saved')
  }

  const testGeminiKey = async () => {
    if (!localGeminiKey) return toast.error('Enter a Gemini API key first')
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${localGeminiKey}`)
      if (res.ok) toast.success('Gemini API key is valid')
      else toast.error('Invalid API key')
    } catch {
      toast.error('Connection failed')
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure API keys and preferences</p>
      </motion.div>

      {/* API Keys */}
      <Card className="gap-0 py-0">
        <CardHeader className="py-4 border-b">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            API Keys
          </CardTitle>
          <CardDescription className="text-xs">Connect your AI services</CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-6">
          {/* Gemini */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium flex items-center gap-2">
                <Zap className="size-3.5 text-amber-500" />
                Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Get key <ExternalLink className="size-3" />
              </a>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={localGeminiKey}
                  onChange={(e) => setLocalGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  className="pr-10 font-mono text-sm"
                />
                <button
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showGeminiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Button variant="outline" onClick={testGeminiKey}>Test</Button>
            </div>
          </div>

          <Separator />

          {/* OpenRouter */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium flex items-center gap-2">
                <Globe className="size-3.5 text-emerald-500" />
                OpenRouter API Key
              </label>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Get key <ExternalLink className="size-3" />
              </a>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type={showOpenrouterKey ? 'text' : 'password'}
                  value={localOpenrouterKey}
                  onChange={(e) => setLocalOpenrouterKey(e.target.value)}
                  placeholder="sk-or-..."
                  className="pr-10 font-mono text-sm"
                />
                <button
                  onClick={() => setShowOpenrouterKey(!showOpenrouterKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showOpenrouterKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Button variant="outline">Test</Button>
            </div>
          </div>

          <Separator />

          {/* Security notice */}
          <div className="flex items-start gap-3 p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-lg">
            <ShieldCheck className="size-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-400">Stored locally</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Keys are stored in your browser's localStorage. They are never sent to any server other than the API endpoints.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-save */}
      <Card className="gap-0 py-0">
        <CardHeader className="py-4 border-b">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <HardDrive className="size-4 text-accent-500" />
            Auto-Save
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-save project</p>
              <p className="text-xs text-muted-foreground mt-0.5">Periodically save your project state</p>
            </div>
            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
          </div>

          {autoSave && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Separator className="my-3" />
              <p className="text-xs font-medium text-muted-foreground mb-2.5">Save interval</p>
              <ToggleGroup
                type="single"
                value={String(autoSaveInterval)}
                onValueChange={(val) => val && setAutoSaveInterval(Number(val))}
                variant="outline"
              >
                <ToggleGroupItem value="15000" className="text-xs">15s</ToggleGroupItem>
                <ToggleGroupItem value="30000" className="text-xs">30s</ToggleGroupItem>
                <ToggleGroupItem value="60000" className="text-xs">1m</ToggleGroupItem>
                <ToggleGroupItem value="300000" className="text-xs">5m</ToggleGroupItem>
              </ToggleGroup>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <Button size="lg" onClick={handleSave}>
        <Save className="size-4" />
        Save Settings
      </Button>
    </div>
  )
}
