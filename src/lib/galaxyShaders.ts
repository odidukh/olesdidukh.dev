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
