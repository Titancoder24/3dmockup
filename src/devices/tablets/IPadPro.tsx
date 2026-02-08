import { useRef } from 'react'
import * as THREE from 'three'
import type { DeviceComponentProps, DeviceMetadata, DeviceDimensions } from '../../types'

export const metadata: DeviceMetadata = {
  id: 'ipad-pro-13',
  name: 'iPad Pro 13"',
  brand: 'Apple',
  category: 'tablet',
  year: 2024,
  colors: [
    { name: 'Space Black', hex: '#1d1d1f' },
    { name: 'Silver', hex: '#e3e3e0' },
  ],
  defaultColor: '#1d1d1f',
  tags: ['ipad', 'apple', 'tablet', 'pro', '13', '2024', 'm4'],
  featured: true,
}

export const dimensions: DeviceDimensions = {
  width: 7.12,
  height: 9.84,
  depth: 0.20,
  screenWidth: 6.90,
  screenHeight: 9.60,
  screenOffsetX: 0,
  screenOffsetY: 0,
  screenOffsetZ: 0.11,
  cornerRadius: 0.40,
}

export default function IPadPro({
  screen = null,
  color = '#1d1d1f',
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  scale = [1, 1, 1],
}: DeviceComponentProps) {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Device Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color={color} metalness={0.92} roughness={0.10} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, dimensions.screenOffsetZ]}>
        <planeGeometry args={[dimensions.screenWidth, dimensions.screenHeight]} />
        {screen ? (
          <meshBasicMaterial map={screen} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#000000" />
        )}
      </mesh>

      {/* Front Camera (landscape position, centered on long edge) */}
      <mesh position={[0, 4.95, 0.11]}>
        <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
        <meshBasicMaterial color="#111111" />
      </mesh>

      {/* Back Camera Module */}
      <mesh position={[-2.90, 4.20, -0.14]}>
        <boxGeometry args={[1.0, 1.0, 0.10]} />
        <meshStandardMaterial color={color} metalness={0.90} roughness={0.12} />
      </mesh>

      {/* Camera Lens */}
      <mesh position={[-2.90, 4.20, -0.22]}>
        <cylinderGeometry args={[0.20, 0.20, 0.08, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Flash */}
      <mesh position={[-2.50, 4.20, -0.20]}>
        <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
        <meshStandardMaterial color="#f5e6c8" emissive="#f5e6c8" emissiveIntensity={0.1} />
      </mesh>

      {/* Power Button (top) */}
      <mesh position={[-3.00, 4.95, 0]}>
        <boxGeometry args={[0.40, 0.04, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Volume Buttons (right side) */}
      <mesh position={[3.59, 3.50, 0]}>
        <boxGeometry args={[0.04, 0.35, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[3.59, 2.95, 0]}>
        <boxGeometry args={[0.04, 0.35, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* USB-C Port (bottom center) */}
      <mesh position={[0, -4.95, 0]}>
        <boxGeometry args={[0.32, 0.02, 0.12]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Apple Pencil magnetic strip (right side) */}
      <mesh position={[3.58, 0, 0]}>
        <boxGeometry args={[0.02, 6.0, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.20} />
      </mesh>
    </group>
  )
}
