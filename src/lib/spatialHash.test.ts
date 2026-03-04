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
