import {
  CanvasTexture,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
} from 'three';
import { BOARD_DAMAGE_COUNTER_SIZE, paintPendingPlaceDamageChip } from './board-damage-counter-paint';

/** Centered on card art; large for Put-damage assignment visibility. */
const CHIP_SIZE = 1.32;
/** Card group space: origin ≈ card center; Y = above the face, Z = along portrait “height”. */
const PENDING_REST_X = 0;
const PENDING_REST_Y = 0.22;
const PENDING_REST_Z = 0.05;

/**
 * Red disc showing how much damage the player has assigned to this Pokémon in the current Put damage prompt.
 */
export class Board3dPendingPlaceDamage {
  private group = new Group();
  private mesh: Mesh | null = null;
  private currentAmount = 0;

  update(amount: number): void {
    if (amount <= 0) {
      this.clearMeshOnly();
      this.currentAmount = 0;
      return;
    }

    if (amount === this.currentAmount && this.mesh) {
      return;
    }

    this.currentAmount = amount;
    this.clearMeshOnly();

    const canvas = document.createElement('canvas');
    canvas.width = BOARD_DAMAGE_COUNTER_SIZE;
    canvas.height = BOARD_DAMAGE_COUNTER_SIZE;
    const ctx = canvas.getContext('2d')!;
    paintPendingPlaceDamageChip(ctx, amount);

    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;

    const geometry = new PlaneGeometry(CHIP_SIZE, CHIP_SIZE);
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: DoubleSide,
      alphaTest: 0.1,
      color: 0xffffff,
    });

    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(PENDING_REST_X, PENDING_REST_Y, PENDING_REST_Z);
    this.mesh.rotation.x = -Math.PI / 2;
    this.group.add(this.mesh);
  }

  private clearMeshOnly(): void {
    if (this.mesh) {
      this.group.remove(this.mesh);
      (this.mesh.material as MeshBasicMaterial).map?.dispose();
      (this.mesh.material as MeshBasicMaterial).dispose();
      this.mesh.geometry.dispose();
      this.mesh = null;
    }
  }

  clear(): void {
    this.clearMeshOnly();
    this.currentAmount = 0;
  }

  getGroup(): Group {
    return this.group;
  }

  dispose(): void {
    this.clear();
  }
}
