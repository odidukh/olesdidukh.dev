import { describe, it, expect } from 'vitest';
import {
  applyGravityForce,
  applyOrbitalMotion,
  applyDamping,
  applyHomingForce,
} from './useParticleForces';

describe('applyGravityForce', () => {
  it('applies attractive force toward cursor when within radius', () => {
    const velocities = new Float32Array([0, 0, 0]);
    const positions = new Float32Array([2, 0, 0]);
    const cursor = { x: 0, y: 0, z: 0 };

    applyGravityForce(velocities, positions, 0, cursor, 5.0, 0.5, 0.01, false);

    // Velocity should push particle toward cursor (negative X)
    expect(velocities[0]).toBeLessThan(0);
  });

  it('applies repulsive force when repelling', () => {
    const velocities = new Float32Array([0, 0, 0]);
    const positions = new Float32Array([2, 0, 0]);
    const cursor = { x: 0, y: 0, z: 0 };

    applyGravityForce(velocities, positions, 0, cursor, 5.0, 0.5, 0.01, true);

    // Velocity should push particle away from cursor (positive X)
    expect(velocities[0]).toBeGreaterThan(0);
  });

  it('does nothing when particle is outside influence radius', () => {
    const velocities = new Float32Array([0, 0, 0]);
    const positions = new Float32Array([100, 0, 0]);
    const cursor = { x: 0, y: 0, z: 0 };

    applyGravityForce(velocities, positions, 0, cursor, 5.0, 0.5, 0.01, false);

    expect(velocities[0]).toBe(0);
    expect(velocities[1]).toBe(0);
    expect(velocities[2]).toBe(0);
  });
});

describe('applyOrbitalMotion', () => {
  it('rotates position around Y axis based on orbital speed', () => {
    const positions = new Float32Array([1, 0, 0]);
    const orbitalSpeeds = new Float32Array([1.0]);

    applyOrbitalMotion(positions, orbitalSpeeds, 0, 0.1);

    // After rotation around Y, x should decrease and z should change
    expect(positions[0]).not.toBe(1);
  });
});

describe('applyDamping', () => {
  it('reduces velocity by damping factor', () => {
    const velocities = new Float32Array([1, 2, 3]);

    applyDamping(velocities, 0, 0.96);

    expect(velocities[0]).toBeCloseTo(0.96);
    expect(velocities[1]).toBeCloseTo(1.92);
    expect(velocities[2]).toBeCloseTo(2.88);
  });
});

describe('applyHomingForce', () => {
  it('pulls particle toward home position', () => {
    const positions = new Float32Array([5, 0, 0]);
    const homePositions = new Float32Array([0, 0, 0]);
    const velocities = new Float32Array([0, 0, 0]);

    applyHomingForce(velocities, positions, homePositions, 0, 0.01);

    // Should have negative X velocity (toward home)
    expect(velocities[0]).toBeLessThan(0);
  });
});
