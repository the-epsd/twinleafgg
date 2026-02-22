import { Vector3 } from 'three';
import { PlayerType } from 'ptcg-server';

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
  zonePositions: {
    stadium: new Vector3(-10, 0.1, 14),
    bottomPlayer: {
      active: new Vector3(0, 0.1, 18),
      supporter: new Vector3(6, 0.1, 18),
      bench: [
        new Vector3(-8, 0.1, 24),
        new Vector3(-4, 0.1, 24),
        new Vector3(0, 0.1, 24),
        new Vector3(4, 0.1, 24),
        new Vector3(8, 0.1, 24),
        new Vector3(12, 0.1, 24),
        new Vector3(16, 0.1, 24),
        new Vector3(20, 0.1, 24),
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
        new Vector3(8, 0.1, 4),
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
  },
  originalBenchPositions: {
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
  },
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
  zonePositions: {
    stadium: new Vector3(-10, 0.1, 14),
    bottomPlayer: {
      active: new Vector3(0, 0.1, 18),
      supporter: new Vector3(6, 0.1, 18),
      bench: [
        new Vector3(-8, 0.1, 24),
        new Vector3(-4, 0.1, 24),
        new Vector3(0, 0.1, 24),
        new Vector3(4, 0.1, 24),
        new Vector3(8, 0.1, 24),
        new Vector3(12, 0.1, 24),
        new Vector3(16, 0.1, 24),
        new Vector3(20, 0.1, 24),
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
        new Vector3(8, 0.1, 4),
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
  },
  originalBenchPositions: {
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
  },
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
  zonePositions: {
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
      deck: new Vector3(-18, 0.1, 10), // Z=10 matches active row; symmetrical with bottom deck
      discard: new Vector3(-18, 0.1, 4),
      lostZone: new Vector3(-10, 0.1, 10),
    }
  },
  originalBenchPositions: {
    bottomPlayer: [
      new Vector3(-9, 0.1, 22),
      new Vector3(-6, 0.1, 22),
      new Vector3(-3, 0.1, 22),
      new Vector3(0, 0.1, 22),
      new Vector3(3, 0.1, 22),
      new Vector3(6, 0.1, 22),
      new Vector3(9, 0.1, 22),
      new Vector3(12, 0.1, 22),
    ],
    topPlayer: [
      new Vector3(9, 0.1, -4),
      new Vector3(6, 0.1, -4),
      new Vector3(3, 0.1, -4),
      new Vector3(0, 0.1, -4),
      new Vector3(-3, 0.1, -4),
      new Vector3(-6, 0.1, -4),
      new Vector3(-9, 0.1, -4),
      new Vector3(-12, 0.1, -4),
    ]
  },
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
