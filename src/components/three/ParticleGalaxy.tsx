'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { generateGalaxyData, type GalaxyConfig } from '@/lib/galaxyData';
import { galaxyVertexShader, galaxyFragmentShader } from '@/lib/galaxyShaders';
import { useParticleForces } from '@/hooks/useParticleForces';
import { ConnectionLines } from './ConnectionLines';

interface ParticleGalaxyProps {
  mousePosition: { x: number; y: number };
  config?: GalaxyConfig;
  showConnections?: boolean;
  maxConnections?: number;
  connectionThreshold?: number;
}

export function ParticleGalaxy({
  mousePosition,
  config = { core: 200, mid: 500, dust: 800 },
  showConnections = true,
  maxConnections = 300,
  connectionThreshold = 1.5,
}: ParticleGalaxyProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera, size } = useThree();
  const [isPressed, setIsPressed] = useState(false);

  // Generate galaxy data once
  const galaxyData = useMemo(() => generateGalaxyData(config), [config]);

  const { updateParticles } = useParticleForces(galaxyData.totalCount);

  // Shader material uniforms
  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uTime: { value: 0 },
    }),
    []
  );

  // Create buffer geometry with attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(galaxyData.positions, 3)
    );
    geo.setAttribute('aSize', new THREE.BufferAttribute(galaxyData.sizes, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(galaxyData.colors, 3));
    geo.setAttribute(
      'aOpacity',
      new THREE.BufferAttribute(galaxyData.opacities, 1)
    );
    return geo;
  }, [galaxyData]);

  // Mouse press tracking for repel mode
  useEffect(() => {
    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);

    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchstart', handleDown);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchstart', handleDown);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  // Project mouse to 3D each frame and run physics
  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.getElapsedTime();

    // Project 2D mouse to 3D world position on z=0 plane
    let cursor3D: { x: number; y: number; z: number } | null = null;
    if (mousePosition.x !== 0 || mousePosition.y !== 0) {
      const ndc = new THREE.Vector2(
        (mousePosition.x / size.width) * 2 - 1,
        -(mousePosition.y / size.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);
      if (target) {
        cursor3D = { x: target.x, y: target.y, z: target.z };
      }
    }

    // Run physics
    updateParticles(
      galaxyData.positions,
      galaxyData.homePositions,
      galaxyData.orbitalSpeeds,
      galaxyData.interactiveCount,
      cursor3D,
      isPressed,
      delta
    );

    // Flag position buffer as needing GPU update
    geometry.attributes['position']!.needsUpdate = true;
  });

  return (
    <>
      <points ref={pointsRef} geometry={geometry}>
        <shaderMaterial
          vertexShader={galaxyVertexShader}
          fragmentShader={galaxyFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {showConnections && (
        <ConnectionLines
          positions={galaxyData.positions}
          interactiveCount={galaxyData.interactiveCount}
          threshold={connectionThreshold}
          maxConnections={maxConnections}
          color="#bfa58a"
          opacity={0.3}
        />
      )}
    </>
  );
}
