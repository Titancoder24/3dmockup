import { useRef } from 'react'
import * as THREE from 'three'
import type { DeviceComponentProps, DeviceMetadata, DeviceDimensions } from '../../types'

export const metadata: DeviceMetadata = {
  id: 'samsung-s24-ultra',
  name: 'Samsung Galaxy S24 Ultra',
  brand: 'Samsung',
  category: 'phone',
  year: 2024,
  colors: [
    { name: 'Titanium Black', hex: '#2b2b2b' },
    { name: 'Titanium Gray', hex: '#9e9e9e' },
    { name: 'Titanium Violet', hex: '#b8a9c9' },
    { name: 'Titanium Yellow', hex: '#e8d5a3' },
  ],
  defaultColor: '#2b2b2b',
  tags: ['samsung', 'galaxy', 's24', 'ultra', 'flagship', '2024', 'android'],
  featured: true,
}

export const dimensions: DeviceDimensions = {
  width: 2.78,
  height: 6.10,
  depth: 0.30,
  screenWidth: 2.68,
  screenHeight: 5.94,
  screenOffsetX: 0,
  screenOffsetY: 0.05,
  screenOffsetZ: 0.16,
  cornerRadius: 0.20,
}

export default function SamsungS24Ultra({
  screen = null,
  color = '#2b2b2b',
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  scale = [1, 1, 1],
}: DeviceComponentProps) {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Device Body - more angular corners than iPhone */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color={color} metalness={0.90} roughness={0.15} />
      </mesh>

      {/* Screen */}
      <mesh position={[dimensions.screenOffsetX, dimensions.screenOffsetY, dimensions.screenOffsetZ]}>
        <planeGeometry args={[dimensions.screenWidth, dimensions.screenHeight]} />
        {screen ? (
          <meshBasicMaterial map={screen} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#000000" />
        )}
      </mesh>

      {/* Front Camera (punch hole, top center) */}
      <mesh position={[0, 2.72, 0.17]}>
        <cylinderGeometry args={[0.08, 0.08, 0.01, 16]} />
        <meshBasicMaterial color="#111111" />
      </mesh>

      {/* Camera Lenses (individual, no module bump - vertical line) */}
      {[2.40, 1.90, 1.40, 0.90].map((y, i) => (
        <mesh key={`lens-${i}`} position={[-0.95, y, -0.20]}>
          <cylinderGeometry args={[0.16, 0.16, 0.10, 32]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Flash */}
      <mesh position={[-0.95, 0.50, -0.18]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <meshStandardMaterial color="#f5e6c8" emissive="#f5e6c8" emissiveIntensity={0.1} />
      </mesh>

      {/* Power Button */}
      <mesh position={[1.42, 1.20, 0]}>
        <boxGeometry args={[0.04, 0.60, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Volume Up */}
      <mesh position={[-1.42, 1.80, 0]}>
        <boxGeometry args={[0.04, 0.40, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Volume Down */}
      <mesh position={[-1.42, 1.20, 0]}>
        <boxGeometry args={[0.04, 0.40, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* S Pen Slot (bottom) */}
      <mesh position={[-0.60, -3.07, 0]}>
        <boxGeometry args={[0.20, 0.02, 0.12]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* USB-C Port */}
      <mesh position={[0, -3.07, 0]}>
        <boxGeometry args={[0.32, 0.02, 0.12]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}
