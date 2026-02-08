import { Suspense, useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../store'
import { getDeviceById } from '../../devices/registry'
import { getTemplateById } from '../../templates/registry'

function AnimatedScene() {
  const {
    selectedDeviceId,
    selectedDeviceColor,
    screenshotDataUrl,
    selectedTemplateId,
    customRotation,
    isPlaying,
    currentFrame,
    playbackSpeed,
    isLooping,
    setCurrentFrame,
    setIsPlaying,
  } = useAppStore()

  const { camera } = useThree()
  const textureRef = useRef<THREE.Texture | null>(null)
  const frameRef = useRef(currentFrame)
  const lastTimeRef = useRef(0)

  // Load screenshot texture
  useEffect(() => {
    if (screenshotDataUrl) {
      const loader = new THREE.TextureLoader()
      loader.load(screenshotDataUrl, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        textureRef.current = texture
      })
    } else {
      textureRef.current = null
    }
  }, [screenshotDataUrl])

  const template = selectedTemplateId ? getTemplateById(selectedTemplateId) : null
  const device = selectedDeviceId ? getDeviceById(selectedDeviceId) : null

  // Animation loop
  useFrame((state, delta) => {
    if (!template || !isPlaying) return

    const totalFrames = template.duration * template.fps
    frameRef.current += delta * template.fps * playbackSpeed

    if (frameRef.current >= totalFrames) {
      if (isLooping) {
        frameRef.current = 0
      } else {
        frameRef.current = totalFrames - 1
        setIsPlaying(false)
      }
    }

    const frame = Math.floor(frameRef.current)
    setCurrentFrame(frame)

    const animState = template.animate(
      frame,
      totalFrames,
      device?.metadata.category || 'phone'
    )

    // Apply camera
    camera.position.set(...animState.camera.position)
    camera.lookAt(...animState.camera.target)
    if ('fov' in camera && camera instanceof THREE.PerspectiveCamera) {
      camera.fov = animState.camera.fov
      camera.updateProjectionMatrix()
    }
  })

  if (!device) return null

  const DeviceComponent = device.component
  const template_ = template
  const totalFrames = template_ ? template_.duration * template_.fps : 1
  const animState = template_
    ? template_.animate(currentFrame, totalFrames, device.metadata.category)
    : null

  const devicePosition = animState?.device.position || [0, 0, 0]
  const deviceRotation = animState
    ? [
        animState.device.rotation[0] + customRotation[0],
        animState.device.rotation[1] + customRotation[1],
        animState.device.rotation[2] + customRotation[2],
      ] as [number, number, number]
    : customRotation
  const deviceScale = animState?.device.scale || [1, 1, 1]

  return (
    <Suspense fallback={null}>
      <DeviceComponent
        screen={textureRef.current}
        color={selectedDeviceColor}
        position={devicePosition}
        rotation={deviceRotation}
        scale={deviceScale}
      />
    </Suspense>
  )
}

function SceneLighting() {
  const { selectedTemplateId, currentFrame } = useAppStore()
  const template = selectedTemplateId ? getTemplateById(selectedTemplateId) : null

  if (!template) {
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} castShadow />
      </>
    )
  }

  const device = useAppStore.getState().selectedDeviceId
    ? getDeviceById(useAppStore.getState().selectedDeviceId!)
    : null
  const totalFrames = template.duration * template.fps
  const animState = template.animate(
    currentFrame,
    totalFrames,
    device?.metadata.category || 'phone'
  )

  return (
    <>
      <ambientLight intensity={animState.lighting.ambient} />
      <directionalLight
        position={animState.lighting.directional.position}
        intensity={animState.lighting.directional.intensity}
        castShadow
      />
    </>
  )
}

function SceneBackground() {
  const { background, selectedTemplateId, currentFrame } = useAppStore()
  const { scene } = useThree()

  useEffect(() => {
    if (typeof background === 'string') {
      scene.background = new THREE.Color(background)
    } else if (background.type === 'gradient') {
      // Create gradient texture
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')!
      const gradient = ctx.createLinearGradient(0, 0, 512, 512)
      background.colors.forEach((color, i) => {
        gradient.addColorStop(i / Math.max(background.colors.length - 1, 1), color)
      })
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 512, 512)
      const texture = new THREE.CanvasTexture(canvas)
      scene.background = texture
    }
  }, [background, scene])

  return null
}

export default function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { selectedTemplateId } = useAppStore()

  return (
    <div className="w-full h-full relative">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0.5, 8], fov: 45 }}
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        dpr={[1, 2]}
      >
        <SceneBackground />
        <SceneLighting />
        <AnimatedScene />
        {!selectedTemplateId && <OrbitControls enableDamping dampingFactor={0.05} />}
      </Canvas>
    </div>
  )
}
