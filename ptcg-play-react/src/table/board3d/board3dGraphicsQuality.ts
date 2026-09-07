import type { Board3dGraphicsTier } from '../../settings/settingsStorage';

export type Board3dGraphicsPreset = {
  /** Upper bound for R3F `dpr` (native display ratio on Highest). */
  dprCap: number;
  castShadow: boolean;
  shadowMapSize: number;
  /**
   * Texture anisotropy. `null` means use the GPU max from
   * `WebGLCapabilities.getMaxAnisotropy()`.
   */
  maxAnisotropy: number | null;
};

export type Board3dGraphicsTiersInput = {
  resolution: Board3dGraphicsTier;
  shadows: Board3dGraphicsTier;
  textures: Board3dGraphicsTier;
};

function resolveDprCap(tier: Board3dGraphicsTier, dpr: number): number {
  switch (tier) {
    case 'lowest':
      return 1;
    case 'low':
      return Math.min(dpr, 1.1);
    case 'medium':
      return Math.min(dpr, 1.25);
    case 'highest':
      return dpr;
    case 'high':
    default:
      return Math.min(dpr, 1.5);
  }
}

function resolveShadows(tier: Board3dGraphicsTier): { castShadow: boolean; shadowMapSize: number } {
  switch (tier) {
    case 'high':
      return { castShadow: true, shadowMapSize: 1024 };
    case 'highest':
      return { castShadow: true, shadowMapSize: 2048 };
    case 'lowest':
    case 'low':
    case 'medium':
    default:
      return { castShadow: false, shadowMapSize: 128 };
  }
}

function resolveAnisotropy(tier: Board3dGraphicsTier): number | null {
  switch (tier) {
    case 'lowest':
      return 2;
    case 'low':
      return 4;
    case 'medium':
      return 8;
    case 'high':
    case 'highest':
    default:
      return null;
  }
}

/**
 * Resolve concrete 3D board knobs from independent graphics tiers.
 * `devicePixelRatio` should be `window.devicePixelRatio` (or 1 SSR).
 */
export function resolveBoard3dGraphicsPreset(
  tiers: Board3dGraphicsTiersInput,
  devicePixelRatio: number,
): Board3dGraphicsPreset {
  const dpr = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1;
  const shadows = resolveShadows(tiers.shadows);
  return {
    dprCap: resolveDprCap(tiers.resolution, dpr),
    castShadow: shadows.castShadow,
    shadowMapSize: shadows.shadowMapSize,
    maxAnisotropy: resolveAnisotropy(tiers.textures),
  };
}

/** Apply preset anisotropy against the renderer capability ceiling. */
export function resolveBoard3dMaxAnisotropy(
  anisotropyCap: number | null,
  gpuMaxAnisotropy: number,
): number {
  const gpuMax = Math.max(1, Math.floor(gpuMaxAnisotropy) || 1);
  if (anisotropyCap == null) {
    return gpuMax;
  }
  return Math.min(anisotropyCap, gpuMax);
}
