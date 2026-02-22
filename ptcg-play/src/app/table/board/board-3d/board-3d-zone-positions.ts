import { Vector3 } from 'three';
import { PlayerType } from 'ptcg-server';
import { getBoardConfig } from './board-3d-config';

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
// These extend further left/right than the current shifted positions
export const ORIGINAL_BENCH_POSITIONS = {
  bottomPlayer: [
    new Vector3(-12, 0.1, 22),
    new Vector3(-8, 0.1, 22),
    new Vector3(-4, 0.1, 22),
    new Vector3(0, 0.1, 22),
    new Vector3(4, 0.1, 22),
    new Vector3(8, 0.1, 22),
    new Vector3(12, 0.1, 22),
    new Vector3(16, 0.1, 22),
  ],
  topPlayer: [
    new Vector3(12, 0.1, -4),
    new Vector3(8, 0.1, -4),
    new Vector3(4, 0.1, -4),
    new Vector3(0, 0.1, -4),
    new Vector3(-4, 0.1, -4),
    new Vector3(-8, 0.1, -4),
    new Vector3(-12, 0.1, -4),
    new Vector3(-16, 0.1, -4),
  ]
};

export const SNAP_DISTANCE = 3.5;

/**
 * Get zone positions based on aspect ratio
 * @param aspect Aspect ratio (width / height). If not provided, uses default positions.
 * @returns Zone positions structure for the given aspect ratio
 */
export function getZonePositions(aspect?: number): typeof ZONE_POSITIONS {
  if (aspect === undefined) {
    return ZONE_POSITIONS;
  }
  
  const config = getBoardConfig(aspect);
  return config.zonePositions as typeof ZONE_POSITIONS;
}

/**
 * Get original bench positions based on aspect ratio
 * @param aspect Aspect ratio (width / height). If not provided, uses default positions.
 * @returns Original bench positions for the given aspect ratio
 */
export function getOriginalBenchPositions(aspect?: number): typeof ORIGINAL_BENCH_POSITIONS {
  if (aspect === undefined) {
    return ORIGINAL_BENCH_POSITIONS;
  }
  
  const config = getBoardConfig(aspect);
  return config.originalBenchPositions as typeof ORIGINAL_BENCH_POSITIONS;
}

/**
 * Get snap distance based on aspect ratio
 * @param aspect Aspect ratio (width / height). If not provided, uses default snap distance.
 * @returns Snap distance for the given aspect ratio
 */
export function getSnapDistance(aspect?: number): number {
  if (aspect === undefined) {
    return SNAP_DISTANCE;
  }
  
  const config = getBoardConfig(aspect);
  return config.snapDistance;
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
