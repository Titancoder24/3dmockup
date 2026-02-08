import { useState } from 'react'
import { useAppStore } from '../../store'
import { getAllDevices, getDevicesByCategory, searchDevices } from '../../devices/registry'
import type { DeviceCategory } from '../../types'
import { Search, Check } from 'lucide-react'

const categories: Array<{ label: string; value: DeviceCategory | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Phones', value: 'phone' },
  { label: 'Tablets', value: 'tablet' },
  { label: 'Laptops', value: 'laptop' },
  { label: 'Watches', value: 'watch' },
]

export default function DeviceSelector() {
  const { selectedDeviceId, setSelectedDevice, setSelectedDeviceColor } = useAppStore()
  const [activeCategory, setActiveCategory] = useState<DeviceCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const devices = searchQuery
    ? searchDevices(searchQuery)
    : activeCategory === 'all'
      ? getAllDevices()
      : getDevicesByCategory(activeCategory)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider">
        Select Device
      </h3>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Search devices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-surface-800 border border-surface-700 rounded-lg
            text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setActiveCategory(cat.value)
              setSearchQuery('')
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeCategory === cat.value
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'bg-surface-800 text-surface-400 border border-surface-700 hover:border-surface-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
        {devices.map((device) => {
          const isSelected = selectedDeviceId === device.metadata.id
          return (
            <button
              key={device.metadata.id}
              onClick={() => {
                setSelectedDevice(device.metadata.id)
                setSelectedDeviceColor(device.metadata.defaultColor)
              }}
              className={`relative p-3 rounded-lg border transition-all text-left group ${
                isSelected
                  ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/30'
                  : 'border-surface-700 bg-surface-800/50 hover:border-surface-500 hover:bg-surface-800'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}

              {/* Device icon placeholder */}
              <div className="w-full aspect-[3/4] bg-surface-700/50 rounded-md mb-2 flex items-center justify-center">
                <span className="text-2xl">
                  {device.metadata.category === 'phone' && '📱'}
                  {device.metadata.category === 'tablet' && '📱'}
                  {device.metadata.category === 'laptop' && '💻'}
                  {device.metadata.category === 'watch' && '⌚'}
                </span>
              </div>

              <p className="text-xs font-medium text-surface-200 truncate">
                {device.metadata.name}
              </p>
              <p className="text-[10px] text-surface-500">{device.metadata.brand} &middot; {device.metadata.year}</p>

              {/* Color dots */}
              <div className="flex gap-1 mt-1.5">
                {device.metadata.colors.slice(0, 4).map((c) => (
                  <div
                    key={c.hex}
                    className="w-3 h-3 rounded-full border border-surface-600"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {devices.length === 0 && (
        <p className="text-sm text-surface-500 text-center py-4">No devices found</p>
      )}
    </div>
  )
}
