import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Texture,
  Group,
  DoubleSide,
  PerspectiveCamera,
  Quaternion,
  Vector3,
} from 'three';
import { Card, CardList } from 'ptcg-server';
import { getCustomEnergyIconPath } from './energy-icons.utils';

const MAX_VISIBLE_ENERGIES = 8;
const ENERGY_SPRITE_HEIGHT = 0.6;
const ENERGY_ICON_ASPECT = 749 / 1042;
const ENERGY_SPRITE_WIDTH = ENERGY_SPRITE_HEIGHT * ENERGY_ICON_ASPECT;
const ENERGY_SPACING = 0.3;

export class Board3dEnergySprite {
  private group: Group;
  private energyMeshes: Mesh[] = [];
  private static geometry: PlaneGeometry;
  private static readonly _qParent = new Quaternion();
  private static readonly _qCam = new Quaternion();
  private static readonly _qFlip = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI);

  constructor() {
    this.group = new Group();
    if (!Board3dEnergySprite.geometry) {
      Board3dEnergySprite.geometry = new PlaneGeometry(ENERGY_SPRITE_WIDTH, ENERGY_SPRITE_HEIGHT);
    }
  }

  static getEnergyIconPath(card: Card): string | null {
    return getCustomEnergyIconPath(card, true);
  }

  updateEnergies(
    energyCards: Card[],
    energyCardList: CardList,
    textures: Map<string, Texture>,
    cardBackTexture: Texture,
    resolveTextureKey: (card: Card) => string | null = (c) => Board3dEnergySprite.getEnergyIconPath(c),
  ): void {
    this.clear();

    const visibleCount = Math.min(energyCards.length, MAX_VISIBLE_ENERGIES);
    const cardLeftEdge = -1.25;
    const startX = cardLeftEdge + 0.15;

    for (let i = 0; i < visibleCount; i++) {
      const card = energyCards[i];
      const iconPath = resolveTextureKey(card);
      let texture: Texture;
      if (iconPath && textures.has(iconPath)) {
        texture = textures.get(iconPath)!;
      } else {
        texture = cardBackTexture;
      }

      const textureToUse = texture.clone();
      textureToUse.repeat.x = -1;
      textureToUse.offset.x = 1;

      const material = new MeshBasicMaterial({
        map: textureToUse,
        transparent: true,
        side: DoubleSide,
        alphaTest: 0.1,
      });

      const mesh = new Mesh(Board3dEnergySprite.geometry, material);
      mesh.position.set(startX + i * ENERGY_SPACING, 0.1, 1.75);

      mesh.userData.isEnergyIcon = true;
      mesh.userData.cardData = card;
      mesh.userData.cardList = energyCardList;

      this.group.add(mesh);
      this.energyMeshes.push(mesh);
    }
  }

  updateBillboards(camera: PerspectiveCamera): void {
    camera.getWorldQuaternion(Board3dEnergySprite._qCam);
    for (const mesh of this.energyMeshes) {
      const parent = mesh.parent;
      if (!parent) {
        mesh.quaternion.copy(Board3dEnergySprite._qCam).multiply(Board3dEnergySprite._qFlip);
        continue;
      }
      parent.getWorldQuaternion(Board3dEnergySprite._qParent);
      mesh.quaternion
        .copy(Board3dEnergySprite._qParent)
        .invert()
        .multiply(Board3dEnergySprite._qCam)
        .multiply(Board3dEnergySprite._qFlip);
    }
  }

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

  getGroup(): Group {
    return this.group;
  }

  dispose(): void {
    this.clear();
  }

  static disposeSharedResources(): void {
    if (Board3dEnergySprite.geometry) {
      Board3dEnergySprite.geometry.dispose();
    }
  }
}
