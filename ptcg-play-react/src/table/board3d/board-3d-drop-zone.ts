import {
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  DoubleSide,
  Vector3,
  Scene,
  Texture,
  Group
} from 'three';
import { PlayerType, SlotType } from 'ptcg-server';
import gsap from 'gsap';

export enum DropZoneType {
  ACTIVE = 'active',
  BENCH = 'bench',
  BENCH_GENERAL = 'bench_general',
  STADIUM = 'stadium',
  BOARD = 'board',
  SUPPORTER = 'supporter'
}

export enum DropZoneState {
  HIDDEN = 'hidden',
  IDLE = 'idle',
  VALID = 'valid',
  INVALID = 'invalid',
  OCCUPIED = 'occupied'
}

export interface DropZoneConfig {
  type: DropZoneType;
  position: Vector3;
  player: PlayerType;
  index: number;
  width?: number;
  height?: number;
  texture?: Texture;
}

// Visual configuration for drop zone states
// When texture is present, base opacity is higher to ensure visibility
const STATE_COLORS = {
  [DropZoneState.HIDDEN]: { color: 0x0052ff, emissive: 0x0052ff, opacity: 0 },
  [DropZoneState.IDLE]: { color: 0x0052ff, emissive: 0x0052ff, opacity: 0.15 },
  [DropZoneState.VALID]: { color: 0x00ff00, emissive: 0x00ff00, opacity: 0.4 },
  [DropZoneState.INVALID]: { color: 0xff3333, emissive: 0xff3333, opacity: 0.3 },
  [DropZoneState.OCCUPIED]: { color: 0xffaa00, emissive: 0xffaa00, opacity: 0.1 }
};

// Base opacity for zones with texture (always visible)
const TEXTURE_BASE_OPACITY = 0.01;

// Outline color for board spot borders (white)
const OUTLINE_COLOR = 0xffffff;

// Border thickness in world units
const OUTLINE_THICKNESS = 0.01;

export class Board3dDropZone {
  private mesh: Mesh;
  private material: MeshStandardMaterial;
  private outlineGroup: Group | null = null;
  private outlineMaterial: MeshBasicMaterial | null = null;
  private config: DropZoneConfig;
  private currentState: DropZoneState = DropZoneState.HIDDEN;
  private pulseAnimation: gsap.core.Tween | null = null;
  private hasTexture: boolean = false;

  // Default card dimensions in world units
  private static readonly DEFAULT_WIDTH = 2.8;
  private static readonly DEFAULT_HEIGHT = 3.8;

  constructor(config: DropZoneConfig) {
    this.config = config;

    const width = config.width ?? Board3dDropZone.DEFAULT_WIDTH;
    const height = config.height ?? Board3dDropZone.DEFAULT_HEIGHT;

    // Create plane geometry for the drop zone
    const geometry = new PlaneGeometry(width, height);

    // Store texture flag
    this.hasTexture = !!config.texture;

    // Create material with initial state - always visible with texture if provided
    const baseOpacity = this.hasTexture ? TEXTURE_BASE_OPACITY : STATE_COLORS[DropZoneState.HIDDEN].opacity;
    // Higher emissive intensity for BENCH_GENERAL zones for better visibility
    const emissiveIntensity = config.type === DropZoneType.BENCH_GENERAL ? 1.0 : 0.5;
    this.material = new MeshStandardMaterial({
      map: config.texture || undefined,
      color: 0xffffff, // White to show texture properly
      emissive: STATE_COLORS[DropZoneState.HIDDEN].emissive,
      emissiveIntensity: emissiveIntensity,
      transparent: true,
      opacity: baseOpacity,
      side: DoubleSide,
      depthWrite: false
    });

    this.mesh = new Mesh(geometry, this.material);

    // Rotate to lay flat on the board
    this.mesh.rotation.x = -Math.PI / 2;

    // Position slightly above the board to prevent z-fighting
    this.mesh.position.copy(config.position);
    this.mesh.position.y = 0.02;

    // Store metadata for raycasting/identification
    this.mesh.userData = {
      isDropZone: true,
      zoneType: config.type,
      zoneIndex: config.index,
      player: config.player
    };

    // Create outline for non-BENCH zones only (bench gets standalone outlines from board component)
    if (config.type !== DropZoneType.BENCH) {
      const outlineY = 0.15;
      const minX = config.position.x - width / 2;
      const maxX = config.position.x + width / 2;
      const minZ = config.position.z - height / 2;
      const maxZ = config.position.z + height / 2;
      const t = OUTLINE_THICKNESS;
      this.outlineMaterial = new MeshBasicMaterial({
        color: OUTLINE_COLOR,
        transparent: true,
        opacity: 0,
        side: DoubleSide,
        depthTest: true
      });
      this.outlineGroup = new Group();

      const topEdge = new Mesh(new PlaneGeometry(width + t * 2, t), this.outlineMaterial);
      topEdge.rotation.x = -Math.PI / 2;
      topEdge.position.set(config.position.x, outlineY, maxZ + t / 2);
      this.outlineGroup.add(topEdge);

      const bottomEdge = new Mesh(new PlaneGeometry(width + t * 2, t), this.outlineMaterial);
      bottomEdge.rotation.x = -Math.PI / 2;
      bottomEdge.position.set(config.position.x, outlineY, minZ - t / 2);
      this.outlineGroup.add(bottomEdge);

      const leftEdge = new Mesh(new PlaneGeometry(t, height), this.outlineMaterial);
      leftEdge.rotation.x = -Math.PI / 2;
      leftEdge.position.set(minX - t / 2, outlineY, config.position.z);
      this.outlineGroup.add(leftEdge);

      const rightEdge = new Mesh(new PlaneGeometry(t, height), this.outlineMaterial);
      rightEdge.rotation.x = -Math.PI / 2;
      rightEdge.position.set(maxX + t / 2, outlineY, config.position.z);
      this.outlineGroup.add(rightEdge);

      this.outlineGroup.renderOrder = 100;
    }
  }

  getMesh(): Mesh {
    return this.mesh;
  }

  getConfig(): DropZoneConfig {
    return this.config;
  }

  getState(): DropZoneState {
    return this.currentState;
  }

  getPosition(): Vector3 {
    return this.config.position.clone();
  }

  /**
   * Set the visual state of the drop zone
   */
  setState(state: DropZoneState, animate: boolean = true): void {
    if (this.currentState === state) {
      return;
    }

    // Stop any existing pulse animation
    if (this.pulseAnimation) {
      this.pulseAnimation.kill();
      this.pulseAnimation = null;
    }

    this.currentState = state;
    const stateConfig = STATE_COLORS[state];

    // Increase opacity for BENCH_GENERAL zones in VALID state for better visibility
    let opacity = stateConfig.opacity;
    if (this.config.type === DropZoneType.BENCH_GENERAL && state === DropZoneState.VALID) {
      opacity = 0.6; // Higher opacity for better visibility of large zone
    }

    // If texture is present, ensure minimum opacity for visibility
    const targetOpacity = this.hasTexture
      ? Math.max(opacity, TEXTURE_BASE_OPACITY)
      : opacity;

    if (animate) {
      gsap.to(this.material, {
        opacity: targetOpacity,
        duration: 0.2,
        ease: 'power2.out'
      });

      // Update emissive for all zones (including those with textures) to show state color
      gsap.to(this.material.emissive, {
        r: ((stateConfig.emissive >> 16) & 255) / 255,
        g: ((stateConfig.emissive >> 8) & 255) / 255,
        b: (stateConfig.emissive & 255) / 255,
        duration: 0.2
      });

      // Only update base color if no texture (texture uses white color)
      if (!this.hasTexture) {
        gsap.to(this.material.color, {
          r: ((stateConfig.color >> 16) & 255) / 255,
          g: ((stateConfig.color >> 8) & 255) / 255,
          b: (stateConfig.color & 255) / 255,
          duration: 0.2
        });
      }
    } else {
      this.material.opacity = targetOpacity;
      // Always update emissive to show state color
      this.material.emissive.setHex(stateConfig.emissive);
      if (!this.hasTexture) {
        this.material.color.setHex(stateConfig.color);
      }
    }

    // Start pulse animation for valid state
    if (state === DropZoneState.VALID) {
      this.startPulse();
    }
  }

  /**
   * Start pulsing animation for valid drop targets
   */
  private startPulse(): void {
    this.pulseAnimation = gsap.to(this.material, {
      opacity: 0.6,
      duration: 0.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  /**
   * Check if a position is within snap distance of this zone
   */
  isNearPosition(position: Vector3, snapDistance: number = 3.5): boolean {
    const zonePos = this.config.position;
    const dx = position.x - zonePos.x;
    const dz = position.z - zonePos.z;
    return Math.sqrt(dx * dx + dz * dz) < snapDistance;
  }

  /**
   * Get distance from a position to this zone
   */
  distanceToPosition(position: Vector3): number {
    const zonePos = this.config.position;
    const dx = position.x - zonePos.x;
    const dz = position.z - zonePos.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  /**
   * Check if a position is within the rectangular bounds of this zone
   * Useful for large zones (BENCH_GENERAL, BOARD) where distance-to-center is inaccurate
   */
  isPositionInBounds(position: Vector3): boolean {
    const zonePos = this.config.position;
    const width = this.config.width ?? Board3dDropZone.DEFAULT_WIDTH;
    const height = this.config.height ?? Board3dDropZone.DEFAULT_HEIGHT;

    // Check if position is within rectangular bounds
    // X bounds: [centerX - width/2, centerX + width/2]
    // Z bounds: [centerZ - height/2, centerZ + height/2]
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const inXBounds = position.x >= (zonePos.x - halfWidth) && position.x <= (zonePos.x + halfWidth);
    const inZBounds = position.z >= (zonePos.z - halfHeight) && position.z <= (zonePos.z + halfHeight);

    return inXBounds && inZBounds;
  }

  /**
   * Show the drop zone (transition to idle state)
   */
  show(): void {
    this.setState(DropZoneState.IDLE);
  }

  /**
   * Hide the drop zone
   */
  hide(): void {
    // If texture is present, keep it visible at minimum opacity
    if (this.hasTexture) {
      this.material.opacity = TEXTURE_BASE_OPACITY;
      this.currentState = DropZoneState.HIDDEN;
    } else {
      this.setState(DropZoneState.HIDDEN);
    }
  }

  /**
   * Set as valid drop target
   */
  setValid(): void {
    this.setState(DropZoneState.VALID);
  }

  /**
   * Set as invalid drop target
   */
  setInvalid(): void {
    this.setState(DropZoneState.INVALID);
  }

  /**
   * Set as occupied (has a card)
   */
  setOccupied(): void {
    this.setState(DropZoneState.OCCUPIED);
  }

  /**
   * Add this drop zone to a scene
   */
  addToScene(scene: Scene): void {
    scene.add(this.mesh);
    if (this.outlineGroup) {
      scene.add(this.outlineGroup);
    }
  }

  /**
   * Remove this drop zone from a scene
   */
  removeFromScene(scene: Scene): void {
    scene.remove(this.mesh);
    if (this.outlineGroup) {
      scene.remove(this.outlineGroup);
    }
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    if (this.pulseAnimation) {
      this.pulseAnimation.kill();
      this.pulseAnimation = null;
    }
    this.mesh.geometry.dispose();
    this.material.dispose();
    if (this.outlineGroup) {
      for (const child of this.outlineGroup.children) {
        if (child instanceof Mesh) {
          child.geometry.dispose();
        }
      }
      this.outlineMaterial?.dispose();
    }
  }
}
