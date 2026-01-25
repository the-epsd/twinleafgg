import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  CanvasTexture,
  Group,
  DoubleSide
} from 'three';

const COUNTER_SIZE = 1.2;

export class Board3dDamageCounter {
  private group: Group;
  private mesh: Mesh | null = null;
  private currentDamage: number = 0;

  constructor() {
    this.group = new Group();
  }

  /**
   * Update the damage counter display
   */
  updateDamage(damage: number): void {
    if (damage === this.currentDamage && this.mesh) {
      return; // No change needed
    }

    this.currentDamage = damage;

    // Clear existing mesh
    this.clear();

    if (damage <= 0) {
      return; // Don't show counter for 0 damage
    }

    // Create canvas texture with damage number
    const texture = this.createDamageTexture(damage);

    const geometry = new PlaneGeometry(COUNTER_SIZE, COUNTER_SIZE);
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: DoubleSide,
      alphaTest: 0.1
    });

    this.mesh = new Mesh(geometry, material);

    // Position at top-right corner of the card
    this.mesh.position.set(1.0, 0.15, -1.2);
    this.mesh.rotation.x = -Math.PI / 2;

    this.group.add(this.mesh);
  }

  /**
   * Create a canvas texture with the damage number
   */
  private createDamageTexture(damage: number): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Draw background circle
    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3333';
    ctx.fill();

    // Draw border
    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw damage number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(damage.toString(), 64, 68);

    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  /**
   * Clear the damage counter
   */
  clear(): void {
    if (this.mesh) {
      this.group.remove(this.mesh);
      (this.mesh.material as MeshBasicMaterial).map?.dispose();
      (this.mesh.material as MeshBasicMaterial).dispose();
      this.mesh.geometry.dispose();
      this.mesh = null;
    }
  }

  /**
   * Get the group to add to a parent
   */
  getGroup(): Group {
    return this.group;
  }

  /**
   * Get current damage value
   */
  getDamage(): number {
    return this.currentDamage;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.clear();
    this.currentDamage = 0;
  }
}
