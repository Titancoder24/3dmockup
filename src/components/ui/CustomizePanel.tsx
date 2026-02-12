import { useState } from 'react'
import { useAppStore } from '../../store'
import { getDeviceById } from '../../devices/registry'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '../../components/ui/button'
import { Slider } from '../../components/ui/slider'
import { Switch } from '../../components/ui/switch'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'

import {
  Palette,
  RotateCw,
  Pipette,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
} from 'lucide-react'

export default function CustomizePanel() {
  const {
    selectedDeviceId,
    selectedDeviceColor,
    background,
    customRotation,
    setSelectedDeviceColor,
    setBackground,
    setCustomRotation,
  } = useAppStore()
  const [showAdvanced, setShowAdvanced] = useState(false)

  const device = selectedDeviceId ? getDeviceById(selectedDeviceId) : null
  const isGradient = typeof background !== 'string'

  return (
    <div className="space-y-5">
      {/* Background Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Pipette className="size-3.5 text-primary" />
          <h3 className="font-heading text-sm font-semibold">Background</h3>
        </div>

        <Card className="py-0 gap-0">
          <CardContent className="p-4 space-y-4">
            {/* Color picker row */}
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={typeof background === 'string' ? background : background.colors[0] || '#f97316'}
                onChange={(e) => {
                  if (typeof background === 'string') {
                    setBackground(e.target.value)
                  } else {
                    setBackground({ ...background, colors: [e.target.value, ...background.colors.slice(1)] })
                  }
                }}
                className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-md"
              />
              {isGradient && (
                <input
                  type="color"
                  value={background.colors[1] || '#8b5cf6'}
                  onChange={(e) => {
                    setBackground({ ...background, colors: [background.colors[0], e.target.value] })
                  }}
                  className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent appearance-none [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-md"
                />
              )}

              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Gradient</span>
                <Switch
                  checked={isGradient}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const solidColor = typeof background === 'string' ? background : background.colors[0]
                      setBackground({ type: 'gradient', colors: [solidColor, '#8b5cf6'], angle: 135 })
                    } else {
                      const color = typeof background === 'string' ? background : background.colors[0]
                      setBackground(color)
                    }
                  }}
                />
              </div>
            </div>

            <Separator />

            {/* Presets */}
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Presets</p>
              <div className="grid grid-cols-6 gap-2">
                {['#000000', '#ffffff', '#0c0a09', '#f97316', '#8b5cf6', '#10b981'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBackground(c)}
                    className={`
                      aspect-square rounded-lg border-2 transition-all
                      ${background === c ? 'border-primary scale-110' : 'border-border hover:scale-105'}
                    `}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Color */}
      {device && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="size-3.5 text-accent-500" />
            <h3 className="font-heading text-sm font-semibold">Device Color</h3>
          </div>

          <Card className="py-0 gap-0">
            <CardContent className="p-4">
              <div className="flex gap-2.5 flex-wrap">
                {device.metadata.colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedDeviceColor(c.hex)}
                    title={c.name}
                    className={`
                      w-9 h-9 rounded-lg border-2 transition-all relative
                      ${selectedDeviceColor === c.hex
                        ? 'border-primary scale-110 shadow-md'
                        : 'border-border hover:border-muted-foreground hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedDeviceColor === c.hex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="size-3.5 text-white drop-shadow-lg" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rotation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <RotateCw className="size-3.5 text-accent-500" />
          <h3 className="font-heading text-sm font-semibold">Rotation</h3>
        </div>

        <Card className="py-0 gap-0">
          <CardContent className="p-4 space-y-4">
            {['X', 'Y', 'Z'].map((axis, i) => (
              <div key={axis} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">{axis}-Axis</span>
                  <Badge variant="secondary" className="text-[10px] font-mono py-0">
                    {Math.round((customRotation[i] * 180) / Math.PI)}°
                  </Badge>
                </div>
                <Slider
                  min={-Math.PI * 100}
                  max={Math.PI * 100}
                  step={1}
                  value={[customRotation[i] * 100]}
                  onValueChange={(val) => {
                    const newRot = [...customRotation] as [number, number, number]
                    newRot[i] = val[0] / 100
                    setCustomRotation(newRot)
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Advanced */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between text-muted-foreground"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="size-3.5" />
          Advanced
        </span>
        {showAdvanced ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
      </Button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="py-0 gap-0">
              <CardContent className="p-4 flex items-center gap-3">
                <Sparkles className="size-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground italic">
                  Text overlays, compositing layers, and ray-trace controls are coming soon.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
