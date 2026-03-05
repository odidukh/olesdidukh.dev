'use client';

import * as React from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// --- Types ---

interface FloatingGeometryProps {
  readonly mousePosition: { x: number; y: number };
  readonly shapeCount?: 'small' | 'medium' | 'large';
  readonly isDark?: boolean;
}

type GeometricType =
  | 'octahedron'
  | 'dodecahedron'
  | 'icosahedron'
  | 'tetrahedron'
  | 'torus'
  | 'box';

type SymbolType =
  | 'angleBrackets'
  | 'curlyBraces'
  | 'hash'
  | 'arrowFunction'
  | 'squareBrackets'
  | 'commentSlashes';

type ShapeTier = 'core' | 'extended' | 'wide';
type ColorKey = keyof typeof DARK_COLORS;

interface ShapeConfigBase {
  readonly colorKey: ColorKey;
  readonly position: readonly [number, number, number];
  readonly scale: number;
  readonly rotationSpeed: readonly [number, number, number];
  readonly floatSpeed: number;
  readonly floatIntensity: number;
  readonly depthLayer: 0 | 1 | 2;
  readonly tier: ShapeTier;
}

interface GeometricShapeConfig extends ShapeConfigBase {
  readonly kind: 'geometric';
  readonly geometry: GeometricType;
}

interface SymbolShapeConfig extends ShapeConfigBase {
  readonly kind: 'symbol';
  readonly symbol: SymbolType;
}

type ShapeConfig = GeometricShapeConfig | SymbolShapeConfig;

// --- Theme color palettes ---

const DARK_COLORS = {
  mocha300: '#d4c4b0',
  mocha400: '#bfa58a',
  mocha500: '#a47864',
  navy: '#1e3a5f',
  cream: '#f5ede4',
} as const;

const LIGHT_COLORS = {
  mocha300: '#6b5040',
  mocha400: '#5a3d2a',
  mocha500: '#4a2e1c',
  navy: '#122845',
  cream: '#7a6350',
} as const;

// --- Code symbol shape builders (3D extruded paths) ---

const EXTRUDE_SETTINGS: THREE.ExtrudeGeometryOptions = {
  depth: 0.15,
  bevelEnabled: false,
};

function createAngleBracketShape(): THREE.Shape {
  const t = 0.08;
  const shape = new THREE.Shape();
  shape.moveTo(-0.6, 0);
  shape.lineTo(-0.2, 0.5);
  shape.lineTo(-0.2 + t, 0.5 - t);
  shape.lineTo(-0.6 + t * 2, 0);
  shape.lineTo(-0.2 + t, -0.5 + t);
  shape.lineTo(-0.2, -0.5);
  shape.closePath();
  return shape;
}

function createAngleBracketRightShape(): THREE.Shape {
  const t = 0.08;
  const shape = new THREE.Shape();
  shape.moveTo(0.6, 0);
  shape.lineTo(0.2, 0.5);
  shape.lineTo(0.2 - t, 0.5 - t);
  shape.lineTo(0.6 - t * 2, 0);
  shape.lineTo(0.2 - t, -0.5 + t);
  shape.lineTo(0.2, -0.5);
  shape.closePath();
  return shape;
}

function createSlashShape(): THREE.Shape {
  const t = 0.06;
  const shape = new THREE.Shape();
  shape.moveTo(-t, -0.4);
  shape.lineTo(t, -0.4);
  shape.lineTo(0.15 + t, 0.4);
  shape.lineTo(0.15 - t, 0.4);
  shape.closePath();
  return shape;
}

function createCurlyBraceLeftShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0.15, 0.5);
  shape.lineTo(0.05, 0.45);
  shape.lineTo(0.0, 0.3);
  shape.lineTo(0.0, 0.1);
  shape.lineTo(-0.1, 0.0);
  shape.lineTo(0.0, -0.1);
  shape.lineTo(0.0, -0.3);
  shape.lineTo(0.05, -0.45);
  shape.lineTo(0.15, -0.5);
  shape.lineTo(0.1, -0.42);
  shape.lineTo(0.07, -0.3);
  shape.lineTo(0.07, -0.12);
  shape.lineTo(-0.03, 0.0);
  shape.lineTo(0.07, 0.12);
  shape.lineTo(0.07, 0.3);
  shape.lineTo(0.1, 0.42);
  shape.closePath();
  return shape;
}

function createCurlyBraceRightShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-0.15, 0.5);
  shape.lineTo(-0.05, 0.45);
  shape.lineTo(0.0, 0.3);
  shape.lineTo(0.0, 0.1);
  shape.lineTo(0.1, 0.0);
  shape.lineTo(0.0, -0.1);
  shape.lineTo(0.0, -0.3);
  shape.lineTo(-0.05, -0.45);
  shape.lineTo(-0.15, -0.5);
  shape.lineTo(-0.1, -0.42);
  shape.lineTo(-0.07, -0.3);
  shape.lineTo(-0.07, -0.12);
  shape.lineTo(0.03, 0.0);
  shape.lineTo(-0.07, 0.12);
  shape.lineTo(-0.07, 0.3);
  shape.lineTo(-0.1, 0.42);
  shape.closePath();
  return shape;
}

function createHashShapes(): THREE.Shape[] {
  const t = 0.05;
  const shapes: THREE.Shape[] = [];
  for (const x of [-0.15, 0.15]) {
    const s = new THREE.Shape();
    s.moveTo(x - t + 0.03, -0.4);
    s.lineTo(x + t + 0.03, -0.4);
    s.lineTo(x + t - 0.03, 0.4);
    s.lineTo(x - t - 0.03, 0.4);
    s.closePath();
    shapes.push(s);
  }
  for (const y of [-0.12, 0.12]) {
    const s = new THREE.Shape();
    s.moveTo(-0.35, y - t);
    s.lineTo(0.35, y - t);
    s.lineTo(0.35, y + t);
    s.lineTo(-0.35, y + t);
    s.closePath();
    shapes.push(s);
  }
  return shapes;
}

function createArrowFunctionShapes(): THREE.Shape[] {
  const t = 0.06;
  const shapes: THREE.Shape[] = [];
  for (const y of [0.08, -0.08]) {
    const s = new THREE.Shape();
    s.moveTo(-0.35, y - t);
    s.lineTo(0.0, y - t);
    s.lineTo(0.0, y + t);
    s.lineTo(-0.35, y + t);
    s.closePath();
    shapes.push(s);
  }
  const gt = new THREE.Shape();
  gt.moveTo(0.35, 0);
  gt.lineTo(0.1, 0.25);
  gt.lineTo(0.1 - t, 0.25 - t);
  gt.lineTo(0.35 - t * 2, 0);
  gt.lineTo(0.1 - t, -0.25 + t);
  gt.lineTo(0.1, -0.25);
  gt.closePath();
  shapes.push(gt);
  return shapes;
}

function createSquareBracketShapes(): THREE.Shape[] {
  const t = 0.06;
  const shapes: THREE.Shape[] = [];
  const left = new THREE.Shape();
  left.moveTo(-0.35, 0.4);
  left.lineTo(-0.15, 0.4);
  left.lineTo(-0.15, 0.4 - t);
  left.lineTo(-0.35 + t, 0.4 - t);
  left.lineTo(-0.35 + t, -0.4 + t);
  left.lineTo(-0.15, -0.4 + t);
  left.lineTo(-0.15, -0.4);
  left.lineTo(-0.35, -0.4);
  left.closePath();
  shapes.push(left);
  const right = new THREE.Shape();
  right.moveTo(0.35, 0.4);
  right.lineTo(0.15, 0.4);
  right.lineTo(0.15, 0.4 - t);
  right.lineTo(0.35 - t, 0.4 - t);
  right.lineTo(0.35 - t, -0.4 + t);
  right.lineTo(0.15, -0.4 + t);
  right.lineTo(0.15, -0.4);
  right.lineTo(0.35, -0.4);
  right.closePath();
  shapes.push(right);
  return shapes;
}

function createCommentSlashShapes(): THREE.Shape[] {
  const t = 0.06;
  const shapes: THREE.Shape[] = [];
  for (const xOffset of [-0.12, 0.12]) {
    const s = new THREE.Shape();
    s.moveTo(xOffset - t, -0.35);
    s.lineTo(xOffset + t, -0.35);
    s.lineTo(xOffset + 0.15 + t, 0.35);
    s.lineTo(xOffset + 0.15 - t, 0.35);
    s.closePath();
    shapes.push(s);
  }
  return shapes;
}

// --- Build EdgesGeometry for each symbol type ---
// EdgesGeometry strips internal triangulation, keeping only outline edges.

const EDGE_THRESHOLD_ANGLE = 15;

function buildSymbolEdges(symbol: SymbolType): THREE.EdgesGeometry {
  let extruded: THREE.ExtrudeGeometry;

  switch (symbol) {
    case 'angleBrackets':
      extruded = new THREE.ExtrudeGeometry(
        [
          createAngleBracketShape(),
          createSlashShape(),
          createAngleBracketRightShape(),
        ],
        EXTRUDE_SETTINGS
      );
      return new THREE.EdgesGeometry(extruded, EDGE_THRESHOLD_ANGLE);

    case 'curlyBraces': {
      // Build left + right as a single merged geometry
      const leftGeom = new THREE.ExtrudeGeometry(
        [createCurlyBraceLeftShape()],
        EXTRUDE_SETTINGS
      );
      leftGeom.translate(-0.2, 0, 0);
      const rightGeom = new THREE.ExtrudeGeometry(
        [createCurlyBraceRightShape()],
        EXTRUDE_SETTINGS
      );
      rightGeom.translate(0.2, 0, 0);
      const merged = mergeBufferGeometries(leftGeom, rightGeom);
      return new THREE.EdgesGeometry(merged, EDGE_THRESHOLD_ANGLE);
    }

    case 'hash':
      extruded = new THREE.ExtrudeGeometry(
        createHashShapes(),
        EXTRUDE_SETTINGS
      );
      return new THREE.EdgesGeometry(extruded, EDGE_THRESHOLD_ANGLE);

    case 'arrowFunction':
      extruded = new THREE.ExtrudeGeometry(
        createArrowFunctionShapes(),
        EXTRUDE_SETTINGS
      );
      return new THREE.EdgesGeometry(extruded, EDGE_THRESHOLD_ANGLE);

    case 'squareBrackets':
      extruded = new THREE.ExtrudeGeometry(
        createSquareBracketShapes(),
        EXTRUDE_SETTINGS
      );
      return new THREE.EdgesGeometry(extruded, EDGE_THRESHOLD_ANGLE);

    case 'commentSlashes':
      extruded = new THREE.ExtrudeGeometry(
        createCommentSlashShapes(),
        EXTRUDE_SETTINGS
      );
      return new THREE.EdgesGeometry(extruded, EDGE_THRESHOLD_ANGLE);
  }
}

function mergeBufferGeometries(
  a: THREE.BufferGeometry,
  b: THREE.BufferGeometry
): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry();
  const posA = a.getAttribute('position') as THREE.BufferAttribute;
  const posB = b.getAttribute('position') as THREE.BufferAttribute;
  const positions = new Float32Array(posA.count * 3 + posB.count * 3);
  positions.set(posA.array as Float32Array, 0);
  positions.set(posB.array as Float32Array, posA.count * 3);
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  if (a.index && b.index) {
    const idxA = a.index.array as Uint16Array;
    const idxB = b.index.array as Uint16Array;
    const indices = new Uint32Array(idxA.length + idxB.length);
    indices.set(idxA, 0);
    for (let i = 0; i < idxB.length; i++) {
      indices[idxA.length + i] = idxB[i]! + posA.count;
    }
    merged.setIndex(new THREE.BufferAttribute(indices, 1));
  }

  merged.computeVertexNormals();
  return merged;
}

// --- Shape configurations (14 total across 3 tiers) ---

// Positions computed on a screen-space grid (5 cols × 3 rows, ~3 unit gap)
// then projected back to world coords: world = screen * (6 - z) / 6
// Camera at z=6, fov=60. No two shapes overlap after projection.

const ALL_SHAPES: readonly ShapeConfig[] = [
  // ─── CORE (5 shapes, always shown) ──────────────────────────
  // Screen grid: (0,2.5) (3,0.5) (-5,-1.5) (0,-2.5) (-3,0)

  {
    kind: 'symbol',
    symbol: 'angleBrackets',
    colorKey: 'mocha300',
    position: [0, 2.9, -1],
    scale: 1.6,
    rotationSpeed: [0.002, 0.004, 0.001],
    floatSpeed: 1.0,
    floatIntensity: 0.8,
    depthLayer: 1,
    tier: 'core',
  },
  {
    kind: 'geometric',
    geometry: 'octahedron',
    colorKey: 'mocha400',
    position: [3, 0.5, 0],
    scale: 1.0,
    rotationSpeed: [0.003, 0.005, 0.002],
    floatSpeed: 1.2,
    floatIntensity: 0.6,
    depthLayer: 2,
    tier: 'core',
  },
  {
    kind: 'symbol',
    symbol: 'curlyBraces',
    colorKey: 'mocha400',
    position: [-8.3, -2.5, -4],
    scale: 2.0,
    rotationSpeed: [0.001, 0.003, 0.002],
    floatSpeed: 0.8,
    floatIntensity: 0.4,
    depthLayer: 0,
    tier: 'core',
  },
  {
    kind: 'geometric',
    geometry: 'dodecahedron',
    colorKey: 'navy',
    position: [0, -4.6, -5],
    scale: 1.0,
    rotationSpeed: [0.002, 0.004, 0.001],
    floatSpeed: 0.9,
    floatIntensity: 0.5,
    depthLayer: 0,
    tier: 'core',
  },
  {
    kind: 'symbol',
    symbol: 'hash',
    colorKey: 'cream',
    position: [-2.8, 0, 0.5],
    scale: 1.4,
    rotationSpeed: [0.003, 0.005, 0.002],
    floatSpeed: 2.0,
    floatIntensity: 1.0,
    depthLayer: 2,
    tier: 'core',
  },

  // ─── EXTENDED (4 shapes, tablet+) ──────────────────────────
  // Screen grid: (-3,-2.5) (-3,2.5) (3,-2.5) (3,2.5)

  {
    kind: 'symbol',
    symbol: 'arrowFunction',
    colorKey: 'mocha500',
    position: [-4, -3.3, -2],
    scale: 1.5,
    rotationSpeed: [0.002, 0.003, 0.004],
    floatSpeed: 1.5,
    floatIntensity: 0.8,
    depthLayer: 1,
    tier: 'extended',
  },
  {
    kind: 'symbol',
    symbol: 'squareBrackets',
    colorKey: 'mocha300',
    position: [-3.5, 2.9, -1],
    scale: 1.5,
    rotationSpeed: [0.002, 0.004, 0.001],
    floatSpeed: 0.9,
    floatIntensity: 0.5,
    depthLayer: 1,
    tier: 'extended',
  },
  {
    kind: 'geometric',
    geometry: 'icosahedron',
    colorKey: 'mocha500',
    position: [4.5, -3.8, -3],
    scale: 0.9,
    rotationSpeed: [0.004, 0.002, 0.003],
    floatSpeed: 1.3,
    floatIntensity: 0.7,
    depthLayer: 1,
    tier: 'extended',
  },
  {
    kind: 'geometric',
    geometry: 'tetrahedron',
    colorKey: 'cream',
    position: [4.5, 3.8, -3],
    scale: 0.8,
    rotationSpeed: [0.003, 0.002, 0.005],
    floatSpeed: 1.4,
    floatIntensity: 0.6,
    depthLayer: 0,
    tier: 'extended',
  },

  // ─── WIDE (5 shapes, desktop+, far edges) ──────────────────
  // Screen grid: (-6,2) (6,0.5) (6,-2) (-6,0) (6,2.5)

  {
    kind: 'geometric',
    geometry: 'torus',
    colorKey: 'mocha400',
    position: [-10, 2.8, -5],
    scale: 0.9,
    rotationSpeed: [0.002, 0.004, 0.001],
    floatSpeed: 0.7,
    floatIntensity: 0.3,
    depthLayer: 0,
    tier: 'wide',
  },
  {
    kind: 'symbol',
    symbol: 'commentSlashes',
    colorKey: 'navy',
    position: [6, 0.5, 0],
    scale: 1.3,
    rotationSpeed: [0.004, 0.002, 0.003],
    floatSpeed: 1.3,
    floatIntensity: 0.9,
    depthLayer: 2,
    tier: 'wide',
  },
  {
    kind: 'geometric',
    geometry: 'box',
    colorKey: 'mocha300',
    position: [12, -4, -6],
    scale: 0.8,
    rotationSpeed: [0.003, 0.002, 0.004],
    floatSpeed: 0.6,
    floatIntensity: 0.3,
    depthLayer: 0,
    tier: 'wide',
  },
  {
    kind: 'geometric',
    geometry: 'octahedron',
    colorKey: 'navy',
    position: [-10, 0, -4],
    scale: 0.6,
    rotationSpeed: [0.005, 0.003, 0.002],
    floatSpeed: 1.0,
    floatIntensity: 0.4,
    depthLayer: 0,
    tier: 'wide',
  },
  {
    kind: 'geometric',
    geometry: 'dodecahedron',
    colorKey: 'mocha500',
    position: [11, 4.6, -5],
    scale: 0.5,
    rotationSpeed: [0.004, 0.003, 0.005],
    floatSpeed: 1.1,
    floatIntensity: 0.5,
    depthLayer: 0,
    tier: 'wide',
  },
];

function getShapesForTier(
  tier: 'small' | 'medium' | 'large'
): readonly ShapeConfig[] {
  switch (tier) {
    case 'small':
      return ALL_SHAPES.filter(s => s.tier === 'core');
    case 'medium':
      return ALL_SHAPES.filter(s => s.tier === 'core' || s.tier === 'extended');
    case 'large':
      return ALL_SHAPES;
  }
}

const PARALLAX_FACTORS = [0.02, 0.05, 0.1] as const;

// --- Render components ---

function GeometricMesh({
  type,
  color,
  opacity,
}: {
  readonly type: GeometricType;
  readonly color: string;
  readonly opacity: number;
}) {
  const geometryNode = (() => {
    switch (type) {
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1, 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1, 0]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.3, 8, 16]} />;
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
    }
  })();

  return (
    <mesh>
      {geometryNode}
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function SymbolEdgesMesh({
  symbol,
  color,
  opacity,
}: {
  readonly symbol: SymbolType;
  readonly color: string;
  readonly opacity: number;
}) {
  const edges = useMemo(() => buildSymbolEdges(symbol), [symbol]);

  return (
    <lineSegments geometry={edges}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

function FloatingShape({
  config,
  isDark,
}: {
  readonly config: ShapeConfig;
  readonly isDark: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const palette = isDark ? DARK_COLORS : LIGHT_COLORS;
  const color = palette[config.colorKey];
  const opacity = isDark ? 0.7 : 0.55;

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x += config.rotationSpeed[0];
    groupRef.current.rotation.y += config.rotationSpeed[1];
    groupRef.current.rotation.z += config.rotationSpeed[2];
  });

  return (
    <Float
      speed={config.floatSpeed}
      rotationIntensity={0}
      floatIntensity={config.floatIntensity}
      floatingRange={[-0.3, 0.3]}
    >
      <group
        ref={groupRef}
        position={[config.position[0], config.position[1], config.position[2]]}
        scale={config.scale}
      >
        {config.kind === 'symbol' ? (
          <SymbolEdgesMesh
            symbol={config.symbol}
            color={color}
            opacity={opacity}
          />
        ) : (
          <GeometricMesh
            type={config.geometry}
            color={color}
            opacity={opacity}
          />
        )}
      </group>
    </Float>
  );
}

function ParallaxLayer({
  children,
  mousePosition,
  factor,
}: {
  readonly children: React.ReactNode;
  readonly mousePosition: { x: number; y: number };
  readonly factor: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const targetX = (mousePosition.x - 0.5) * factor * 10;
    const targetY = -(mousePosition.y - 0.5) * factor * 10;
    group.position.x += (targetX - group.position.x) * 0.05;
    group.position.y += (targetY - group.position.y) * 0.05;
  });

  return <group ref={groupRef}>{children}</group>;
}

export function FloatingGeometry({
  mousePosition,
  shapeCount = 'large',
  isDark = true,
}: FloatingGeometryProps) {
  const shapes = useMemo(() => getShapesForTier(shapeCount), [shapeCount]);

  const layers: ShapeConfig[][] = [[], [], []];
  for (const shape of shapes) {
    layers[shape.depthLayer]!.push(shape);
  }

  return (
    <>
      {layers.map((layerShapes, layerIndex) => (
        <ParallaxLayer
          key={layerIndex}
          mousePosition={mousePosition}
          factor={PARALLAX_FACTORS[layerIndex]!}
        >
          {layerShapes.map((config, shapeIndex) => (
            <FloatingShape
              key={`${layerIndex}-${shapeIndex}`}
              config={config}
              isDark={isDark}
            />
          ))}
        </ParallaxLayer>
      ))}
    </>
  );
}
