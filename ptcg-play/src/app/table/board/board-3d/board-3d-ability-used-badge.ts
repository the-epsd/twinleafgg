import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  CanvasTexture,
  Group,
  DoubleSide
} from 'three';

const BADGE_WIDTH = 2.0; // Width of badge in 3D units
const BADGE_HEIGHT = 0.6; // Height of badge in 3D units

export class Board3dAbilityUsedBadge {
  private group: Group;
  private mesh: Mesh | null = null;
  private isVisible: boolean = false;

  constructor() {
    this.group = new Group();
  }

  /**
   * Update the ability used badge display
   */
  updateAbilityUsed(hasAbilityUsed: boolean): void {
    if (hasAbilityUsed === this.isVisible && this.mesh) {
      return; // No change needed
    }

    this.isVisible = hasAbilityUsed;

    // Clear existing mesh
    this.clear();

    if (!hasAbilityUsed) {
      return; // Don't show badge if ability not used
    }

    // Create canvas texture with "Ability Used" text
    const texture = this.createBadgeTexture();

    const geometry = new PlaneGeometry(BADGE_WIDTH, BADGE_HEIGHT);
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: DoubleSide,
      alphaTest: 0.1,
      color: 0xd0d0d0 // Darkened to prevent bloom (luminance ~0.815, below 0.85 threshold)
    });

    this.mesh = new Mesh(geometry, material);

    // Position centered on card (matching 2D: top: 50%, left: 50%)
    // Card center is at (0, 0, 0), so badge should be at center
    this.mesh.position.set(0, 0.1, 0); // Slightly above card surface
    this.mesh.rotation.x = -Math.PI / 2; // Rotate to face up

    this.group.add(this.mesh);
  }

  /**
   * Create a canvas texture with the "Ability Used" badge
   */
  private createBadgeTexture(): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const centerX = 256;
    const centerY = 64;
    const width = 480;
    const height = 100;
    const cornerRadius = 12;

    // Create red background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#f44336'); // Red top
    gradient.addColorStop(1, '#c62828'); // Darker red bottom

    // Draw rounded rectangle background
    ctx.beginPath();
    ctx.moveTo(centerX - width / 2 + cornerRadius, centerY - height / 2);
    ctx.lineTo(centerX + width / 2 - cornerRadius, centerY - height / 2);
    ctx.quadraticCurveTo(centerX + width / 2, centerY - height / 2, centerX + width / 2, centerY - height / 2 + cornerRadius);
    ctx.lineTo(centerX + width / 2, centerY + height / 2 - cornerRadius);
    ctx.quadraticCurveTo(centerX + width / 2, centerY + height / 2, centerX + width / 2 - cornerRadius, centerY + height / 2);
    ctx.lineTo(centerX - width / 2 + cornerRadius, centerY + height / 2);
    ctx.quadraticCurveTo(centerX - width / 2, centerY + height / 2, centerX - width / 2, centerY + height / 2 - cornerRadius);
    ctx.lineTo(centerX - width / 2, centerY - height / 2 + cornerRadius);
    ctx.quadraticCurveTo(centerX - width / 2, centerY - height / 2, centerX - width / 2 + cornerRadius, centerY - height / 2);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw white border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw "Ability Used" text with shadow
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text shadow (4 directions)
    ctx.fillStyle = '#000000';
    const text = 'Ability Used';
    ctx.fillText(text, centerX - 1, centerY - 1);
    ctx.fillText(text, centerX + 1, centerY - 1);
    ctx.fillText(text, centerX - 1, centerY + 1);
    ctx.fillText(text, centerX + 1, centerY + 1);

    // Draw main text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, centerX, centerY);

    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  /**
   * Clear the badge
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
   * Check if badge is currently visible
   */
  getIsVisible(): boolean {
    return this.isVisible;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.clear();
    this.isVisible = false;
  }
}
