import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Texture,
  Group,
  Vector3,
  DoubleSide
} from 'three';
import { Card } from 'ptcg-server';
import { getCustomEnergyIconPath } from '../../../shared/cards/energy-icons.utils';

const MAX_VISIBLE_ENERGIES = 8;
const ENERGY_SPRITE_SIZE = 0.6;
const ENERGY_SPACING = 0.3;

export class Board3dEnergySprite {
  private group: Group;
  private energyMeshes: Mesh[] = [];
  private static geometry: PlaneGeometry;

  constructor() {
    this.group = new Group();

    // Initialize shared geometry if not already created
    if (!Board3dEnergySprite.geometry) {
      Board3dEnergySprite.geometry = new PlaneGeometry(ENERGY_SPRITE_SIZE, ENERGY_SPRITE_SIZE);
    }
  }

  /**
   * Get the custom energy icon path for a card
   */
  static getEnergyIconPath(card: Card): string | null {
    return getCustomEnergyIconPath(card, true);
  }

  /**
   * Update energy sprites from card array
   */
  updateEnergies(
    energyCards: Card[],
    textures: Map<string, Texture>,
    cardBackTexture: Texture
  ): void {
    // Clear existing meshes
    this.clear();

    const visibleCount = Math.min(energyCards.length, MAX_VISIBLE_ENERGIES);
    // Card width is 2.5 units, so left edge is at X = -1.25
    // Position first energy slightly inset from left edge
    const cardLeftEdge = -1.25; // Card left edge
    const startX = cardLeftEdge + 0.15; // Slight inset from left edge

    for (let i = 0; i < visibleCount; i++) {
      const card = energyCards[i];
      const iconPath = Board3dEnergySprite.getEnergyIconPath(card);

      // Get texture - use custom icon if available, otherwise card back
      let texture: Texture;
      if (iconPath && textures.has(iconPath)) {
        texture = textures.get(iconPath)!;
      } else {
        texture = cardBackTexture;
      }

      const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: DoubleSide,
        alphaTest: 0.1
      });

      const mesh = new Mesh(Board3dEnergySprite.geometry, material);

      // Position in a row below the card, starting from left edge
      mesh.position.set(
        startX + (i * ENERGY_SPACING), // Start from left, space horizontally
        0.1, // Slightly above ground
        1.75   // Below the card (card center is at 0, card bottom is around 1.75)
      );

      // Rotate to face up (like the card)
      mesh.rotation.x = -Math.PI / 2;

      this.group.add(mesh);
      this.energyMeshes.push(mesh);
    }
  }

  /**
   * Clear all energy meshes
   */
  clear(): void {
    for (const mesh of this.energyMeshes) {
      this.group.remove(mesh);
      (mesh.material as MeshBasicMaterial).dispose();
    }
    this.energyMeshes = [];
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
    if (Board3dEnergySprite.geometry) {
      Board3dEnergySprite.geometry.dispose();
    }
  }
}
