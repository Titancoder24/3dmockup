import { useAppStore } from '../../store'
import { getTemplateById } from '../../templates/registry'

import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Slider } from '../../components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '../../components/ui/toggle-group'

import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  SkipBack,
  SkipForward,
} from 'lucide-react'

export default function TimelineBar() {
  const {
    selectedTemplateId,
    isPlaying,
    currentFrame,
    playbackSpeed,
    isLooping,
    setIsPlaying,
    setCurrentFrame,
    setPlaybackSpeed,
    setIsLooping,
  } = useAppStore()

  const template = selectedTemplateId ? getTemplateById(selectedTemplateId) : null
  if (!template) return null

  const totalFrames = template.duration * template.fps
  const currentTime = (currentFrame / template.fps).toFixed(1)
  const totalTime = template.duration.toFixed(1)

  return (
    <div className="h-full flex items-center gap-3">
      {/* Transport */}
      <div className="flex items-center gap-0.5 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
        >
          <SkipBack className="size-3.5" />
        </Button>

        <Button
          size="icon-sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 1))}
        >
          <SkipForward className="size-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Scrubber */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold truncate">{template.name}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-muted-foreground">
              {currentTime}s / {totalTime}s
            </span>
            <Badge variant="secondary" className="text-[9px] font-mono py-0">F{currentFrame}</Badge>
          </div>
        </div>
        <Slider
          min={0}
          max={Math.max(totalFrames - 1, 1)}
          step={1}
          value={[currentFrame]}
          onValueChange={(val) => {
            setCurrentFrame(val[0])
            setIsPlaying(false)
          }}
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Speed */}
      <ToggleGroup
        type="single"
        value={String(playbackSpeed)}
        onValueChange={(val) => val && setPlaybackSpeed(Number(val))}
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="0.5" className="text-[10px] font-bold px-2">0.5×</ToggleGroupItem>
        <ToggleGroupItem value="1" className="text-[10px] font-bold px-2">1×</ToggleGroupItem>
        <ToggleGroupItem value="2" className="text-[10px] font-bold px-2">2×</ToggleGroupItem>
      </ToggleGroup>

      {/* Loop + Reset */}
      <div className="flex items-center gap-0.5 shrink-0">
        <Button
          variant={isLooping ? 'default' : 'ghost'}
          size="icon-sm"
          onClick={() => setIsLooping(!isLooping)}
        >
          <Repeat className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => { setCurrentFrame(0); setIsPlaying(false) }}
        >
          <RotateCcw className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
