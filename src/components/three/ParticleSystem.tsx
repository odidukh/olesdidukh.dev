'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  mousePosition: { x: number; y: number };
}

export function ParticleSystem({
  count = 1500,
  mousePosition,
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particle positions
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      const distance = THREE.MathUtils.randFloat(2, 12);

      positions[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = distance * Math.cos(theta);
    }
    return positions;
  }, [count]);

  useFrame(state => {
    if (!pointsRef.current) return;

    // Slow rotation over time
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;

    // Subtle parallax reaction to mouse
    if (typeof window !== 'undefined') {
      const mouseX = (mousePosition.x / window.innerWidth) * 2 - 1;
      const mouseY = -(mousePosition.y / window.innerHeight) * 2 + 1;

      pointsRef.current.rotation.y += mouseX * 0.05;
      pointsRef.current.rotation.x += mouseY * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={particlesPosition} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a47864" /* mocha-500 */
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
