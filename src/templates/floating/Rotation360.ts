import type { MotionTemplate } from '../../types'

export const Rotation360: MotionTemplate = {
  id: 'rotation-360',
  name: '360° Rotation',
  description: 'Smooth full rotation with gentle floating motion. Perfect for showcasing app UI from all angles.',
  category: 'floating',
  duration: 4,
  fps: 30,
  tags: ['rotation', 'smooth', 'floating', 'showcase', '360'],

  animate: (frame, totalFrames, _deviceType) => {
    const progress = frame / totalFrames
    const angle = progress * Math.PI * 2
    const floatY = Math.sin(progress * Math.PI * 2) * 0.3

    return {
      camera: {
        position: [0, 0.5, 8],
        target: [0, 0, 0],
        fov: 45,
      },
      device: {
        position: [0, floatY, 0],
        rotation: [0.1, angle, 0],
        scale: [1, 1, 1],
      },
      background: { type: 'gradient', colors: ['#667eea', '#764ba2'], angle: 135 },
      lighting: {
        ambient: 0.5,
        directional: {
          position: [5, 8, 5],
          intensity: 1.0,
        },
      },
    }
  },
}
