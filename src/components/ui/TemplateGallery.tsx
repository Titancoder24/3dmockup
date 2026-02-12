import { useState, useMemo } from 'react'
import { useAppStore } from '../../store'
import { getAllTemplates } from '../../templates/registry'
import { motion, AnimatePresence } from 'framer-motion'

import { Badge } from '../../components/ui/badge'

import {
  Orbit,
  Waves,
  Clapperboard,
  LayoutGrid,
  Clock,
  CirclePlay,
  Check,
} from 'lucide-react'

const categories = [
  { label: 'All', value: 'all', icon: LayoutGrid },
  { label: 'Float', value: 'floating', icon: Waves },
  { label: 'Cinema', value: 'cinematic', icon: Clapperboard },
  { label: 'Orbit', value: 'orbit', icon: Orbit },
]

export default function TemplateGallery() {
  const { selectedTemplateId, setSelectedTemplate, setIsPlaying } = useAppStore()
  const [activeCategory, setActiveCategory] = useState('all')

  const templates = useMemo(() => {
    const all = getAllTemplates()
    if (activeCategory === 'all') return all
    return all.filter((t) => t.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-sm font-semibold mb-1">Motion Templates</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Choose an animation to bring your mockup to life.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors
              ${activeCategory === cat.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }
            `}
          >
            <cat.icon className="size-3" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {templates.map((template, idx) => {
            const isSelected = selectedTemplateId === template.id
            return (
              <motion.button
                layout
                key={template.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => {
                  setSelectedTemplate(template.id)
                  setIsPlaying(true)
                }}
                className={`
                  w-full text-left p-3.5 rounded-xl border transition-colors relative
                  ${isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:bg-secondary'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    size-9 rounded-lg flex items-center justify-center shrink-0
                    ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}
                  `}>
                    {isSelected ? <Check className="size-4" /> : <CirclePlay className="size-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{template.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px] py-0">
                        {template.category}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                        <Clock className="size-2.5" />
                        {template.duration}s · {template.fps}fps
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
