import { useState } from 'react'
import { useAppStore } from '../../store'
import { getDeviceById } from '../../devices/registry'
import { Palette, RotateCw, Type, ChevronDown, ChevronUp } from 'lucide-react'

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

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider">
        Customize
      </h3>

      {/* Background */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-surface-300">
          <Palette size={12} />
          Background
        </label>
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <input
                type="color"
                value={typeof background === 'string' ? background : background.colors[0] || '#667eea'}
                onChange={(e) => {
                  if (typeof background === 'string') {
                    setBackground(e.target.value)
                  } else {
                    setBackground({
                      ...background,
                      colors: [e.target.value, ...(background.colors.slice(1))],
                    })
                  }
                }}
                className="w-8 h-8 rounded border border-surface-600 cursor-pointer bg-transparent"
              />
              {typeof background !== 'string' && (
                <input
                  type="color"
                  value={background.colors[1] || '#764ba2'}
                  onChange={(e) => {
                    setBackground({
                      ...background,
                      colors: [background.colors[0], e.target.value],
                    })
                  }}
                  className="w-8 h-8 rounded border border-surface-600 cursor-pointer bg-transparent"
                />
              )}
            </div>

            {/* Gradient toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={typeof background !== 'string'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setBackground({
                      type: 'gradient',
                      colors: [typeof background === 'string' ? background : '#667eea', '#764ba2'],
                      angle: 135,
                    })
                  } else {
                    setBackground(typeof background === 'string' ? background : background.colors[0])
                  }
                }}
                className="w-3.5 h-3.5 rounded border-surface-600 bg-surface-800 text-primary-500"
              />
              <span className="text-xs text-surface-400">Gradient</span>
            </label>
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-3 gap-1">
            {[
              '#000000',
              '#ffffff',
              '#1a1a2e',
              '#667eea',
              '#ff6b6b',
              '#48c6ef',
            ].map((c) => (
              <button
                key={c}
                onClick={() => setBackground(c)}
                className="w-6 h-6 rounded border border-surface-600 hover:border-surface-400 transition-colors"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Device Color */}
      {device && (
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-medium text-surface-300">
            <Palette size={12} />
            Device Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {device.metadata.colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => setSelectedDeviceColor(c.hex)}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  selectedDeviceColor === c.hex
                    ? 'border-primary-500 scale-110'
                    : 'border-surface-600 hover:border-surface-400'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rotation */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-surface-300">
          <RotateCw size={12} />
          Rotation Offset
        </label>
        {['X', 'Y', 'Z'].map((axis, i) => (
          <div key={axis} className="flex items-center gap-2">
            <span className="text-[10px] text-surface-500 w-4">{axis}</span>
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              value={customRotation[i]}
              onChange={(e) => {
                const newRot = [...customRotation] as [number, number, number]
                newRot[i] = parseFloat(e.target.value)
                setCustomRotation(newRot)
              }}
              className="flex-1 h-1 bg-surface-700 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-[10px] text-surface-500 w-8 text-right">
              {Math.round((customRotation[i] * 180) / Math.PI)}°
            </span>
          </div>
        ))}
      </div>

      {/* Advanced Settings */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1 text-xs text-surface-400 hover:text-surface-300 transition-colors"
      >
        {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        Advanced Settings
      </button>

      {showAdvanced && (
        <div className="space-y-3 pl-2 border-l border-surface-700">
          <p className="text-xs text-surface-500">
            Text overlays, keyframe editing, and advanced lighting controls coming soon.
          </p>
        </div>
      )}
    </div>
  )
}
