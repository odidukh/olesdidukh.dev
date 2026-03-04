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
