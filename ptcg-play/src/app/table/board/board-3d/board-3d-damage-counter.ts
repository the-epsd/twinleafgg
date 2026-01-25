import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  CanvasTexture,
  Group,
  DoubleSide
} from 'three';

const COUNTER_SIZE = 0.96; // Twice as large: 0.48 * 2 = 0.96 units

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
      alphaTest: 0.1,
      color: 0xd0d0d0 // Darkened to prevent bloom (luminance ~0.815, below 0.85 threshold)
    });

    this.mesh = new Mesh(geometry, material);

    // Position at top-right corner matching 2D: top: -10%, right: -10%
    // Card is ~2.5 units wide, so -10% right = ~0.25 units from right edge = 1.25
    // Card is ~3.5 units tall, so -10% top = ~0.35 units from top edge = -1.75
    this.mesh.position.set(1.25, 0.15, -1.75);
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

    const centerX = 64;
    const centerY = 64;
    const radius = 58;

    // Create radial gradient matching 2D: #ffeb3b → #ff9800 → #ff5722
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#ffeb3b');  // Yellow center
    gradient.addColorStop(0.5, '#ff9800'); // Orange middle
    gradient.addColorStop(1, '#ff5722');   // Red edge

    // Draw background circle with gradient
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw white border (1px solid)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2; // Scaled for canvas size
    ctx.stroke();

    // Draw damage number with text shadow (4-directional black shadow)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial Black, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text shadow (4 directions)
    ctx.fillStyle = '#000000';
    ctx.fillText(damage.toString(), centerX - 0.5, centerY - 0.5 + 4); // Top-left shadow
    ctx.fillText(damage.toString(), centerX + 0.5, centerY - 0.5 + 4); // Top-right shadow
    ctx.fillText(damage.toString(), centerX - 0.5, centerY + 0.5 + 4); // Bottom-left shadow
    ctx.fillText(damage.toString(), centerX + 0.5, centerY + 0.5 + 4); // Bottom-right shadow

    // Draw main text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(damage.toString(), centerX, centerY + 4);

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
