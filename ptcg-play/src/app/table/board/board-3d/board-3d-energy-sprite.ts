import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Texture,
  Group,
  DoubleSide,
  PerspectiveCamera
} from 'three';
import { Card, CardList } from 'ptcg-server';
import { getCustomEnergyIconPath } from '../../../shared/cards/energy-icons.utils';

const MAX_VISIBLE_ENERGIES = 8;
const ENERGY_SPRITE_HEIGHT = 0.6;
// Energy icons are 749×1042 (portrait); preserve aspect ratio so they don't appear stretched
const ENERGY_ICON_ASPECT = 749 / 1042;
const ENERGY_SPRITE_WIDTH = ENERGY_SPRITE_HEIGHT * ENERGY_ICON_ASPECT;
const ENERGY_SPACING = 0.3;

export class Board3dEnergySprite {
  private group: Group;
  private energyMeshes: Mesh[] = [];
  private static geometry: PlaneGeometry;

  constructor() {
    this.group = new Group();

    // Initialize shared geometry if not already created (width x height to match icon aspect)
    if (!Board3dEnergySprite.geometry) {
      Board3dEnergySprite.geometry = new PlaneGeometry(ENERGY_SPRITE_WIDTH, ENERGY_SPRITE_HEIGHT);
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
   * @param energyCardList The energies CardList (for click-to-show-info)
   */
  updateEnergies(
    energyCards: Card[],
    energyCardList: CardList,
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

      // Clone and flip horizontally to correct mirroring from billboard orientation
      const textureToUse = texture.clone();
      textureToUse.repeat.x = -1;
      textureToUse.offset.x = 1;

      const material = new MeshBasicMaterial({
        map: textureToUse,
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

      // userData for click-to-show-energy-card-info
      mesh.userData.isEnergyIcon = true;
      mesh.userData.cardData = card;
      mesh.userData.cardList = energyCardList;

      // Billboard: orientation updated via updateBillboards() each frame
      this.group.add(mesh);
      this.energyMeshes.push(mesh);
    }
  }

  /**
   * Update all energy meshes to face the camera (billboard behavior).
   * Call this each frame before rendering.
   */
  updateBillboards(camera: PerspectiveCamera): void {
    for (const mesh of this.energyMeshes) {
      mesh.lookAt(camera.position);
      // Three.js lookAt makes -Z point at target; flip so front face (+Z) faces camera
      mesh.rotateY(Math.PI);
    }
  }

  /**
   * Clear all energy meshes
   */
  clear(): void {
    for (const mesh of this.energyMeshes) {
      this.group.remove(mesh);
      const material = mesh.material as MeshBasicMaterial;
      if (material.map) {
        material.map.dispose();
      }
      material.dispose();
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
