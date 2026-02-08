import type { MotionTemplate } from '../../types'

export const ZoomReveal: MotionTemplate = {
  id: 'cinematic-zoom-reveal',
  name: 'Cinematic Zoom Reveal',
  description: 'Dramatic zoom-in reveal with cinematic black background and spotlight effect. Perfect for launches.',
  category: 'cinematic',
  duration: 3,
  fps: 30,
  tags: ['zoom', 'cinematic', 'dramatic', 'reveal', 'launch'],

  animate: (frame, totalFrames, _deviceType) => {
    const progress = frame / totalFrames
    // Cubic ease-out
    const eased = 1 - Math.pow(1 - progress, 3)
    const cameraZ = 20 - eased * 12

    return {
      camera: {
        position: [0, 0, cameraZ],
        target: [0, 0, 0],
        fov: 45,
      },
      device: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      background: '#000000',
      lighting: {
        ambient: 0.3,
        directional: {
          position: [10, 10, 10],
          intensity: 1.5,
        },
      },
    }
  },
}
