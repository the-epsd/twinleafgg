import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Texture,
  CanvasTexture,
  Group,
  DoubleSide
} from 'three';
import { SpecialCondition } from 'ptcg-server';

const MARKER_SIZE = 0.8;
const MARKER_SPACING = 0.9;

// Marker colors for different conditions
const CONDITION_COLORS: { [key: number]: string } = {
  [SpecialCondition.POISONED]: '#9b59b6',    // Purple
  [SpecialCondition.BURNED]: '#e74c3c',      // Red/Orange
  [SpecialCondition.ASLEEP]: '#3498db',      // Blue
  [SpecialCondition.CONFUSED]: '#f39c12',    // Yellow/Orange
  [SpecialCondition.PARALYZED]: '#f1c40f',   // Yellow
};

// Marker labels for different conditions
const CONDITION_LABELS: { [key: number]: string } = {
  [SpecialCondition.POISONED]: 'PSN',
  [SpecialCondition.BURNED]: 'BRN',
  [SpecialCondition.ASLEEP]: 'SLP',
  [SpecialCondition.CONFUSED]: 'CNF',
  [SpecialCondition.PARALYZED]: 'PAR',
};

export class Board3dMarker {
  private group: Group;
  private markerMeshes: Mesh[] = [];
  private static geometry: PlaneGeometry;
  private textureCache: Map<number, CanvasTexture> = new Map();

  constructor() {
    this.group = new Group();

    // Initialize shared geometry if not already created
    if (!Board3dMarker.geometry) {
      Board3dMarker.geometry = new PlaneGeometry(MARKER_SIZE, MARKER_SIZE);
    }
  }

  /**
   * Update markers from special conditions array
   */
  updateConditions(conditions: SpecialCondition[]): void {
    // Clear existing meshes
    this.clear();

    if (conditions.length === 0) {
      return;
    }

    const totalWidth = (conditions.length - 1) * MARKER_SPACING;
    const startX = -totalWidth / 2;

    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];

      // Skip conditions we don't have visuals for
      if (!CONDITION_COLORS[condition]) {
        continue;
      }

      // Get or create texture for this condition
      let texture = this.textureCache.get(condition);
      if (!texture) {
        texture = this.createMarkerTexture(condition);
        this.textureCache.set(condition, texture);
      }

      const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: DoubleSide,
        alphaTest: 0.1
      });

      const mesh = new Mesh(Board3dMarker.geometry, material);

      // Position in a row at the left side of the card
      mesh.position.set(
        -1.5,           // Left of card
        0.1,            // Slightly above ground
        startX + (i * MARKER_SPACING)
      );

      // Rotate to face up
      mesh.rotation.x = -Math.PI / 2;

      this.group.add(mesh);
      this.markerMeshes.push(mesh);
    }
  }

  /**
   * Create a canvas texture for a condition marker
   */
  private createMarkerTexture(condition: SpecialCondition): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const color = CONDITION_COLORS[condition] || '#888888';
    const label = CONDITION_LABELS[condition] || '?';

    // Draw background circle
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Draw border
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 32, 34);

    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
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
    // Dispose cached textures
    this.textureCache.forEach(texture => texture.dispose());
    this.textureCache.clear();
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
