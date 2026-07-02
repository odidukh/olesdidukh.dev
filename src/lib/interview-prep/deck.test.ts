import { describe, it, expect } from 'vitest';
import { shuffle, pickRandom } from './deck';

describe('deck util', () => {
  it('shuffle preserves length and membership', () => {
    const input = ['a', 'b', 'c', 'd'];
    const out = shuffle(input);
    expect(out).toHaveLength(4);
    expect([...out].sort()).toEqual(['a', 'b', 'c', 'd']);
    expect(input).toEqual(['a', 'b', 'c', 'd']); // input not mutated
  });

  it('pickRandom caps at count and never returns more than available', () => {
    expect(pickRandom(['a', 'b', 'c', 'd', 'e'], 3)).toHaveLength(3);
    expect(pickRandom(['a', 'b'], 5)).toHaveLength(2);
    expect(pickRandom(['a', 'b'], -1)).toHaveLength(0);
  });
});
