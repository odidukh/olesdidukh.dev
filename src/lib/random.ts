/**
 * Seeded pseudo-random number generator utilities
 *
 * These utilities provide deterministic random number generation
 * to avoid React hydration mismatches between server and client renders.
 *
 * The algorithm uses a Linear Congruential Generator (LCG) which produces
 * consistent sequences given the same seed value.
 */

/**
 * Creates a seeded random number generator function.
 * Uses Linear Congruential Generator (LCG) algorithm for deterministic results.
 *
 * @param seed - Initial seed value (should be a positive integer)
 * @returns A function that returns a pseudo-random number between 0 and 1
 *
 * @example
 * const random = createSeededRandom(42);
 * console.log(random()); // Always produces the same sequence given seed 42
 * console.log(random());
 */
export function createSeededRandom(seed: number): () => number {
  let currentSeed = seed;
  return () => {
    // LCG parameters (same as glibc)
    currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
    return currentSeed / 0x7fffffff;
  };
}

/**
 * Generates a single pseudo-random number from a seed.
 * Useful for one-off random values that need to be deterministic.
 *
 * @param seed - Seed value for the random number
 * @returns A pseudo-random number between 0 and 1
 *
 * @example
 * const value = seededRandom(123); // Always returns the same value for seed 123
 */
export function seededRandom(seed: number): number {
  const nextSeed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return nextSeed / 0x7fffffff;
}

/**
 * Generates an array of items using a seeded random generator.
 * Useful for pre-computing particle positions, animation parameters, etc.
 *
 * @param count - Number of items to generate
 * @param seed - Initial seed value
 * @param generator - Function that creates each item using the random generator
 * @returns Array of generated items
 *
 * @example
 * const particles = generateRandomArray(30, 42, (random) => ({
 *   x: random() * 100,
 *   y: random() * 100,
 *   duration: random() * 5 + 2,
 * }));
 */
export function generateRandomArray<T>(
  count: number,
  seed: number,
  generator: (random: () => number, index: number) => T
): T[] {
  const random = createSeededRandom(seed);
  return Array.from({ length: count }, (_, index) => generator(random, index));
}

/**
 * Pre-generates particle data for background animations.
 * Common utility for particle-based backgrounds that need consistent SSR/client renders.
 *
 * @param count - Number of particles to generate
 * @param seed - Seed for deterministic generation (default: 42)
 * @returns Array of particle data with position, duration, and delay
 *
 * @example
 * const particles = generateParticleData(50);
 * // Use in component without hydration mismatch
 */
export function generateParticleData(
  count: number,
  seed: number = 42
): Array<{
  left: number;
  top: number;
  duration: number;
  delay: number;
}> {
  const random = createSeededRandom(seed);
  return Array.from({ length: count }, () => ({
    left: random() * 100,
    top: random() * 100,
    duration: random() * 3 + 2,
    delay: random() * 2,
  }));
}

/**
 * Selects a random item from an array using a seeded generator.
 *
 * @param array - Array to select from
 * @param random - Seeded random generator function
 * @returns A randomly selected item from the array
 *
 * @example
 * const random = createSeededRandom(42);
 * const keywords = ['const', 'let', 'var'];
 * const selected = selectRandom(keywords, random);
 */
export function selectRandom<T>(array: readonly T[], random: () => number): T {
  const index = Math.floor(random() * array.length);
  return array[index] as T;
}
