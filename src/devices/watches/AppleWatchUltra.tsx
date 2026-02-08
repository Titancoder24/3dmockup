import { useRef } from 'react'
import * as THREE from 'three'
import type { DeviceComponentProps, DeviceMetadata, DeviceDimensions } from '../../types'

export const metadata: DeviceMetadata = {
  id: 'apple-watch-ultra',
  name: 'Apple Watch Ultra 2',
  brand: 'Apple',
  category: 'watch',
  year: 2024,
  colors: [
    { name: 'Natural Titanium', hex: '#d4c9b8' },
    { name: 'Black Titanium', hex: '#2b2b2b' },
  ],
  defaultColor: '#d4c9b8',
  tags: ['apple', 'watch', 'ultra', 'wearable', '2024', 'titanium'],
  featured: true,
}

export const dimensions: DeviceDimensions = {
  width: 1.80,
  height: 2.10,
  depth: 0.56,
  screenWidth: 1.50,
  screenHeight: 1.80,
  screenOffsetX: 0,
  screenOffsetY: 0,
  screenOffsetZ: 0.29,
  cornerRadius: 0.40,
}

export default function AppleWatchUltra({
  screen = null,
  color = '#d4c9b8',
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  scale = [1, 1, 1],
}: DeviceComponentProps) {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Watch Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color={color} metalness={0.88} roughness={0.18} />
      </mesh>

      {/* Raised bezel around screen */}
      <mesh position={[0, 0, 0.25]}>
        <boxGeometry args={[1.70, 2.00, 0.08]} />
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

      {/* Digital Crown (right side, top) */}
      <mesh position={[1.05, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.20, 24]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Side Button (right side, bottom) */}
      <mesh position={[1.02, -0.30, 0]}>
        <boxGeometry args={[0.12, 0.30, 0.20]} />
        <meshStandardMaterial color="#ff6b00" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Action Button (left side) */}
      <mesh position={[-1.02, 0.35, 0]}>
        <boxGeometry args={[0.10, 0.25, 0.20]} />
        <meshStandardMaterial color="#ff6b00" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Band lugs (top) */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[1.60, 0.20, 0.40]} />
        <meshStandardMaterial color={color} metalness={0.88} roughness={0.18} />
      </mesh>

      {/* Band lugs (bottom) */}
      <mesh position={[0, -1.15, 0]}>
        <boxGeometry args={[1.60, 0.20, 0.40]} />
        <meshStandardMaterial color={color} metalness={0.88} roughness={0.18} />
      </mesh>

      {/* Speaker holes (left side) */}
      {[-0.1, 0.0, 0.1].map((z, i) => (
        <mesh key={`speaker-${i}`} position={[-0.92, -0.30, z]}>
          <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  )
}
