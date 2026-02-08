import type { MotionTemplate } from '../../types'

export const FloatBounce: MotionTemplate = {
  id: 'float-bounce',
  name: 'Float & Bounce',
  description: 'Gentle bouncing float with subtle rotation. Great for hero sections and product showcases.',
  category: 'floating',
  duration: 3,
  fps: 30,
  tags: ['float', 'bounce', 'gentle', 'hero', 'minimal'],

  animate: (frame, totalFrames, _deviceType) => {
    const progress = frame / totalFrames
    const bounce = Math.sin(progress * Math.PI * 4) * 0.4
    const gentleSpin = Math.sin(progress * Math.PI * 2) * 0.15

    return {
      camera: {
        position: [0, 0.5, 8],
        target: [0, 0, 0],
        fov: 45,
      },
      device: {
        position: [0, bounce, 0],
        rotation: [0.05, gentleSpin + 0.3, 0.02],
        scale: [1, 1, 1],
      },
      background: { type: 'gradient', colors: ['#0f0c29', '#302b63', '#24243e'] },
      lighting: {
        ambient: 0.4,
        directional: {
          position: [3, 6, 8],
          intensity: 1.2,
        },
      },
    }
  },
}
