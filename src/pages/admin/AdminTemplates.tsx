import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminStore, useSettingsStore } from '../../store'
import { generateTemplateCode } from '../../utils/ai'
import { getAllTemplates } from '../../templates/registry'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Separator } from '../../components/ui/separator'

import {
  Clapperboard,
  Zap,
  Code2,
  Loader2,
  Copy,
  Plus,
  Library,
  Clock,
  CirclePlay,
  Sparkles,
  CheckCircle2,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminTemplates() {
  const { templateCode, isGeneratingTemplate, setTemplateCode, setIsGeneratingTemplate } = useAdminStore()
  const { geminiApiKey } = useSettingsStore()
  const [description, setDescription] = useState('')
  const templates = getAllTemplates()

  const handleGenerate = async () => {
    if (!geminiApiKey) return toast.error('Set your Gemini API key in Settings first')
    if (!description.trim()) return toast.error('Describe your animation first')
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

  const categoryColors: Record<string, string> = {
    floating: 'text-purple-400',
    desk: 'text-amber-400',
    cinematic: 'text-sky-400',
    hand: 'text-emerald-400',
    multi: 'text-blue-400',
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse and create animation templates</p>
      </div>

      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library" className="gap-1.5">
            <Library className="size-3.5" />
            Gallery ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-1.5">
            <Plus className="size-3.5" />
            Create New
          </TabsTrigger>
        </TabsList>

        {/* Library */}
        <TabsContent value="library">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {templates.map((template) => (
              <Card key={template.id} className="py-0 gap-0 group hover:border-accent-500/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent-500/10 transition-colors">
                      <CirclePlay className={`size-4 ${categoryColors[template.category] || 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{template.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{template.description}</p>
                      <div className="flex items-center gap-2 mt-2.5">
                        <Badge variant="secondary" className="text-[10px] py-0 capitalize">{template.category}</Badge>
                        <Badge variant="secondary" className="text-[9px] py-0 font-mono gap-1">
                          <Clock className="size-2.5" />
                          {template.duration}s · {template.fps}fps
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {template.tags && template.tags.length > 0 && (
                    <>
                      <Separator className="my-3" />
                      <div className="flex gap-1.5 flex-wrap">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[9px] font-mono py-0 uppercase">{tag}</Badge>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Create */}
        <TabsContent value="create">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Description */}
            <div className="space-y-6">
              <Card className="gap-0 py-0">
                <CardHeader className="py-4 border-b">
                  <CardTitle className="text-sm font-heading flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    Describe Animation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={"Describe your animation sequence...\n\ne.g. A smooth 360° rotation with a gentle float, the device enters from below and settles into center frame."}
                    className="w-full h-48 px-4 py-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 resize-none transition-colors leading-relaxed"
                  />
                  <Button onClick={handleGenerate} disabled={isGeneratingTemplate || !description.trim()} className="w-full">
                    {isGeneratingTemplate ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
                    Generate Template Code
                  </Button>
                </CardContent>
              </Card>

              <Button variant="ghost" size="sm">
                <Trash2 className="size-3.5" />
                Clear
              </Button>
            </div>

            {/* Code */}
            <Card className="gap-0 py-0 flex flex-col">
              <CardHeader className="py-4 border-b">
                <CardTitle className="text-sm font-heading flex items-center gap-2">
                  <Code2 className="size-4 text-accent-500" />
                  Template Code
                </CardTitle>
                {templateCode && (
                  <div className="col-start-2 row-span-2 row-start-1 self-center">
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <CheckCircle2 className="size-3 text-emerald-500" />
                      Generated
                    </Badge>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-4 flex-1 flex flex-col gap-4">
                <div className="flex-1 min-h-[400px] rounded-lg bg-secondary p-4 overflow-auto">
                  {templateCode ? (
                    <pre className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">{templateCode}</pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 opacity-40">
                      <Clapperboard className="size-10 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground text-center max-w-[180px]">
                        Describe an animation and generate template code
                      </p>
                    </div>
                  )}
                </div>

                {templateCode && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => { navigator.clipboard.writeText(templateCode); toast.success('Copied!') }}
                    >
                      <Copy className="size-3.5" />
                      Copy
                    </Button>
                    <Button className="flex-1">
                      <Plus className="size-3.5" />
                      Register
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
