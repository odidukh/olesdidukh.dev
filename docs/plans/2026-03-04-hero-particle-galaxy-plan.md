# Interactive Particle Galaxy — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the snow-like particle system in the hero section with an interactive 3D galaxy featuring tiered particles, cursor gravity fields, and dynamic connection lines.

**Architecture:** Replaces `ParticleSystem.tsx` (drei `Points` + `PointMaterial`) with custom GLSL shaders on `BufferGeometry` for per-particle physics. Connection lines use a spatial hash grid for O(n) neighbor lookups. Mouse interactivity via camera-unprojected cursor position applied as a gravity force field. Mobile degradation reduces particle count and disables connections.

**Tech Stack:** React Three Fiber 9.x, Three.js 0.181.x, custom GLSL vertex/fragment shaders, Vitest for unit tests.

**Design doc:** `docs/plans/2026-03-04-hero-particle-galaxy-design.md`

---

## Task 1: Create Galaxy GLSL Shaders

Creates the custom vertex and fragment shaders that handle per-particle size, color, and circular point rendering on the GPU.

**Files:**

- Create: `src/lib/galaxyShaders.ts`
- Test: `src/lib/galaxyShaders.test.ts`

**Step 1: Write the failing test**

```typescript
// src/lib/galaxyShaders.test.ts
import { describe, it, expect } from 'vitest';
import { galaxyVertexShader, galaxyFragmentShader } from './galaxyShaders';

describe('galaxyShaders', () => {
  it('exports vertex shader as a non-empty string', () => {
    expect(typeof galaxyVertexShader).toBe('string');
    expect(galaxyVertexShader.length).toBeGreaterThan(0);
  });

  it('exports fragment shader as a non-empty string', () => {
    expect(typeof galaxyFragmentShader).toBe('string');
    expect(galaxyFragmentShader.length).toBeGreaterThan(0);
  });

  it('vertex shader declares required uniforms', () => {
    expect(galaxyVertexShader).toContain('uniform float uPixelRatio');
    expect(galaxyVertexShader).toContain('uniform float uTime');
  });

  it('vertex shader reads size and color attributes', () => {
    expect(galaxyVertexShader).toContain('attribute float aSize');
    expect(galaxyVertexShader).toContain('attribute vec3 aColor');
  });

  it('fragment shader produces circular points via distance discard', () => {
    expect(galaxyFragmentShader).toContain('gl_PointCoord');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/galaxyShaders.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
// src/lib/galaxyShaders.ts

export const galaxyVertexShader = /* glsl */ `
  uniform float uPixelRatio;
  uniform float uTime;

  attribute float aSize;
  attribute vec3 aColor;
  attribute float aOpacity;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Size attenuation: farther particles appear smaller
    gl_PointSize = aSize * uPixelRatio * (300.0 / -viewPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);

    vColor = aColor;
    vOpacity = aOpacity;
  }
`;

export const galaxyFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    // Circular point: discard pixels outside radius
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Soft edge falloff
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    alpha *= vOpacity;

    gl_FragColor = vec4(vColor, alpha);
  }
`;
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/galaxyShaders.test.ts`
Expected: PASS (5 tests)

**Step 5: Commit**

```bash
git add src/lib/galaxyShaders.ts src/lib/galaxyShaders.test.ts
git commit -m "feat: add galaxy GLSL vertex and fragment shaders"
```

---

## Task 2: Create Spatial Hash Utility for Connection Lines

Creates a 3D spatial hash grid that efficiently finds particle pairs within a distance threshold. This avoids O(n^2) pair-checking.

**Files:**

- Create: `src/lib/spatialHash.ts`
- Test: `src/lib/spatialHash.test.ts`

**Step 1: Write the failing test**

```typescript
// src/lib/spatialHash.test.ts
import { describe, it, expect } from 'vitest';
import { SpatialHash } from './spatialHash';

describe('SpatialHash', () => {
  it('creates a spatial hash with given cell size', () => {
    const hash = new SpatialHash(2.0);
    expect(hash).toBeDefined();
  });

  it('clear resets the grid', () => {
    const hash = new SpatialHash(2.0);
    hash.insert(0, 1.0, 2.0, 3.0);
    hash.clear();
    const pairs = hash.findPairs(1.5);
    expect(pairs.length).toBe(0);
  });

  it('finds no pairs when particles are far apart', () => {
    const hash = new SpatialHash(2.0);
    hash.insert(0, 0, 0, 0);
    hash.insert(1, 100, 100, 100);
    const pairs = hash.findPairs(1.5);
    expect(pairs.length).toBe(0);
  });

  it('finds pairs of nearby particles', () => {
    const hash = new SpatialHash(2.0);
    hash.insert(0, 0, 0, 0);
    hash.insert(1, 1.0, 0, 0); // distance = 1.0, within threshold
    hash.insert(2, 0, 1.0, 0); // distance = 1.0, within threshold
    const pairs = hash.findPairs(1.5);
    // Should find 3 pairs: (0,1), (0,2), (1,2)
    expect(pairs.length).toBe(3);
  });

  it('respects max pairs limit', () => {
    const hash = new SpatialHash(2.0);
    // Insert many nearby particles
    for (let i = 0; i < 50; i++) {
      hash.insert(i, Math.random() * 0.5, Math.random() * 0.5, 0);
    }
    const pairs = hash.findPairs(1.5, 10);
    expect(pairs.length).toBeLessThanOrEqual(10);
  });

  it('returns pair indices and squared distance', () => {
    const hash = new SpatialHash(2.0);
    hash.insert(0, 0, 0, 0);
    hash.insert(1, 1.0, 0, 0);
    const pairs = hash.findPairs(1.5);
    expect(pairs[0]).toEqual(
      expect.objectContaining({
        i: expect.any(Number),
        j: expect.any(Number),
        distSq: expect.any(Number),
      })
    );
    expect(pairs[0]!.distSq).toBeCloseTo(1.0, 1);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/spatialHash.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
// src/lib/spatialHash.ts

interface Pair {
  readonly i: number;
  readonly j: number;
  readonly distSq: number;
}

export class SpatialHash {
  private readonly cellSize: number;
  private readonly inverseCellSize: number;
  private grid: Map<string, number[]>;
  private positions: Map<number, { x: number; y: number; z: number }>;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
    this.inverseCellSize = 1 / cellSize;
    this.grid = new Map();
    this.positions = new Map();
  }

  clear(): void {
    this.grid = new Map();
    this.positions = new Map();
  }

  insert(index: number, x: number, y: number, z: number): void {
    const key = this.hashKey(x, y, z);
    const cell = this.grid.get(key);
    if (cell) {
      cell.push(index);
    } else {
      this.grid.set(key, [index]);
    }
    this.positions.set(index, { x, y, z });
  }

  findPairs(threshold: number, maxPairs: number = Infinity): readonly Pair[] {
    const thresholdSq = threshold * threshold;
    const pairs: Pair[] = [];
    const checked = new Set<string>();

    for (const [, cell] of this.grid) {
      for (let a = 0; a < cell.length; a++) {
        const idxA = cell[a]!;
        const posA = this.positions.get(idxA)!;

        // Check same cell
        for (let b = a + 1; b < cell.length; b++) {
          if (pairs.length >= maxPairs) return pairs;
          const idxB = cell[b]!;
          const distSq = this.distanceSq(posA, this.positions.get(idxB)!);
          if (distSq <= thresholdSq) {
            pairs.push({ i: idxA, j: idxB, distSq });
          }
        }

        // Check 26 neighbor cells
        const cx = Math.floor(posA.x * this.inverseCellSize);
        const cy = Math.floor(posA.y * this.inverseCellSize);
        const cz = Math.floor(posA.z * this.inverseCellSize);

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
              if (dx === 0 && dy === 0 && dz === 0) continue;
              const neighborKey = `${cx + dx},${cy + dy},${cz + dz}`;
              const pairKey =
                cx < cx + dx ||
                (cx === cx + dx && cy < cy + dy) ||
                (cx === cx + dx && cy === cy + dy && cz < cz + dz)
                  ? `${cx},${cy},${cz}|${neighborKey}`
                  : `${neighborKey}|${cx},${cy},${cz}`;

              if (checked.has(pairKey)) continue;
              checked.add(pairKey);

              const neighbor = this.grid.get(neighborKey);
              if (!neighbor) continue;

              for (const idxB of neighbor) {
                if (pairs.length >= maxPairs) return pairs;
                const distSq = this.distanceSq(posA, this.positions.get(idxB)!);
                if (distSq <= thresholdSq) {
                  pairs.push({
                    i: Math.min(idxA, idxB),
                    j: Math.max(idxA, idxB),
                    distSq,
                  });
                }
              }
            }
          }
        }
      }
    }

    return pairs;
  }

  private hashKey(x: number, y: number, z: number): string {
    return `${Math.floor(x * this.inverseCellSize)},${Math.floor(y * this.inverseCellSize)},${Math.floor(z * this.inverseCellSize)}`;
  }

  private distanceSq(
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number }
  ): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/spatialHash.test.ts`
Expected: PASS (6 tests)

**Step 5: Commit**

```bash
git add src/lib/spatialHash.ts src/lib/spatialHash.test.ts
git commit -m "feat: add SpatialHash utility for particle neighbor lookups"
```

---

## Task 3: Create Galaxy Data Generator

Creates the function that generates initial particle positions, sizes, colors, and orbital velocities in a galaxy disc/spiral distribution with three tiers.

**Files:**

- Create: `src/lib/galaxyData.ts`
- Test: `src/lib/galaxyData.test.ts`

**Step 1: Write the failing test**

```typescript
// src/lib/galaxyData.test.ts
import { describe, it, expect } from 'vitest';
import { generateGalaxyData, type GalaxyConfig } from './galaxyData';

const defaultConfig: GalaxyConfig = {
  core: 200,
  mid: 500,
  dust: 800,
};

describe('generateGalaxyData', () => {
  it('returns typed arrays for positions, sizes, colors, opacities, and velocities', () => {
    const data = generateGalaxyData(defaultConfig);
    const total = 200 + 500 + 800;

    expect(data.positions).toBeInstanceOf(Float32Array);
    expect(data.positions.length).toBe(total * 3);

    expect(data.sizes).toBeInstanceOf(Float32Array);
    expect(data.sizes.length).toBe(total);

    expect(data.colors).toBeInstanceOf(Float32Array);
    expect(data.colors.length).toBe(total * 3);

    expect(data.opacities).toBeInstanceOf(Float32Array);
    expect(data.opacities.length).toBe(total);

    expect(data.orbitalSpeeds).toBeInstanceOf(Float32Array);
    expect(data.orbitalSpeeds.length).toBe(total);

    expect(data.totalCount).toBe(total);
    expect(data.interactiveCount).toBe(200 + 500);
  });

  it('distributes particles in a flattened disc (Z values smaller than XY)', () => {
    const data = generateGalaxyData(defaultConfig);
    let sumAbsZ = 0;
    let sumAbsXY = 0;
    const total = data.totalCount;

    for (let i = 0; i < total; i++) {
      sumAbsXY +=
        Math.abs(data.positions[i * 3]!) + Math.abs(data.positions[i * 3 + 1]!);
      sumAbsZ += Math.abs(data.positions[i * 3 + 2]!);
    }

    // Z spread should be significantly less than XY spread (flattened disc)
    expect(sumAbsZ / total).toBeLessThan(sumAbsXY / total);
  });

  it('core particles have larger sizes than dust particles', () => {
    const data = generateGalaxyData(defaultConfig);
    const coreAvgSize =
      Array.from(data.sizes.slice(0, 200)).reduce((a, b) => a + b, 0) / 200;
    const dustAvgSize =
      Array.from(data.sizes.slice(700, 1500)).reduce((a, b) => a + b, 0) / 800;

    expect(coreAvgSize).toBeGreaterThan(dustAvgSize);
  });

  it('returns home positions matching initial positions', () => {
    const data = generateGalaxyData(defaultConfig);
    expect(data.homePositions).toBeInstanceOf(Float32Array);
    expect(data.homePositions.length).toBe(data.positions.length);
    // Home positions should be a copy, not the same reference
    expect(data.homePositions).not.toBe(data.positions);
    expect(data.homePositions[0]).toBe(data.positions[0]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/galaxyData.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
// src/lib/galaxyData.ts
import * as THREE from 'three';

export interface GalaxyConfig {
  readonly core: number;
  readonly mid: number;
  readonly dust: number;
}

export interface GalaxyData {
  readonly positions: Float32Array;
  readonly homePositions: Float32Array;
  readonly sizes: Float32Array;
  readonly colors: Float32Array;
  readonly opacities: Float32Array;
  readonly orbitalSpeeds: Float32Array;
  readonly totalCount: number;
  readonly interactiveCount: number;
}

// Mocha palette hex values from design tokens
const COLORS = {
  core: [
    new THREE.Color('#d4c4b0'), // mocha-300
    new THREE.Color('#bfa58a'), // mocha-400
  ],
  mid: [new THREE.Color('#a47864')], // mocha-500
  dust: [
    new THREE.Color('#8f6451'), // mocha-600
    new THREE.Color('#755143'), // mocha-700
  ],
} as const;

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function generateTierParticles(
  positions: Float32Array,
  sizes: Float32Array,
  colors: Float32Array,
  opacities: Float32Array,
  orbitalSpeeds: Float32Array,
  startIndex: number,
  count: number,
  config: {
    radiusMin: number;
    radiusMax: number;
    zSpread: number;
    sizeMin: number;
    sizeMax: number;
    opacity: number;
    colorOptions: readonly THREE.Color[];
    orbitalSpeedRange: [number, number];
  }
): void {
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;

    // Disc distribution: radius in XY plane, thin Z
    const angle = Math.random() * Math.PI * 2;
    const radius = randomInRange(config.radiusMin, config.radiusMax);
    // Spiral arm offset
    const spiralAngle = angle + radius * 0.3;

    positions[idx * 3] = Math.cos(spiralAngle) * radius;
    positions[idx * 3 + 1] = Math.sin(spiralAngle) * radius;
    positions[idx * 3 + 2] = randomInRange(-config.zSpread, config.zSpread);

    sizes[idx] = randomInRange(config.sizeMin, config.sizeMax);

    const color = pickRandom(config.colorOptions);
    colors[idx * 3] = color.r;
    colors[idx * 3 + 1] = color.g;
    colors[idx * 3 + 2] = color.b;

    opacities[idx] = config.opacity * randomInRange(0.6, 1.0);
    orbitalSpeeds[idx] = randomInRange(...config.orbitalSpeedRange);
  }
}

export function generateGalaxyData(config: GalaxyConfig): GalaxyData {
  const total = config.core + config.mid + config.dust;

  const positions = new Float32Array(total * 3);
  const sizes = new Float32Array(total);
  const colors = new Float32Array(total * 3);
  const opacities = new Float32Array(total);
  const orbitalSpeeds = new Float32Array(total);

  // Core particles: dense center, large, bright
  generateTierParticles(
    positions,
    sizes,
    colors,
    opacities,
    orbitalSpeeds,
    0,
    config.core,
    {
      radiusMin: 0.2,
      radiusMax: 3.0,
      zSpread: 0.3,
      sizeMin: 0.06,
      sizeMax: 0.1,
      opacity: 0.8,
      colorOptions: COLORS.core,
      orbitalSpeedRange: [0.02, 0.06],
    }
  );

  // Mid particles: main body
  generateTierParticles(
    positions,
    sizes,
    colors,
    opacities,
    orbitalSpeeds,
    config.core,
    config.mid,
    {
      radiusMin: 1.5,
      radiusMax: 7.0,
      zSpread: 0.8,
      sizeMin: 0.03,
      sizeMax: 0.05,
      opacity: 0.6,
      colorOptions: COLORS.mid,
      orbitalSpeedRange: [0.01, 0.04],
    }
  );

  // Dust particles: ambient, tiny, dim
  generateTierParticles(
    positions,
    sizes,
    colors,
    opacities,
    orbitalSpeeds,
    config.core + config.mid,
    config.dust,
    {
      radiusMin: 3.0,
      radiusMax: 12.0,
      zSpread: 1.5,
      sizeMin: 0.01,
      sizeMax: 0.02,
      opacity: 0.3,
      colorOptions: COLORS.dust,
      orbitalSpeedRange: [0.005, 0.02],
    }
  );

  const homePositions = new Float32Array(positions);

  return {
    positions,
    homePositions,
    sizes,
    colors,
    opacities,
    orbitalSpeeds,
    totalCount: total,
    interactiveCount: config.core + config.mid,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/galaxyData.test.ts`
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add src/lib/galaxyData.ts src/lib/galaxyData.test.ts
git commit -m "feat: add galaxy data generator with tiered particle distribution"
```

---

## Task 4: Create useParticleForces Hook

Creates the hook that manages per-frame physics: cursor gravity field, orbital motion, velocity damping, and homing force.

**Files:**

- Create: `src/hooks/useParticleForces.ts`
- Test: `src/hooks/useParticleForces.test.ts`

**Step 1: Write the failing test**

```typescript
// src/hooks/useParticleForces.test.ts
import { describe, it, expect } from 'vitest';
import {
  applyGravityForce,
  applyOrbitalMotion,
  applyDamping,
  applyHomingForce,
} from '../hooks/useParticleForces';

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
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useParticleForces.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
// src/hooks/useParticleForces.ts
'use client';

import { useCallback, useRef } from 'react';
import * as THREE from 'three';

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

  velocities[i3] += (dx / dist) * forceMag * deltaTime * direction;
  velocities[i3 + 1] += (dy / dist) * forceMag * deltaTime * direction;
  velocities[i3 + 2] += (dz / dist) * forceMag * deltaTime * direction;
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
  velocities[i3] *= factor;
  velocities[i3 + 1] *= factor;
  velocities[i3 + 2] *= factor;
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
  velocities[i3] += (homePositions[i3]! - positions[i3]!) * strength;
  velocities[i3 + 1] +=
    (homePositions[i3 + 1]! - positions[i3 + 1]!) * strength;
  velocities[i3 + 2] +=
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
        positions[i3] += velocities[i3]!;
        positions[i3 + 1] += velocities[i3 + 1]!;
        positions[i3 + 2] += velocities[i3 + 2]!;

        // Damping
        applyDamping(velocities, i, 0.96);
      }
    },
    [totalCount]
  );

  return { updateParticles };
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useParticleForces.test.ts`
Expected: PASS (5 tests)

**Step 5: Commit**

```bash
git add src/hooks/useParticleForces.ts src/hooks/useParticleForces.test.ts
git commit -m "feat: add useParticleForces hook with gravity, orbital, and homing physics"
```

---

## Task 5: Create ConnectionLines Component

Creates the R3F component that renders dynamic connection lines between nearby particles using the spatial hash.

**Files:**

- Create: `src/components/three/ConnectionLines.tsx`

**Context:** This component runs inside an R3F `<Canvas>`, so it uses Three.js primitives directly. It cannot easily be unit-tested with JSDOM (no WebGL context). We'll verify it visually in Task 7 and via E2E tests.

**Step 1: Write the component**

```tsx
// src/components/three/ConnectionLines.tsx
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
```

**Step 2: Commit**

```bash
git add src/components/three/ConnectionLines.tsx
git commit -m "feat: add ConnectionLines component with spatial hash neighbor detection"
```

---

## Task 6: Create ParticleGalaxy Component

Creates the main R3F component that replaces `ParticleSystem.tsx`. Orchestrates galaxy data, shaders, forces, and connection lines.

**Files:**

- Create: `src/components/three/ParticleGalaxy.tsx`
- Modify: `src/components/three/index.ts` — add export

**Step 1: Write the component**

```tsx
// src/components/three/ParticleGalaxy.tsx
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
```

**Step 2: Update barrel export**

Modify `src/components/three/index.ts`:

```typescript
export { HeroBackground3D } from './HeroBackground3D';
export { LazyHeroBackground3D } from './LazyHeroBackground3D';
export { ParticleGalaxy } from './ParticleGalaxy';
```

**Step 3: Commit**

```bash
git add src/components/three/ParticleGalaxy.tsx src/components/three/index.ts
git commit -m "feat: add ParticleGalaxy component with shaders, physics, and connections"
```

---

## Task 7: Integrate into HeroBackground and Add Mobile Degradation

Swaps `ParticleSystem` for `ParticleGalaxy` in `HeroBackground.tsx`, adjusts SunsetCodeRain opacity, and adds responsive config based on viewport width.

**Files:**

- Modify: `src/components/sections/HeroBackground.tsx`
- Delete: `src/components/three/ParticleSystem.tsx` (after verifying integration works)

**Step 1: Update HeroBackground**

Replace the current `HeroBackground.tsx` with:

```tsx
// src/components/sections/HeroBackground.tsx
'use client';

import * as React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { SunsetCodeRainBackground } from '@/components/ui/backgrounds';
import { Canvas } from '@react-three/fiber';
import { ParticleGalaxy } from '@/components/three/ParticleGalaxy';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { GalaxyConfig } from '@/lib/galaxyData';

interface HeroBackgroundProps {
  heroY: MotionValue<number>;
  mousePosition: { x: number; y: number };
}

// Responsive galaxy configurations per design doc
const DESKTOP_CONFIG: GalaxyConfig = { core: 200, mid: 500, dust: 800 };
const TABLET_CONFIG: GalaxyConfig = { core: 100, mid: 300, dust: 400 };
const MOBILE_CONFIG: GalaxyConfig = { core: 50, mid: 200, dust: 250 };

export const HeroBackground = React.memo(function HeroBackground({
  heroY,
  mousePosition,
}: HeroBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const galaxyConfig = isMobile
    ? MOBILE_CONFIG
    : isTablet
      ? TABLET_CONFIG
      : DESKTOP_CONFIG;

  const showConnections = !isMobile;
  const maxConnections = isTablet ? 150 : 300;

  return (
    <motion.div
      style={{ y: heroY }}
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-50 dark:opacity-40">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
            <React.Suspense fallback={null}>
              <ParticleGalaxy
                mousePosition={mousePosition}
                config={galaxyConfig}
                showConnections={showConnections}
                maxConnections={maxConnections}
              />
            </React.Suspense>
          </Canvas>
        </div>
      )}
      <div className="absolute inset-0 opacity-40">
        <SunsetCodeRainBackground columns={16} rainOpacity={0.3} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
    </motion.div>
  );
});

HeroBackground.displayName = 'HeroBackground';
```

Key changes:

- Import `ParticleGalaxy` instead of `ParticleSystem`
- Add responsive config with `useMediaQuery`
- Disable connections on mobile
- Reduce SunsetCodeRain opacity from `opacity-60` to `opacity-40`

**Step 2: Run type-check**

Run: `npm run type-check`
Expected: PASS with no errors

**Step 3: Run dev server and visually verify**

Run: `npm run dev`
Open: `http://localhost:3000`
Verify:

- Galaxy particles visible in hero background
- Particles distributed in disc/spiral shape (not snow-like sphere)
- Mouse attracts particles on hover
- Click/hold repels particles
- Connection lines visible between nearby particles (desktop)
- No console errors

**Step 4: Delete old ParticleSystem**

Run: `rm src/components/three/ParticleSystem.tsx`

Verify no other imports reference it:
Run: `grep -r "ParticleSystem" src/ --include="*.tsx" --include="*.ts"`
Expected: No results (only references should be in the deleted file)

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: integrate ParticleGalaxy into HeroBackground with mobile degradation

Replace snow-like particle sphere with interactive galaxy.
Add responsive configs for desktop/tablet/mobile.
Reduce SunsetCodeRain opacity to 40% to avoid competing.
Remove old ParticleSystem component."
```

---

## Task 8: Performance Validation

Verify the animation runs at 60fps on desktop and degrades gracefully.

**Step 1: Check FPS in Chrome DevTools**

Open: `http://localhost:3000`
DevTools → Performance → Record 5 seconds → check frame rate
Expected: Consistent 60fps on desktop

**Step 2: Test mobile degradation**

DevTools → Toggle Device Toolbar → iPhone SE (375px)
Verify:

- Fewer particles visible
- No connection lines
- No cursor interaction
- Page still loads fast

**Step 3: Test reduced motion**

DevTools → Rendering → Enable "prefers-reduced-motion: reduce"
Verify: No canvas rendered, only code rain and gradient

**Step 4: Run Lighthouse**

DevTools → Lighthouse → Performance audit
Expected: Performance score > 90

**Step 5: Commit any fixes**

If performance issues found, adjust particle counts or disable features. Commit fixes.

---

## Task 9: Run Full Quality Checks

Run the entire quality pipeline to ensure nothing is broken.

**Step 1: Run type-check**

Run: `npm run type-check`
Expected: PASS

**Step 2: Run linter**

Run: `npm run lint:strict`
Expected: PASS

**Step 3: Run formatter check**

Run: `npm run format:check`
Expected: PASS (or run `npm run format` first)

**Step 4: Run tests**

Run: `npm test`
Expected: All 494+ tests pass (plus our new tests)

**Step 5: Run full check**

Run: `npm run check`
Expected: PASS

**Step 6: Final commit if formatting/lint changes needed**

```bash
git add -A
git commit -m "chore: fix lint and formatting for galaxy particle system"
```
