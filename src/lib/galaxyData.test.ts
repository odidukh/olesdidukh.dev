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
