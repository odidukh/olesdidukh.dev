interface Pair {
  readonly i: number;
  readonly j: number;
  readonly distSq: number;
}

interface Position {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export class SpatialHash {
  private readonly cellSize: number;
  private readonly inverseCellSize: number;
  private grid: Map<string, number[]>;
  private positions: Map<number, Position>;

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

        // Check same cell pairs
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
              const ncx = cx + dx;
              const ncy = cy + dy;
              const ncz = cz + dz;
              const neighborKey = `${ncx},${ncy},${ncz}`;
              const currentKey = `${cx},${cy},${cz}`;

              // Canonical pair key to avoid processing the same cell pair twice
              const pairKey =
                cx < ncx ||
                (cx === ncx && cy < ncy) ||
                (cx === ncx && cy === ncy && cz < ncz)
                  ? `${currentKey}|${neighborKey}`
                  : `${neighborKey}|${currentKey}`;

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

  private distanceSq(a: Position, b: Position): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  }
}
