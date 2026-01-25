import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Texture,
  Group,
  DoubleSide
} from 'three';
import { SpecialCondition } from 'ptcg-server';
import { Board3dAssetLoaderService } from '../services/board-3d-asset-loader.service';

const MARKER_SIZE = 0.875; // 25% of card height (card is ~3.5 units tall, so 25% = 0.875 units)
const MARKER_VERTICAL_SPACING = 0.525; // 15% of card height (0.15 * 3.5 = 0.525 units)

// Map SpecialCondition to marker image filenames
const CONDITION_MARKER_NAMES: { [key: number]: string } = {
  [SpecialCondition.POISONED]: 'poison-marker',
  [SpecialCondition.PARALYZED]: 'paralyzed-marker',
  [SpecialCondition.CONFUSED]: 'confused-marker',
  [SpecialCondition.ASLEEP]: 'asleep-marker',
  [SpecialCondition.BURNED]: 'burned-marker',
};

export class Board3dMarker {
  private group: Group;
  private markerMeshes: Mesh[] = [];
  private static geometry: PlaneGeometry;
  private assetLoader: Board3dAssetLoaderService;

  constructor(assetLoader: Board3dAssetLoaderService) {
    this.group = new Group();
    this.assetLoader = assetLoader;

    // Initialize shared geometry if not already created
    if (!Board3dMarker.geometry) {
      Board3dMarker.geometry = new PlaneGeometry(MARKER_SIZE, MARKER_SIZE);
    }
  }

  /**
   * Update markers from special conditions array
   */
  async updateConditions(conditions: SpecialCondition[]): Promise<void> {
    // Clear existing meshes
    this.clear();

    if (conditions.length === 0) {
      return;
    }

    // Filter to only conditions we have marker images for
    const validConditions = conditions.filter(c => CONDITION_MARKER_NAMES[c] !== undefined);

    // Load textures for all markers
    const texturePromises = validConditions.map(condition => {
      const markerName = CONDITION_MARKER_NAMES[condition];
      return this.assetLoader.loadMarkerTexture(markerName);
    });

    const textures = await Promise.all(texturePromises);

    // Position markers on right side, stacked vertically
    // Base position: top: 20% = ~0.7 units from top, right: 0 = ~1.25 units from center
    const baseX = 1.25; // Right side of card
    const baseZ = -0.7; // 20% from top (card top is at ~-1.75, so 20% down = -0.7)

    for (let i = 0; i < validConditions.length; i++) {
      const texture = textures[i];

      const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: DoubleSide,
        alphaTest: 0.1
      });

      const mesh = new Mesh(Board3dMarker.geometry, material);

      // Stack vertically with 15% increments (0.525 units per marker)
      mesh.position.set(
        baseX,           // Right side of card
        0.1,             // Slightly above ground
        baseZ + (i * MARKER_VERTICAL_SPACING) // Stack vertically
      );

      // Rotate to face up
      mesh.rotation.x = -Math.PI / 2;

      this.group.add(mesh);
      this.markerMeshes.push(mesh);
    }
  }


  /**
   * Clear all marker meshes
   */
  clear(): void {
    for (const mesh of this.markerMeshes) {
      this.group.remove(mesh);
      (mesh.material as MeshBasicMaterial).dispose();
    }
    this.markerMeshes = [];
  }

  /**
   * Get the group to add to a parent
   */
  getGroup(): Group {
    return this.group;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.clear();
  }

  /**
   * Dispose shared resources
   */
  static disposeSharedResources(): void {
    if (Board3dMarker.geometry) {
      Board3dMarker.geometry.dispose();
    }
  }
}
