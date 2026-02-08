import { useAppStore } from '../../store'
import { getTemplateById } from '../../templates/registry'
import { Play, Pause, RotateCcw, Repeat, ChevronLeft, ChevronRight } from 'lucide-react'

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
  const progress = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-surface-900/90 backdrop-blur-sm border-t border-surface-700 px-4 py-2">
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-lg hover:bg-surface-700 transition-colors text-white"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* Frame step back */}
        <button
          onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
          className="p-1.5 rounded-lg hover:bg-surface-700 transition-colors text-surface-400"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Timeline scrubber */}
        <div className="flex-1 relative">
          <input
            type="range"
            min={0}
            max={totalFrames - 1}
            value={currentFrame}
            onChange={(e) => {
              setCurrentFrame(parseInt(e.target.value))
              setIsPlaying(false)
            }}
            className="w-full h-1.5 bg-surface-700 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
          />
        </div>

        {/* Frame step forward */}
        <button
          onClick={() => setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 1))}
          className="p-1.5 rounded-lg hover:bg-surface-700 transition-colors text-surface-400"
        >
          <ChevronRight size={16} />
        </button>

        {/* Time display */}
        <span className="text-xs text-surface-400 font-mono min-w-[80px] text-center">
          {currentTime}s / {totalTime}s
        </span>

        {/* Frame counter */}
        <span className="text-xs text-surface-500 font-mono min-w-[60px]">
          F{currentFrame}/{totalFrames}
        </span>

        {/* Speed control */}
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
          className="bg-surface-800 text-xs text-surface-300 px-2 py-1 rounded border border-surface-600"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>

        {/* Loop toggle */}
        <button
          onClick={() => setIsLooping(!isLooping)}
          className={`p-1.5 rounded-lg transition-colors ${
            isLooping ? 'text-primary-400 bg-primary-500/10' : 'text-surface-500 hover:bg-surface-700'
          }`}
        >
          <Repeat size={16} />
        </button>

        {/* Reset */}
        <button
          onClick={() => {
            setCurrentFrame(0)
            setIsPlaying(false)
          }}
          className="p-1.5 rounded-lg hover:bg-surface-700 transition-colors text-surface-400"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  )
}
