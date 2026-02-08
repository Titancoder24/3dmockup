import type { MotionTemplate } from '../../types'

export const DeskSetup: MotionTemplate = {
  id: 'desk-setup',
  name: 'Desk Setup',
  description: 'Professional desk scene with orbiting camera. Ideal for product presentations and portfolios.',
  category: 'desk',
  duration: 6,
  fps: 30,
  tags: ['desk', 'orbit', 'professional', 'presentation', 'studio'],

  animate: (frame, totalFrames, deviceType) => {
    const progress = frame / totalFrames
    // Slow smooth orbit
    const orbitAngle = progress * Math.PI * 0.5
    const radius = deviceType === 'laptop' ? 14 : 10
    const cameraY = deviceType === 'laptop' ? 5 : 4
    const deviceTilt = deviceType === 'laptop' ? 0 : -0.3

    return {
      camera: {
        position: [
          Math.sin(orbitAngle) * radius,
          cameraY,
          Math.cos(orbitAngle) * radius,
        ],
        target: [0, 0, 0],
        fov: 40,
      },
      device: {
        position: [0, deviceType === 'laptop' ? -1 : 0, 0],
        rotation: [deviceTilt, 0, 0],
        scale: [1, 1, 1],
      },
      background: { type: 'gradient', colors: ['#2d3436', '#636e72'] },
      lighting: {
        ambient: 0.6,
        directional: {
          position: [5, 10, 5],
          intensity: 0.8,
        },
      },
    }
  },
}
