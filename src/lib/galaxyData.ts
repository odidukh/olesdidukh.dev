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
