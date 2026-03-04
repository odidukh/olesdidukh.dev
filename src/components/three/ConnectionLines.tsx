'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpatialHash } from '@/lib/spatialHash';

interface ConnectionLinesProps {
  positions: Float32Array;
  interactiveCount: number;
  threshold: number;
  maxConnections: number;
  color: string;
  opacity: number;
}

export function ConnectionLines({
  positions,
  interactiveCount,
  threshold,
  maxConnections,
  color,
  opacity,
}: ConnectionLinesProps) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const spatialHash = useMemo(() => new SpatialHash(threshold), [threshold]);

  // Pre-allocate line geometry buffers
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // Each connection = 2 vertices x 3 components
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineOpacities = new Float32Array(maxConnections * 2);
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    geo.setAttribute('opacity', new THREE.BufferAttribute(lineOpacities, 1));
    geo.setDrawRange(0, 0);
    return geo;
  }, [maxConnections]);

  useFrame(() => {
    if (!lineRef.current) return;

    // Rebuild spatial hash with interactive particles only
    spatialHash.clear();
    for (let i = 0; i < interactiveCount; i++) {
      spatialHash.insert(
        i,
        positions[i * 3]!,
        positions[i * 3 + 1]!,
        positions[i * 3 + 2]!
      );
    }

    // Find nearby pairs
    const pairs = spatialHash.findPairs(threshold, maxConnections);

    // Update line geometry
    const linePositions = lineGeometry.attributes['position']!
      .array as Float32Array;
    const lineOpacities = lineGeometry.attributes['opacity']!
      .array as Float32Array;
    const thresholdSq = threshold * threshold;

    for (let p = 0; p < pairs.length; p++) {
      const pair = pairs[p]!;
      const v = p * 6; // 2 vertices x 3 components
      const o = p * 2; // 2 opacity values

      linePositions[v] = positions[pair.i * 3]!;
      linePositions[v + 1] = positions[pair.i * 3 + 1]!;
      linePositions[v + 2] = positions[pair.i * 3 + 2]!;
      linePositions[v + 3] = positions[pair.j * 3]!;
      linePositions[v + 4] = positions[pair.j * 3 + 1]!;
      linePositions[v + 5] = positions[pair.j * 3 + 2]!;

      // Opacity fades with distance
      const fadeAlpha = 1.0 - pair.distSq / thresholdSq;
      lineOpacities[o] = fadeAlpha;
      lineOpacities[o + 1] = fadeAlpha;
    }

    lineGeometry.setDrawRange(0, pairs.length * 2);
    lineGeometry.attributes['position']!.needsUpdate = true;
    lineGeometry.attributes['opacity']!.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef} geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
