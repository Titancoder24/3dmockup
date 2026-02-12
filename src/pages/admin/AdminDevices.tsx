import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useAdminStore, useSettingsStore } from '../../store'
import { analyzeWithGemini, generateDeviceCode } from '../../utils/ai'
import { getAllDevices } from '../../devices/registry'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { ScrollArea } from '../../components/ui/scroll-area'

import {
  CloudUpload,
  Zap,
  Code2,
  Trash2,
  Loader2,
  Copy,
  Plus,
  Library,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDevices() {
  const {
    uploadedImages, generatedCode, isAnalyzing, isGenerating,
    addUploadedImage, removeUploadedImage, setIsAnalyzing,
    setGeneratedCode, setIsGenerating, setAnalysisResults, resetDeviceCreation,
  } = useAdminStore()

  const { geminiApiKey } = useSettingsStore()
  const [analysisText, setAnalysisText] = useState('')
  const devices = getAllDevices()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => addUploadedImage(reader.result as string)
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
    if (!geminiApiKey) return toast.error('Set your Gemini API key in Settings first')
    if (uploadedImages.length === 0) return toast.error('Upload device images first')
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
    if (!geminiApiKey) return toast.error('Set your Gemini API key in Settings first')
    if (!analysisText) return toast.error('Run analysis first')
    setIsGenerating(true)
    try {
      const code = await generateDeviceCode(geminiApiKey, analysisText)
      setGeneratedCode(code)
      toast.success('Code generated!')
    } catch (error) {
      toast.error(`Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const deviceIcon = (cat: string) => {
    const cls = "size-5 text-muted-foreground"
    if (cat === 'phone') return <Smartphone className={cls} />
    if (cat === 'tablet') return <Tablet className={cls} />
    if (cat === 'laptop') return <Laptop className={cls} />
    if (cat === 'watch') return <Watch className={cls} />
    return <Smartphone className={cls} />
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">Devices</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage hardware models and create new ones with AI</p>
      </div>

      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library" className="gap-1.5">
            <Library className="size-3.5" />
            Library ({devices.length})
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-1.5">
            <Plus className="size-3.5" />
            Create New
          </TabsTrigger>
        </TabsList>

        {/* Library */}
        <TabsContent value="library">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
            {devices.map((device) => (
              <Card key={device.metadata.id} className="py-0 gap-0 group hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="w-full aspect-square rounded-lg bg-secondary/50 flex items-center justify-center mb-3 group-hover:bg-secondary transition-colors">
                    {deviceIcon(device.metadata.category)}
                  </div>
                  <p className="text-xs font-semibold truncate">{device.metadata.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{device.metadata.brand}</p>
                  <div className="flex gap-1 mt-2.5">
                    {device.metadata.colors.map((c) => (
                      <div key={c.hex} className="size-2.5 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Create */}
        <TabsContent value="create">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Left */}
            <div className="space-y-6">
              {/* Upload */}
              <Card className="gap-0 py-0">
                <CardHeader className="py-4 border-b">
                  <CardTitle className="text-sm font-heading flex items-center gap-2">
                    <CloudUpload className="size-4 text-primary" />
                    Upload References
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                      }`}
                  >
                    <input {...getInputProps()} />
                    <CloudUpload className="size-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium">Drop images here</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP · Max 5 files</p>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border">
                          <img src={img} alt={`Ref ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeUploadedImage(i)}
                            className="absolute inset-0 bg-background/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analysis */}
              <Card className="gap-0 py-0">
                <CardHeader className="py-4 border-b">
                  <CardTitle className="text-sm font-heading flex items-center gap-2">
                    <Sparkles className="size-4 text-amber-500" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleAnalyze('gemini-2.0-pro')}
                      disabled={isAnalyzing || uploadedImages.length === 0}
                    >
                      {isAnalyzing ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4 text-amber-500" />}
                      Gemini Pro
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAnalyze('gemini-2.0-flash')}
                      disabled={isAnalyzing || uploadedImages.length === 0}
                    >
                      {isAnalyzing ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4 text-blue-500" />}
                      Gemini Flash
                    </Button>
                  </div>

                  {analysisText && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      <Badge variant="secondary" className="mb-2 gap-1">
                        <CheckCircle2 className="size-3 text-emerald-500" />
                        Analysis Complete
                      </Badge>
                      <ScrollArea className="h-48">
                        <pre className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap p-3 bg-secondary rounded-lg">
                          {analysisText}
                        </pre>
                      </ScrollArea>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Button variant="ghost" size="sm" onClick={resetDeviceCreation}>
                <Trash2 className="size-3.5" />
                Reset
              </Button>
            </div>

            {/* Right - Code */}
            <Card className="gap-0 py-0 flex flex-col">
              <CardHeader className="py-4 border-b">
                <CardTitle className="text-sm font-heading flex items-center gap-2">
                  <Code2 className="size-4 text-accent-500" />
                  Generated Code
                </CardTitle>
                {generatedCode && (
                  <div className="col-start-2 row-span-2 row-start-1 self-center">
                    <Badge variant="secondary" className="text-[10px]">Ready</Badge>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-4 flex-1 flex flex-col gap-4">
                <Button onClick={handleGenerateCode} disabled={isGenerating || !analysisText}>
                  {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Code2 className="size-4" />}
                  Generate Three.js Component
                </Button>

                <div className="flex-1 min-h-[400px] rounded-lg bg-secondary p-4 overflow-auto">
                  {generatedCode ? (
                    <pre className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">{generatedCode}</pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 opacity-40">
                      <Code2 className="size-10 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground text-center max-w-[180px]">
                        Run AI analysis first, then generate the component code
                      </p>
                    </div>
                  )}
                </div>

                {generatedCode && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => { navigator.clipboard.writeText(generatedCode); toast.success('Copied!') }}
                    >
                      <Copy className="size-3.5" />
                      Copy Code
                    </Button>
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle2 className="size-3.5" />
                      Add to Library
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
