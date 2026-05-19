import type { ToneMapping } from 'three';
import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  LinearToneMapping,
  NoToneMapping,
  ReinhardToneMapping,
} from 'three';

/** Keys must match Three.js tone mapping options exposed in the debug panel. */
export type Board3dToneMappingKey =
  | 'NoToneMapping'
  | 'LinearToneMapping'
  | 'ReinhardToneMapping'
  | 'CineonToneMapping'
  | 'ACESFilmicToneMapping';

export const BOARD3D_TONE_MAPPING_OPTIONS: { key: Board3dToneMappingKey; label: string }[] = [
  { key: 'NoToneMapping', label: 'None' },
  { key: 'LinearToneMapping', label: 'Linear' },
  { key: 'ReinhardToneMapping', label: 'Reinhard' },
  { key: 'CineonToneMapping', label: 'Cineon' },
  { key: 'ACESFilmicToneMapping', label: 'ACES Filmic' },
];

const toneMappingByKey: Record<Board3dToneMappingKey, number> = {
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  ACESFilmicToneMapping,
};

export function board3dToneMappingConstant(key: Board3dToneMappingKey): ToneMapping {
  return toneMappingByKey[key] as ToneMapping;
}

export type Board3dLightingSettings = {
  ambient: {
    color: string;
    intensity: number;
  };
  directional: {
    color: string;
    intensity: number;
    position: [number, number, number];
    castShadow: boolean;
    shadowMapSize: number;
    shadowBias: number;
    shadowCamera: {
      left: number;
      right: number;
      top: number;
      bottom: number;
      near: number;
      far: number;
    };
  };
  renderer: {
    toneMapping: Board3dToneMappingKey;
    toneMappingExposure: number;
  };
  bloom: {
    intensity: number;
    luminanceThreshold: number;
  };
};

/** Defaults aligned with `Board3dStaticScene`, `Board3DCanvas` onCreated, and `Board3dFrameEffects` Bloom. */
export const BOARD3D_LIGHTING_DEFAULTS: Board3dLightingSettings = {
  ambient: { color: '#ffffff', intensity: 0.95 },
  directional: {
    color: '#ffffff',
    intensity: 0.9,
    position: [5, 20, 10],
    castShadow: false,
    shadowMapSize: 128,
    shadowBias: -0.0001,
    shadowCamera: {
      left: -30,
      right: 30,
      top: 30,
      bottom: -30,
      near: 0.5,
      far: 50,
    },
  },
  renderer: {
    toneMapping: 'ACESFilmicToneMapping',
    toneMappingExposure: 1.2,
  },
  bloom: {
    intensity: 0,
    luminanceThreshold: 1,
  },
};

/** Bloom intensities at or below this are treated as off (no postprocessing selection). */
export const BOARD3D_BLOOM_OFF_THRESHOLD = 1e-4;

export function isBoard3dBloomActive(bloom: Board3dLightingSettings['bloom']): boolean {
  return bloom.intensity > BOARD3D_BLOOM_OFF_THRESHOLD;
}

export function cloneBoard3dLightingDefaults(): Board3dLightingSettings {
  return structuredClone(BOARD3D_LIGHTING_DEFAULTS);
}
