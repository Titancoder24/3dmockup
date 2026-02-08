import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import type { DeviceComponentProps, DeviceMetadata, DeviceDimensions } from '../../types'

export const metadata: DeviceMetadata = {
  id: 'iphone-15-pro',
  name: 'iPhone 15 Pro',
  brand: 'Apple',
  category: 'phone',
  year: 2023,
  colors: [
    { name: 'Black Titanium', hex: '#1d1d1f' },
    { name: 'Blue Titanium', hex: '#2d455e' },
    { name: 'White Titanium', hex: '#f4f4f4' },
    { name: 'Natural Titanium', hex: '#dad6cb' },
  ],
  defaultColor: '#1d1d1f',
  tags: ['iphone', 'apple', 'flagship', '2023', 'titanium', 'pro', '15'],
  featured: true,
}

export const dimensions: DeviceDimensions = {
  width: 2.71,
  height: 5.81,
  depth: 0.32,
  screenWidth: 2.60,
  screenHeight: 5.65,
  screenOffsetX: 0,
  screenOffsetY: 0.05,
  screenOffsetZ: 0.17,
  cornerRadius: 0.32,
}

export default function IPhone15Pro({
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
        <meshStandardMaterial
          color={color}
          metalness={0.95}
          roughness={0.12}
        />
      </mesh>

      {/* Screen - Front Face */}
      <mesh position={[dimensions.screenOffsetX, dimensions.screenOffsetY, dimensions.screenOffsetZ]}>
        <planeGeometry args={[dimensions.screenWidth, dimensions.screenHeight]} />
        {screen ? (
          <meshBasicMaterial map={screen} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#000000" />
        )}
      </mesh>

      {/* Screen Bezel/Border */}
      <mesh position={[0, 0.05, 0.165]}>
        <boxGeometry args={[2.65, 5.70, 0.01]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.8} />
      </mesh>

      {/* Dynamic Island */}
      <mesh position={[0, 2.63, 0.175]}>
        <boxGeometry args={[0.82, 0.16, 0.01]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Camera Module - Back */}
      <mesh position={[-0.82, 2.18, -0.18]} castShadow>
        <boxGeometry args={[1.22, 1.24, 0.16]} />
        <meshStandardMaterial color={color} metalness={0.90} roughness={0.15} />
      </mesh>

      {/* Camera Lens 1 (Top Left) */}
      <mesh position={[-1.08, 2.48, -0.30]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Camera Lens 2 (Top Right) */}
      <mesh position={[-0.56, 2.48, -0.30]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Camera Lens 3 (Bottom Center) */}
      <mesh position={[-0.82, 1.92, -0.30]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Flash */}
      <mesh position={[-0.56, 1.92, -0.28]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshStandardMaterial color="#f5e6c8" emissive="#f5e6c8" emissiveIntensity={0.1} />
      </mesh>

      {/* Power Button (right side) */}
      <mesh position={[1.38, 1.48, 0]}>
        <boxGeometry args={[0.04, 0.82, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Volume Up (left side) */}
      <mesh position={[-1.38, 2.15, 0]}>
        <boxGeometry args={[0.04, 0.45, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Volume Down (left side) */}
      <mesh position={[-1.38, 1.52, 0]}>
        <boxGeometry args={[0.04, 0.45, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Action Button (left side) */}
      <mesh position={[-1.38, 2.72, 0]}>
        <boxGeometry args={[0.04, 0.22, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Bottom Speaker Grills */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
        <mesh key={`speaker-${i}`} position={[x, -2.92, 0.08]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}

      {/* USB-C Port */}
      <mesh position={[0, -2.92, 0]}>
        <boxGeometry args={[0.32, 0.02, 0.12]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}
