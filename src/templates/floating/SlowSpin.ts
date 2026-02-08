import type { MotionTemplate } from '../../types'

export const SlowSpin: MotionTemplate = {
  id: 'slow-spin',
  name: 'Slow Elegant Spin',
  description: 'Ultra-slow 360° rotation on a dark background. Cinematic and minimal.',
  category: 'floating',
  duration: 8,
  fps: 30,
  tags: ['slow', 'spin', 'elegant', 'minimal', 'dark'],

  animate: (frame, totalFrames, _deviceType) => {
    const progress = frame / totalFrames
    const angle = progress * Math.PI * 2

    return {
      camera: {
        position: [0, 0.3, 8],
        target: [0, 0, 0],
        fov: 42,
      },
      device: {
        position: [0, 0, 0],
        rotation: [0.08, angle, 0],
        scale: [1, 1, 1],
      },
      background: '#0a0a0a',
      lighting: {
        ambient: 0.25,
        directional: {
          position: [5, 5, 10],
          intensity: 1.4,
        },
      },
    }
  },
}
