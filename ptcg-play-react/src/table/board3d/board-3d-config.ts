import { Vector3 } from 'three';
import {
  ZONE_POSITIONS,
  ORIGINAL_BENCH_POSITIONS,
  MOBILE_ZONE_POSITIONS,
  MOBILE_ORIGINAL_BENCH_POSITIONS
} from './board-3d-zone-positions';

/**
 * Camera configuration for a specific aspect ratio preset
 */
export interface CameraConfig {
  /** Field of view in degrees */
  fov: number;
  /** Camera position */
  position: { x: number; y: number; z: number };
  /** Look at target */
  lookAt: { x: number; y: number; z: number };
}

/**
 * Zone positions structure matching the current ZONE_POSITIONS format
 */
export interface ZonePositions {
  stadium: Vector3;
  bottomPlayer: {
    active: Vector3;
    supporter: Vector3;
    bench: Vector3[];
    board: Vector3;
    prizes: Vector3;
    deck: Vector3;
    discard: Vector3;
    lostZone: Vector3;
  };
  topPlayer: {
    active: Vector3;
    supporter: Vector3;
    bench: Vector3[];
    board: Vector3;
    prizes: Vector3;
    deck: Vector3;
    discard: Vector3;
    lostZone: Vector3;
  };
}

/**
 * Original bench positions for 8-spot benches
 */
export interface OriginalBenchPositions {
  bottomPlayer: Vector3[];
  topPlayer: Vector3[];
}

/**
 * Complete board configuration for a specific aspect ratio
 */
export interface Board3dConfig {
  camera: CameraConfig;
  zonePositions: ZonePositions;
  originalBenchPositions: OriginalBenchPositions;
  snapDistance: number;
}

/**
 * Aspect ratio category
 */
export type AspectRatioCategory = 'widescreen' | 'standard' | 'mobile';

/**
 * Widescreen preset (aspect >= 1.6)
 * Covers 16:9 (≈1.78) and 16:10 (≈1.6)
 */
const WIDESCREEN_CONFIG: Board3dConfig = {
  camera: {
    fov: 31,
    position: { x: 0, y: 47.5, z: 35 },
    lookAt: { x: 0, y: 0, z: 18 }
  },
  zonePositions: ZONE_POSITIONS,
  originalBenchPositions: ORIGINAL_BENCH_POSITIONS,
  snapDistance: 3.5
};

/**
 * Standard preset (0.8 <= aspect < 1.6)
 * Covers 4:3 (≈1.33), square (1.0), and narrower screens
 */
const STANDARD_CONFIG: Board3dConfig = {
  camera: {
    fov: 31,
    position: { x: 0, y: 60, z: 45 },
    lookAt: { x: 0, y: 0, z: 18 }
  },
  zonePositions: ZONE_POSITIONS,
  originalBenchPositions: ORIGINAL_BENCH_POSITIONS,
  snapDistance: 3.5
};

/**
 * Mobile preset (aspect < 0.8)
 * Covers 9:16 (≈0.56) and other portrait mobile orientations
 */
const MOBILE_CONFIG: Board3dConfig = {
  camera: {
    fov: 31,
    position: { x: 0, y: 60, z: 45 },
    lookAt: { x: 0, y: 0, z: 18 }
  },
  zonePositions: MOBILE_ZONE_POSITIONS,
  originalBenchPositions: MOBILE_ORIGINAL_BENCH_POSITIONS,
  snapDistance: 3.5
};

/**
 * Determine the aspect ratio category based on aspect ratio value
 * @param aspect Aspect ratio (width / height)
 * @returns Aspect ratio category
 */
export function getAspectRatioCategory(aspect: number): AspectRatioCategory {
  if (aspect >= 1.6) {
    return 'widescreen';
  } else if (aspect >= 0.8) {
    return 'standard';
  } else {
    return 'mobile';
  }
}

/**
 * Get the board configuration for a specific aspect ratio
 * @param aspect Aspect ratio (width / height)
 * @returns Board configuration for the aspect ratio
 */
export function getBoardConfig(aspect: number): Board3dConfig {
  const category = getAspectRatioCategory(aspect);
  
  switch (category) {
    case 'widescreen':
      return WIDESCREEN_CONFIG;
    case 'standard':
      return STANDARD_CONFIG;
    case 'mobile':
      return MOBILE_CONFIG;
    default:
      return STANDARD_CONFIG;
  }
}

/**
 * Get camera configuration for a specific aspect ratio
 * @param aspect Aspect ratio (width / height)
 * @param isUpsideDown Whether the camera should be flipped (for opposite player perspective)
 * @returns Camera configuration with Z position adjusted for perspective
 */
export function getCameraConfig(aspect: number, isUpsideDown: boolean = false): CameraConfig {
  const config = getBoardConfig(aspect);
  const zMultiplier = isUpsideDown ? -1 : 1;
  
  return {
    ...config.camera,
    position: {
      ...config.camera.position,
      z: config.camera.position.z * zMultiplier
    }
  };
}

/**
 * World point for deck→stage draw flight: centered on the camera look target so draws stay on-screen.
 */
export function getDrawFlightStageCenterWorld(aspect: number, isUpsideDown: boolean): Vector3 {
  const cfg = getCameraConfig(aspect, isUpsideDown);
  return new Vector3(cfg.lookAt.x, cfg.lookAt.y + 10, cfg.lookAt.z);
}

function prizeSlotOffsetWorld(gridIndex: number, base: Vector3): Vector3 {
  const row = Math.floor(gridIndex / 2);
  const col = gridIndex % 2;
  const offsetX = (col - 0.5) * 3;
  const offsetZ = (row - 1) * 4;
  return new Vector3(base.x + offsetX, base.y, base.z + offsetZ);
}

/** World position for a bottom-player prize slot (0–5), matching board-3d-prize.service grid layout. */
export function getBottomPrizeSlotWorld(aspect: number, gridIndex: number): Vector3 {
  const { zonePositions } = getBoardConfig(aspect);
  return prizeSlotOffsetWorld(gridIndex, zonePositions.bottomPlayer.prizes.clone());
}

/** World position for a top-player prize slot (0–5), same grid offsets as bottom. */
export function getTopPrizeSlotWorld(aspect: number, gridIndex: number): Vector3 {
  const { zonePositions } = getBoardConfig(aspect);
  return prizeSlotOffsetWorld(gridIndex, zonePositions.topPlayer.prizes.clone());
}

/**
 * Max total world-space width for a centered row of staged draw cards (margin inside the frustum).
 * Reserves space for deck-flight stage scale (see HAND_DRAW_STAGE_SCALE in board-3d-animation.service).
 */
export function getMaxDrawStageRowWidthWorld(aspect: number, isUpsideDown: boolean): number {
  const cfg = getCameraConfig(aspect, isUpsideDown);
  const stage = new Vector3(cfg.lookAt.x, cfg.lookAt.y + 10, cfg.lookAt.z);
  const cam = new Vector3(cfg.position.x, cfg.position.y, cfg.position.z);
  const dist = cam.distanceTo(stage);
  const vRad = (cfg.fov * Math.PI) / 180;
  const hRad = 2 * Math.atan(aspect * Math.tan(vRad / 2));
  const fullWidth = 2 * dist * Math.tan(hRad / 2);
  const handMeshWidth = 2.75;
  const stageDrawScale = 2.15;
  const cardHalfWidth = (handMeshWidth * stageDrawScale) / 2;
  return Math.max(6, fullWidth * 0.62 - 2 * cardHalfWidth);
}
