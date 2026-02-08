import { useState } from 'react'
import { useAppStore } from '../../store'
import { getAllTemplates, getTemplatesByCategory } from '../../templates/registry'
import type { TemplateCategory } from '../../types'
import { Play, Clock, Check } from 'lucide-react'

const categories: Array<{ label: string; value: TemplateCategory | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Floating', value: 'floating' },
  { label: 'Desk', value: 'desk' },
  { label: 'Cinematic', value: 'cinematic' },
  { label: 'Hand', value: 'hand' },
]

const categoryColors: Record<string, string> = {
  floating: 'bg-purple-500/20 text-purple-400',
  desk: 'bg-amber-500/20 text-amber-400',
  cinematic: 'bg-red-500/20 text-red-400',
  hand: 'bg-green-500/20 text-green-400',
  multi: 'bg-blue-500/20 text-blue-400',
}

export default function TemplateGallery() {
  const { selectedTemplateId, setSelectedTemplate, setIsPlaying } = useAppStore()
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all')

  const templates = activeCategory === 'all'
    ? getAllTemplates()
    : getTemplatesByCategory(activeCategory)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider">
        Animation Templates
      </h3>

      {/* Category Tabs */}
      <div className="flex gap-1 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
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

      {/* Template List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {templates.map((template) => {
          const isSelected = selectedTemplateId === template.id
          return (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template.id)
                setIsPlaying(true)
              }}
              className={`w-full p-3 rounded-lg border transition-all text-left group ${
                isSelected
                  ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/30'
                  : 'border-surface-700 bg-surface-800/50 hover:border-surface-500 hover:bg-surface-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-surface-200 truncate">
                      {template.name}
                    </p>
                    {isSelected && <Check size={14} className="text-primary-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">
                    {template.description}
                  </p>
                </div>
                <div className="ml-2 shrink-0">
                  <Play size={16} className="text-surface-500 group-hover:text-primary-400 transition-colors" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${categoryColors[template.category] || 'bg-surface-700 text-surface-400'}`}>
                  {template.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-surface-500">
                  <Clock size={10} />
                  {template.duration}s
                </span>
                <span className="text-[10px] text-surface-500">
                  {template.fps}fps
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {templates.length === 0 && (
        <p className="text-sm text-surface-500 text-center py-4">No templates in this category</p>
      )}
    </div>
  )
}
