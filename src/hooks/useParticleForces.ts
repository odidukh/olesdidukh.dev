'use client';

import { useCallback, useRef } from 'react';

interface CursorPosition {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/**
 * Apply gravity force from cursor to a single particle.
 * Exported for testing; the hook uses this internally.
 */
export function applyGravityForce(
  velocities: Float32Array,
  positions: Float32Array,
  index: number,
  cursor: CursorPosition,
  influenceRadius: number,
  strength: number,
  deltaTime: number,
  repel: boolean
): void {
  const i3 = index * 3;
  const dx = positions[i3]! - cursor.x;
  const dy = positions[i3 + 1]! - cursor.y;
  const dz = positions[i3 + 2]! - cursor.z;
  const distSq = dx * dx + dy * dy + dz * dz;

  if (distSq > influenceRadius * influenceRadius) return;

  const dist = Math.sqrt(distSq);
  if (dist < 0.001) return;

  const softening = 0.5;
  const forceMag = strength / (distSq + softening);
  const direction = repel ? 1 : -1;

  velocities[i3] =
    velocities[i3]! + (dx / dist) * forceMag * deltaTime * direction;
  velocities[i3 + 1] =
    velocities[i3 + 1]! + (dy / dist) * forceMag * deltaTime * direction;
  velocities[i3 + 2] =
    velocities[i3 + 2]! + (dz / dist) * forceMag * deltaTime * direction;
}

/**
 * Apply orbital rotation around the Y axis for a single particle.
 */
export function applyOrbitalMotion(
  positions: Float32Array,
  orbitalSpeeds: Float32Array,
  index: number,
  deltaTime: number
): void {
  const i3 = index * 3;
  const speed = orbitalSpeeds[index]!;
  const angle = speed * deltaTime;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const x = positions[i3]!;
  const z = positions[i3 + 2]!;

  positions[i3] = x * cosA - z * sinA;
  positions[i3 + 2] = x * sinA + z * cosA;
}

/**
 * Apply velocity damping to a single particle.
 */
export function applyDamping(
  velocities: Float32Array,
  index: number,
  factor: number
): void {
  const i3 = index * 3;
  velocities[i3] = velocities[i3]! * factor;
  velocities[i3 + 1] = velocities[i3 + 1]! * factor;
  velocities[i3 + 2] = velocities[i3 + 2]! * factor;
}

/**
 * Apply soft homing force pulling particle back toward its home position.
 */
export function applyHomingForce(
  velocities: Float32Array,
  positions: Float32Array,
  homePositions: Float32Array,
  index: number,
  strength: number
): void {
  const i3 = index * 3;
  velocities[i3] =
    velocities[i3]! + (homePositions[i3]! - positions[i3]!) * strength;
  velocities[i3 + 1] =
    velocities[i3 + 1]! +
    (homePositions[i3 + 1]! - positions[i3 + 1]!) * strength;
  velocities[i3 + 2] =
    velocities[i3 + 2]! +
    (homePositions[i3 + 2]! - positions[i3 + 2]!) * strength;
}

/**
 * Hook: manages velocity buffer and provides an update function
 * to call each frame from useFrame.
 */
export function useParticleForces(totalCount: number) {
  const velocitiesRef = useRef<Float32Array>(new Float32Array(totalCount * 3));

  const updateParticles = useCallback(
    (
      positions: Float32Array,
      homePositions: Float32Array,
      orbitalSpeeds: Float32Array,
      interactiveCount: number,
      cursor: CursorPosition | null,
      repel: boolean,
      deltaTime: number
    ) => {
      const velocities = velocitiesRef.current;
      const clampedDt = Math.min(deltaTime, 0.05); // Cap at 50ms to prevent explosion

      for (let i = 0; i < totalCount; i++) {
        // Gravity force (interactive particles only)
        if (cursor && i < interactiveCount) {
          applyGravityForce(
            velocities,
            positions,
            i,
            cursor,
            3.0,
            0.5,
            clampedDt,
            repel
          );
        }

        // Homing force (always active, keeps galaxy shape)
        applyHomingForce(velocities, positions, homePositions, i, 0.01);

        // Orbital motion
        applyOrbitalMotion(positions, orbitalSpeeds, i, clampedDt);

        // Apply velocity to position
        const i3 = i * 3;
        positions[i3] = positions[i3]! + velocities[i3]!;
        positions[i3 + 1] = positions[i3 + 1]! + velocities[i3 + 1]!;
        positions[i3 + 2] = positions[i3 + 2]! + velocities[i3 + 2]!;

        // Damping
        applyDamping(velocities, i, 0.96);
      }
    },
    [totalCount]
  );

  return { updateParticles };
}
