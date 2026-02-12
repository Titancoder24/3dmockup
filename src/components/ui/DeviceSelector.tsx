import { useState, useMemo } from 'react'
import { useAppStore } from '../../store'
import { getAllDevices } from '../../devices/registry'
import type { DeviceCategory } from '../../types'
import { motion, AnimatePresence } from 'framer-motion'

import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

import {
  Search,
  Smartphone,
  Tablet,
  Monitor,
  Watch,
  Cpu,
  Check,
  X,
} from 'lucide-react'

const cats: { label: string; value: DeviceCategory | 'all'; icon: any }[] = [
  { label: 'All', value: 'all', icon: Cpu },
  { label: 'Phone', value: 'phone', icon: Smartphone },
  { label: 'Tablet', value: 'tablet', icon: Tablet },
  { label: 'Laptop', value: 'laptop', icon: Monitor },
  { label: 'Watch', value: 'watch', icon: Watch },
]

export default function DeviceSelector() {
  const { selectedDeviceId, setSelectedDevice, setSelectedDeviceColor } = useAppStore()
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState<DeviceCategory | 'all'>('all')

  const devices = useMemo(() => {
    let list = getAllDevices()
    if (cat !== 'all') list = list.filter((d) => d.metadata.category === cat)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((d) => d.metadata.name.toLowerCase().includes(q) || d.metadata.brand.toLowerCase().includes(q))
    }
    return list
  }, [cat, search])

  return (
    <div className="space-y-4">
      {/* Search + Filters in a single row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-xs bg-white/[0.04] border-white/[0.06]"
          />
        </div>
        <div className="flex gap-0.5 bg-secondary/50 rounded-lg p-0.5">
          {cats.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`p-1.5 rounded-md transition-all ${cat === c.value ? 'bg-brand-500 text-white' : 'text-zinc-500 hover:text-white'}`}
              title={c.label}
            >
              <c.icon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal scrolling cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        <AnimatePresence mode="popLayout">
          {devices.map((device, i) => {
            const sel = selectedDeviceId === device.metadata.id
            return (
              <motion.button
                key={device.metadata.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => {
                  setSelectedDevice(device.metadata.id)
                  setSelectedDeviceColor(device.metadata.defaultColor)
                }}
                className={`
                  relative flex-shrink-0 w-[140px] snap-start text-left p-4 rounded-2xl transition-all duration-200
                  ${sel
                    ? 'bg-brand-500/10 border-2 border-brand-500 shadow-lg shadow-brand-500/10'
                    : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
                  }
                `}
              >
                {sel && (
                  <div className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-brand-500 flex items-center justify-center shadow-md ring-2 ring-background">
                    <Check className="size-3 text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Device Icon */}
                <div className={`size-12 rounded-xl flex items-center justify-center mb-3 ${sel ? 'bg-brand-500/20' : 'bg-white/[0.04]'
                  }`}>
                  {device.metadata.category === 'phone' && <Smartphone className={`size-6 ${sel ? 'text-brand-400' : 'text-zinc-500'}`} />}
                  {device.metadata.category === 'tablet' && <Tablet className={`size-6 ${sel ? 'text-brand-400' : 'text-zinc-500'}`} />}
                  {device.metadata.category === 'laptop' && <Monitor className={`size-6 ${sel ? 'text-brand-400' : 'text-zinc-500'}`} />}
                  {device.metadata.category === 'watch' && <Watch className={`size-6 ${sel ? 'text-brand-400' : 'text-zinc-500'}`} />}
                </div>

                <p className="text-xs font-bold truncate">{device.metadata.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{device.metadata.brand}</p>

                {/* Colors */}
                <div className="flex gap-1.5 mt-3">
                  {device.metadata.colors.slice(0, 4).map((c) => (
                    <div key={c.hex} className="size-3 rounded-full ring-1 ring-white/10" style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Result count */}
      <p className="text-[10px] text-zinc-600 text-center">
        {devices.length} device{devices.length !== 1 ? 's' : ''} available
      </p>
    </div>
  )
}
