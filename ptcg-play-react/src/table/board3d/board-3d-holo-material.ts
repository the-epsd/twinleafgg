import { DoubleSide, ShaderMaterial, Texture } from 'three';

/** Full holo sweep duration (seconds). */
export const BOARD3D_HOLO_CYCLE_SEC = 2.75;

const holoVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const holoFragmentShader = `
precision mediump float;
uniform float uTime;
uniform sampler2D uMask;
varying vec2 vUv;

void main() {
  vec4 maskSample = texture2D(uMask, vUv);
  float m = max(maskSample.a, max(max(maskSample.r, maskSample.g), maskSample.b));
  if (m < 0.04) discard;

  // 110deg sweep axis — matches Angular/CSS linear-gradient(110deg, …).
  float ang = 1.91986;
  float c = cos(ang);
  float s = sin(ang);
  vec2 q = vUv - 0.5;
  float along = c * q.x + s * q.y;

  // One full pass; band starts fully off-screen and exits fully before looping.
  float t = fract(uTime / ${BOARD3D_HOLO_CYCLE_SEC.toFixed(2)});
  float bandCenter = mix(1.35, -1.35, t);
  float rel = along - bandCenter;

  // Wide stripe with soft leading/trailing falloff.
  float band = smoothstep(-0.56, -0.18, rel) * (1.0 - smoothstep(0.18, 0.56, rel));

  // Dimmer toward the top and bottom of the card; brightest through the middle.
  float verticalFade = 1.0 - smoothstep(0.22, 0.50, abs(q.y));

  vec3 col1 = vec3(0.573, 0.949, 0.949);
  vec3 col2 = vec3(1.0, 1.0, 1.0);
  vec3 col3 = vec3(0.839, 0.812, 0.945);
  vec3 holo = mix(col1, col2, band);
  holo = mix(holo, col3, band * 0.45);

  float alpha = 0.36 * m * band * verticalFade;
  gl_FragColor = vec4(holo, alpha);
}
`;

const registeredMaterials = new Set<ShaderMaterial>();

export function createBoard3dHoloMaterial(mask: Texture): ShaderMaterial {
  const mat = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMask: { value: mask },
    },
    vertexShader: holoVertexShader,
    fragmentShader: holoFragmentShader,
    transparent: true,
    depthWrite: false,
    /* Respect depth so other cards / drag overlays occlude holo (depthTest:false painted over everything). */
    depthTest: true,
    side: DoubleSide,
  });
  registeredMaterials.add(mat);
  return mat;
}

export function updateBoard3dHoloTime(timeSeconds: number): void {
  for (const m of registeredMaterials) {
    m.uniforms.uTime.value = timeSeconds;
  }
}

export function releaseBoard3dHoloMaterial(mat: ShaderMaterial): void {
  registeredMaterials.delete(mat);
  mat.dispose();
}
