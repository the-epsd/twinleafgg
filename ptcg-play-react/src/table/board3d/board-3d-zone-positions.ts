import { Vector3 } from 'three';
import { PlayerType } from 'ptcg-server';

// Zone positions in 3D world space
// Layout: Stadium shared at center-left, Active near center, Bench behind Active
// NOTE: This is the default/legacy export. For aspect-ratio-aware positions, use getZonePositions()
export const ZONE_POSITIONS = {
  // Shared stadium position (single slot between both players)
  stadium: new Vector3(-10, 0.1, 14),

  bottomPlayer: {
    active: new Vector3(0, 0.1, 18),      // Moved closer to center (was Z=12)
    supporter: new Vector3(6, 0.1, 18),   // Beside Active, to the right
    bench: [
      new Vector3(-8, 0.1, 24),          // Moved to where Active was (was Z=18)
      new Vector3(-4, 0.1, 24),
      new Vector3(0, 0.1, 24),
      new Vector3(4, 0.1, 24),
      new Vector3(8, 0.1, 24),
      new Vector3(12, 0.1, 24),
      new Vector3(16, 0.1, 24),
      new Vector3(20, 0.1, 24),
    ],
    board: new Vector3(0, 0.1, 16),  // General trainer area - covers most of player's side
    prizes: new Vector3(-18, 0.1, 20),
    deck: new Vector3(20, 0.1, 18),
    discard: new Vector3(20, 0.1, 24),
    lostZone: new Vector3(-10, 0.1, 18),
  },
  topPlayer: {
    active: new Vector3(0, 0.1, 10),     // Moved closer to center (was Z=-12)
    supporter: new Vector3(-6, 0.1, 10), // Beside Active, to the left
    bench: [
      new Vector3(8, 0.1, 4),          // Moved to where Active was (was Z=-18)
      new Vector3(4, 0.1, 4),
      new Vector3(0, 0.1, 4),
      new Vector3(-4, 0.1, 4),
      new Vector3(-8, 0.1, 4),
      new Vector3(-12, 0.1, 4),
      new Vector3(-16, 0.1, 4),
      new Vector3(-20, 0.1, 4),
    ],
    board: new Vector3(0, 0.1, 3),
    prizes: new Vector3(20, 0.1, 8),
    deck: new Vector3(-18, 0.1, 10), // Z=10 matches active row; symmetrical with bottom deck
    discard: new Vector3(-18, 0.1, 4),
    lostZone: new Vector3(-10, 0.1, 10),
  }
};

// Original bench positions (before shift) - used for 8-spot benches
// These extend further left/right than the current shifted positions.
// Top player bench shifted +2 in x to avoid overlapping with discard at (-18, 4).
export const ORIGINAL_BENCH_POSITIONS = {
  bottomPlayer: [
    new Vector3(-12, 0.1, 24),
    new Vector3(-8, 0.1, 24),
    new Vector3(-4, 0.1, 24),
    new Vector3(0, 0.1, 24),
    new Vector3(4, 0.1, 24),
    new Vector3(8, 0.1, 24),
    new Vector3(12, 0.1, 24),
    new Vector3(16, 0.1, 24),
  ],
  topPlayer: [
    new Vector3(14, 0.1, 4),   // Shifted +2 right to avoid discard at x=-18
    new Vector3(10, 0.1, 4),
    new Vector3(6, 0.1, 4),
    new Vector3(2, 0.1, 4),
    new Vector3(-2, 0.1, 4),
    new Vector3(-6, 0.1, 4),
    new Vector3(-10, 0.1, 4),
    new Vector3(-14, 0.1, 4),
  ]
};

/**
 * Mobile-specific zone positions (aspect < 0.8)
 * Tighter bench spacing for portrait mobile orientations
 */
export const MOBILE_ZONE_POSITIONS = {
  stadium: new Vector3(-10, 0.1, 14),
  bottomPlayer: {
    active: new Vector3(0, 0.1, 18),
    supporter: new Vector3(6, 0.1, 18),
    bench: [
      new Vector3(-6, 0.1, 24),
      new Vector3(-3, 0.1, 24),
      new Vector3(0, 0.1, 24),
      new Vector3(3, 0.1, 24),
      new Vector3(6, 0.1, 24),
      new Vector3(9, 0.1, 24),
      new Vector3(12, 0.1, 24),
      new Vector3(15, 0.1, 24),
    ],
    board: new Vector3(0, 0.1, 16),
    prizes: new Vector3(-18, 0.1, 20),
    deck: new Vector3(20, 0.1, 18),
    discard: new Vector3(20, 0.1, 24),
    lostZone: new Vector3(-10, 0.1, 18),
  },
  topPlayer: {
    active: new Vector3(0, 0.1, 10),
    supporter: new Vector3(-6, 0.1, 10),
    bench: [
      new Vector3(6, 0.1, 4),
      new Vector3(3, 0.1, 4),
      new Vector3(0, 0.1, 4),
      new Vector3(-3, 0.1, 4),
      new Vector3(-6, 0.1, 4),
      new Vector3(-9, 0.1, 4),
      new Vector3(-12, 0.1, 4),
      new Vector3(-15, 0.1, 4),
    ],
    board: new Vector3(0, 0.1, 3),
    prizes: new Vector3(20, 0.1, 8),
    deck: new Vector3(-18, 0.1, 10),
    discard: new Vector3(-18, 0.1, 4),
    lostZone: new Vector3(-10, 0.1, 10),
  }
};

/**
 * Mobile-specific original bench positions for 8-spot benches.
 * Top player bench shifted +2 right to avoid overlapping with discard at (-18, 4).
 */
export const MOBILE_ORIGINAL_BENCH_POSITIONS = {
  bottomPlayer: [
    new Vector3(-9, 0.1, 24),
    new Vector3(-6, 0.1, 24),
    new Vector3(-3, 0.1, 24),
    new Vector3(0, 0.1, 24),
    new Vector3(3, 0.1, 24),
    new Vector3(6, 0.1, 24),
    new Vector3(9, 0.1, 24),
    new Vector3(12, 0.1, 24),
  ],
  topPlayer: [
    new Vector3(11, 0.1, 4),   // Shifted +2 right to avoid discard at x=-18
    new Vector3(8, 0.1, 4),
    new Vector3(5, 0.1, 4),
    new Vector3(2, 0.1, 4),
    new Vector3(-1, 0.1, 4),
    new Vector3(-4, 0.1, 4),
    new Vector3(-7, 0.1, 4),
    new Vector3(-10, 0.1, 4),
  ]
};

export const SNAP_DISTANCE = 3.5;

/** Aspect ratio (width/height) below which mobile positions are used */
const MOBILE_ASPECT_THRESHOLD = 0.8;

/**
 * Get zone positions based on aspect ratio
 * @param aspect Aspect ratio (width / height). If not provided, uses default positions.
 * @returns Zone positions structure for the given aspect ratio
 */
export function getZonePositions(aspect?: number): typeof ZONE_POSITIONS {
  if (aspect === undefined || aspect >= MOBILE_ASPECT_THRESHOLD) {
    return ZONE_POSITIONS;
  }
  return MOBILE_ZONE_POSITIONS;
}

/**
 * Get original bench positions based on aspect ratio
 * @param aspect Aspect ratio (width / height). If not provided, uses default positions.
 * @returns Original bench positions for the given aspect ratio
 */
export function getOriginalBenchPositions(aspect?: number): typeof ORIGINAL_BENCH_POSITIONS {
  if (aspect === undefined || aspect >= MOBILE_ASPECT_THRESHOLD) {
    return ORIGINAL_BENCH_POSITIONS;
  }
  return MOBILE_ORIGINAL_BENCH_POSITIONS;
}

/**
 * Get snap distance based on aspect ratio
 * @param aspect Aspect ratio (width / height). If not provided, uses default snap distance.
 * @returns Snap distance for the given aspect ratio
 */
export function getSnapDistance(aspect?: number): number {
  return SNAP_DISTANCE;
}

/**
 * Get bench positions based on bench size
 * - 5 spots: Use current shifted positions (centered, first 5)
 * - 8 spots: Use original positions (extends further left/right)
 * @param benchSize Number of bench slots
 * @param playerType Player type (BOTTOM_PLAYER or TOP_PLAYER)
 * @param aspect Optional aspect ratio for aspect-ratio-aware positioning
 */
export function getBenchPositions(benchSize: number, playerType: PlayerType, aspect?: number): Vector3[] {
  const zonePositions = getZonePositions(aspect);
  const originalBenchPositions = getOriginalBenchPositions(aspect);

  if (benchSize === 8) {
    // Use original positions for 8-spot benches
    return playerType === PlayerType.BOTTOM_PLAYER
      ? originalBenchPositions.bottomPlayer
      : originalBenchPositions.topPlayer;
  } else {
    // Use first N positions from current shifted array (centered)
    const currentPositions = playerType === PlayerType.BOTTOM_PLAYER
      ? zonePositions.bottomPlayer.bench
      : zonePositions.topPlayer.bench;
    return currentPositions.slice(0, benchSize);
  }
}
