import { useRef } from 'react'
import * as THREE from 'three'
import type { DeviceComponentProps, DeviceMetadata, DeviceDimensions } from '../../types'

export const metadata: DeviceMetadata = {
  id: 'macbook-pro-16',
  name: 'MacBook Pro 16"',
  brand: 'Apple',
  category: 'laptop',
  year: 2024,
  colors: [
    { name: 'Space Black', hex: '#1d1d1f' },
    { name: 'Silver', hex: '#e3e3e0' },
  ],
  defaultColor: '#1d1d1f',
  tags: ['macbook', 'apple', 'laptop', 'pro', '16', '2024', 'm4'],
  featured: true,
}

export const dimensions: DeviceDimensions = {
  width: 12.0,
  height: 0.65,
  depth: 8.5,
  screenWidth: 11.2,
  screenHeight: 7.0,
  screenOffsetX: 0,
  screenOffsetY: 3.65,
  screenOffsetZ: -4.15,
  cornerRadius: 0.30,
}

export default function MacBookPro({
  screen = null,
  color = '#1d1d1f',
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  scale = [1, 1, 1],
}: DeviceComponentProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Laptop open angle (about 110 degrees)
  const lidAngle = -0.35

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Base / Bottom part (keyboard area) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[dimensions.width, 0.22, dimensions.depth]} />
        <meshStandardMaterial color={color} metalness={0.92} roughness={0.10} />
      </mesh>

      {/* Keyboard area (darker inset) */}
      <mesh position={[0, 0.12, -0.2]}>
        <boxGeometry args={[10.5, 0.02, 5.5]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.12, 2.2]}>
        <boxGeometry args={[4.8, 0.01, 3.0]} />
        <meshStandardMaterial color={color} metalness={0.80} roughness={0.15} />
      </mesh>

      {/* Lid / Screen part (hinged at back edge) */}
      <group position={[0, 0.11, -4.15]} rotation={[lidAngle, 0, 0]}>
        {/* Lid body */}
        <mesh castShadow position={[0, 3.65, 0]}>
          <boxGeometry args={[dimensions.width, 7.5, 0.18]} />
          <meshStandardMaterial color={color} metalness={0.92} roughness={0.10} />
        </mesh>

        {/* Screen display */}
        <mesh position={[0, 3.65, 0.10]}>
          <planeGeometry args={[dimensions.screenWidth, dimensions.screenHeight]} />
          {screen ? (
            <meshBasicMaterial map={screen} toneMapped={false} />
          ) : (
            <meshBasicMaterial color="#0a0a0a" />
          )}
        </mesh>

        {/* Notch (camera housing) */}
        <mesh position={[0, 7.30, 0.10]}>
          <boxGeometry args={[0.80, 0.18, 0.02]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Apple logo on back of lid */}
        <mesh position={[0, 3.65, -0.10]}>
          <boxGeometry args={[0.80, 0.80, 0.01]} />
          <meshStandardMaterial
            color={color}
            metalness={0.98}
            roughness={0.05}
            emissive={color}
            emissiveIntensity={0.02}
          />
        </mesh>
      </group>

      {/* Speaker grills (left and right of keyboard) */}
      <mesh position={[-5.5, 0.12, -0.2]}>
        <boxGeometry args={[0.3, 0.01, 5.0]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[5.5, 0.12, -0.2]}>
        <boxGeometry args={[0.3, 0.01, 5.0]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Ports - Left side */}
      <mesh position={[-6.02, 0, -2.0]}>
        <boxGeometry args={[0.02, 0.10, 0.32]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-6.02, 0, -1.2]}>
        <boxGeometry args={[0.02, 0.10, 0.32]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}
