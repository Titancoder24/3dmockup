import type { MotionTemplate } from '../../types'

export const ZoomOut: MotionTemplate = {
  id: 'cinematic-zoom-out',
  name: 'Zoom Out Reveal',
  description: 'Starts close and pulls back dramatically to reveal the full device. Great for storytelling.',
  category: 'cinematic',
  duration: 4,
  fps: 30,
  tags: ['zoom', 'out', 'cinematic', 'reveal', 'dramatic'],

  animate: (frame, totalFrames, _deviceType) => {
    const progress = frame / totalFrames
    // Ease in-out
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2
    const cameraZ = 4 + eased * 10
    const rotY = eased * 0.3

    return {
      camera: {
        position: [0, 0.5, cameraZ],
        target: [0, 0, 0],
        fov: 45,
      },
      device: {
        position: [0, 0, 0],
        rotation: [0.05, rotY, 0],
        scale: [1, 1, 1],
      },
      background: { type: 'gradient', colors: ['#1a1a2e', '#16213e', '#0f3460'] },
      lighting: {
        ambient: 0.35,
        directional: {
          position: [8, 8, 8],
          intensity: 1.3,
        },
      },
    }
  },
}
