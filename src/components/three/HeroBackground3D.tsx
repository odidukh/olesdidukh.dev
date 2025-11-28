'use client';

import * as React from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shape component
function FloatingShape({
  position,
  color,
  speed,
  distort,
  scale,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  scale: number;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          distort={distort}
          speed={2}
          roughness={0.4}
        />
      </mesh>
    </Float>
  );
}

// Mouse-following light
function MouseLight() {
  const lightRef = React.useRef<THREE.PointLight>(null);
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = (mouse.x * viewport.width) / 2;
      lightRef.current.position.y = (mouse.y * viewport.height) / 2;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={0.5}
      color="#a67c52"
      distance={10}
      position={[0, 0, 3]}
    />
  );
}

// Main 3D scene
function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  const shapes = React.useMemo(() => {
    if (reducedMotion) {
      // Fewer, static shapes for reduced motion
      return [
        {
          position: [-3, 2, -2] as [number, number, number],
          color: '#a67c52',
          speed: 0,
          distort: 0,
          scale: 1.5,
        },
        {
          position: [3, -1, -3] as [number, number, number],
          color: '#1e3a5f',
          speed: 0,
          distort: 0,
          scale: 2,
        },
      ];
    }

    return [
      {
        position: [-4, 2, -2] as [number, number, number],
        color: '#a67c52',
        speed: 1,
        distort: 0.3,
        scale: 1.2,
      },
      {
        position: [4, -2, -3] as [number, number, number],
        color: '#1e3a5f',
        speed: 0.8,
        distort: 0.4,
        scale: 1.8,
      },
      {
        position: [-2, -3, -4] as [number, number, number],
        color: '#a67c52',
        speed: 1.2,
        distort: 0.2,
        scale: 1,
      },
      {
        position: [2, 3, -5] as [number, number, number],
        color: '#1e3a5f',
        speed: 0.6,
        distort: 0.5,
        scale: 2.2,
      },
      {
        position: [0, -1, -6] as [number, number, number],
        color: '#a67c52',
        speed: 0.9,
        distort: 0.35,
        scale: 1.5,
      },
    ];
  }, [reducedMotion]);

  return (
    <>
      <ambientLight intensity={0.2} />
      {!reducedMotion && <MouseLight />}
      <pointLight position={[10, 10, 10]} intensity={0.3} />

      {shapes.map((shape, index) => (
        <FloatingShape key={index} {...shape} />
      ))}
    </>
  );
}

// Hook to detect reduced motion preference
function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// Hook to detect mobile/low-performance devices
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function HeroBackground3D() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server or before mount
  if (!mounted) {
    return null;
  }

  // Skip 3D on mobile for performance
  if (isMobile) {
    return null;
  }

  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        gl={{
          antialias: false, // Better performance
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
