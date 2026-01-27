import { Vector3 } from 'three';
import { PlayerType } from 'ptcg-server';

// Zone positions in 3D world space
// Layout: Stadium shared at center-left, Active near center, Bench behind Active
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
    deck: new Vector3(-18, 0.1, 8),
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
 * Get bench positions based on bench size
 * - 5 spots: Use current shifted positions (centered, first 5)
 * - 8 spots: Use original positions (extends further left/right)
 */
export function getBenchPositions(benchSize: number, playerType: PlayerType): Vector3[] {
  if (benchSize === 8) {
    // Use original positions for 8-spot benches
    return playerType === PlayerType.BOTTOM_PLAYER
      ? ORIGINAL_BENCH_POSITIONS.bottomPlayer
      : ORIGINAL_BENCH_POSITIONS.topPlayer;
  } else {
    // Use first 5 positions from current shifted array (centered)
    const currentPositions = playerType === PlayerType.BOTTOM_PLAYER
      ? ZONE_POSITIONS.bottomPlayer.bench
      : ZONE_POSITIONS.topPlayer.bench;
    return currentPositions.slice(0, benchSize);
  }
}
