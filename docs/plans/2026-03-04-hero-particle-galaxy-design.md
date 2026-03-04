# Hero Animation: Interactive Particle Galaxy with Connections

**Date:** 2026-03-04
**Status:** Approved
**Scope:** Replace `ParticleSystem.tsx` with interactive galaxy effect

## Problem

The current hero particle animation (2000 uniform points in a spherical distribution with slow rigid rotation) reads as "snow falling." It lacks depth, interactivity, and visual hierarchy.

## Solution

Replace the particle system with an **Interactive Particle Galaxy** — a flattened disc/spiral distribution with tiered particle sizes, cursor-responsive gravity fields, and dynamic connection lines between nearby particles.

## Visual Concept

### Galaxy Distribution

Particles arranged in a flattened disc/spiral with a denser core, replacing uniform sphere placement.

### Three Particle Tiers

| Tier | Count | Size      | Color                      | Purpose              |
| ---- | ----- | --------- | -------------------------- | -------------------- |
| Core | ~200  | 0.06-0.1  | mocha-300/400              | Bright galaxy center |
| Mid  | ~500  | 0.03-0.05 | mocha-500                  | Main body            |
| Dust | ~800  | 0.01-0.02 | mocha-600/700, low opacity | Ambient depth        |

### Connection Lines

- Thin glowing lines between mid/core particles within ~1.5 unit threshold
- Opacity fades with distance
- Color: `mocha-400` at 30% opacity
- Max ~300 connections rendered (performance cap)

## Interactivity

### Cursor Gravity Field

Mouse position projected into 3D space. Within ~3 unit radius:

- **Default (attract):** Particles drift toward cursor, orbiting with spring-like force
- **Click/hold (repel):** Particles pushed away, expanding ripple. Release triggers bounce-back

Force formula:

```
direction = particle_position - cursor_3d_position
distance = length(direction)
if distance < influence_radius:
    force = normalize(direction) * strength / (distance^2 + softening)
    velocity += force * deltaTime
```

### Orbital Motion

Each particle has individual orbital velocity around galaxy center (replacing rigid group rotation).

### Velocity Damping

0.96 damping per frame — particles settle back to orbital paths after cursor moves away.

### Scroll Parallax

Deeper particles (larger Z) move slower on scroll for 3D depth reinforcement.

## Technical Architecture

### Rendering

Custom GLSL shaders on `BufferGeometry` (not `Points` + `PointMaterial`):

- Per-particle velocity/force in vertex shader
- Connection lines via separate `LineSegments` geometry
- GPU-side size/color variation

### New Components

| Component              | Responsibility                                    |
| ---------------------- | ------------------------------------------------- |
| `ParticleGalaxy.tsx`   | Main R3F component, replaces `ParticleSystem.tsx` |
| `galaxyShaders.ts`     | GLSL vertex + fragment shaders                    |
| `useParticleForces.ts` | Hook: cursor force field, velocity buffer updates |
| `ConnectionLines.tsx`  | Spatial hash + line geometry for connections      |

### Per-Frame Data Flow

1. `useFrame` reads cursor position
2. Project cursor to 3D via camera unproject
3. Apply gravity force, orbital drift, damping → update position buffer
4. Spatial hash finds particle pairs within threshold → update line geometry
5. GPU renders both passes

## Mobile Degradation

| Viewport            | Particles           | Connections | Interactivity        | Code Rain          |
| ------------------- | ------------------- | ----------- | -------------------- | ------------------ |
| Desktop (>1024px)   | 1500                | 300 max     | Full gravity + click | Yes                |
| Tablet (768-1024px) | 800                 | 150 max     | Gravity only         | Yes, fewer columns |
| Mobile (<768px)     | 500                 | None        | None                 | Reduced            |
| Reduced motion      | 0 (static gradient) | None        | None                 | None               |

## Integration

`HeroBackground.tsx` keeps its 3-layer structure:

1. **Layer 1 (replaced):** `ParticleGalaxy` inside existing `<Canvas>` — replaces `ParticleSystem`
2. **Layer 2 (adjusted):** `SunsetCodeRainBackground` at reduced opacity (50% → 40%)
3. **Layer 3 (kept):** Gradient fade to background

`HeroSectionClient.tsx` unchanged — already tracks mouse position.

## Performance Budget

- Connection lines use spatial hash grid (O(n) vs O(n^2))
- Gravity uses inverse-square with softening to prevent infinite forces
- Desktop target: 60fps with 1500 particles + 300 connections
- Mobile: graceful degradation per table above

## Files Changed

- `src/components/three/ParticleSystem.tsx` → deleted (replaced by new components)
- `src/components/three/ParticleGalaxy.tsx` → new
- `src/components/three/ConnectionLines.tsx` → new
- `src/lib/galaxyShaders.ts` → new
- `src/hooks/useParticleForces.ts` → new
- `src/components/sections/HeroBackground.tsx` → updated imports + opacity adjustment
