import { Injectable } from '@angular/core';
import { Raycaster, Vector2, Vector3, Euler, Plane, Camera, Scene, Object3D, Intersection, Mesh, CircleGeometry, MeshStandardMaterial, DoubleSide } from 'three';
import { PlayerType, SlotType, CardTarget } from 'ptcg-server';
import gsap from 'gsap';

export interface DropResult {
  handIndex: number;
  zone: CardTarget;
}

@Injectable()
export class Board3dInteractionService {
  private raycaster: Raycaster;
  private mouse: Vector2;
  private currentHoveredCard: Object3D | null = null;

  // Drag state
  private isDragging: boolean = false;
  private draggedCard: Object3D | null = null;
  private draggedCardHandIndex: number = -1;
  private draggedCardOriginalPosition: Vector3 = new Vector3();
  private draggedCardOriginalRotation: Euler = new Euler();
  private dragPlane: Plane = new Plane(new Vector3(0, 1, 0), 0);
  private dragOffset: Vector3 = new Vector3();

  // Drop zone indicators
  private dropZoneIndicators: Object3D[] = [];

  constructor() {
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
  }

  /**
   * Update mouse position and find card under cursor
   */
  onMouseMove(
    event: MouseEvent,
    camera: Camera,
    scene: Scene,
    canvas: HTMLCanvasElement
  ): Object3D | null {
    // Get canvas bounds for accurate coordinates
    const rect = canvas.getBoundingClientRect();

    // Convert to normalized device coordinates (-1 to +1)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, camera);

    // Find intersections with scene objects
    const intersects = this.raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const card = this.getCardFromIntersection(intersects[0]);
      if (card) {
        return card;
      }
    }

    return null;
  }

  /**
   * Handle click event
   */
  onClick(
    event: MouseEvent,
    camera: Camera,
    scene: Scene,
    canvas: HTMLCanvasElement
  ): Object3D | null {
    const card = this.onMouseMove(event, camera, scene, canvas);
    if (card) {
      // Card was clicked
      return card;
    }
    return null;
  }

  /**
   * Get the card object from an intersection
   * Traverses up the object hierarchy to find the card group
   */
  private getCardFromIntersection(intersection: Intersection): Object3D | null {
    let obj: Object3D | null = intersection.object;

    // Traverse up the hierarchy until we find a card
    while (obj) {
      if (obj.userData && obj.userData.isCard) {
        return obj;
      }
      obj = obj.parent;
    }

    return null;
  }

  /**
   * Get currently hovered card
   */
  getCurrentHoveredCard(): Object3D | null {
    return this.currentHoveredCard;
  }

  /**
   * Set currently hovered card
   */
  setCurrentHoveredCard(card: Object3D | null): void {
    this.currentHoveredCard = card;
  }

  /**
   * Check if a specific card is currently hovered
   */
  isCardHovered(card: Object3D): boolean {
    return this.currentHoveredCard === card;
  }

  /**
   * Clear hover state
   */
  clearHoverState(): void {
    this.currentHoveredCard = null;
  }

  /**
   * Handle mouse down - start dragging
   */
  onMouseDown(
    event: MouseEvent,
    camera: Camera,
    scene: Scene,
    canvas: HTMLCanvasElement
  ): Object3D | null {
    const card = this.onMouseMove(event, camera, scene, canvas);

    if (card && card.userData.isHandCard) {
      this.startDrag(card, event, camera);
      return card;
    }

    return null;
  }

  /**
   * Start dragging a card
   */
  private startDrag(
    card: Object3D,
    event: MouseEvent,
    camera: Camera
  ): void {
    this.isDragging = true;
    this.draggedCard = card;
    this.draggedCardHandIndex = card.userData.handIndex;

    // Store original position/rotation
    this.draggedCardOriginalPosition.copy(card.position);
    this.draggedCardOriginalRotation.copy(card.rotation);

    // Create horizontal drag plane at board level (Y=1)
    this.dragPlane.setFromNormalAndCoplanarPoint(
      new Vector3(0, 1, 0),
      new Vector3(0, 1, 0)
    );

    // Calculate offset between mouse ray and card position
    const intersection = new Vector3();
    this.raycaster.ray.intersectPlane(this.dragPlane, intersection);
    if (intersection) {
      this.dragOffset.subVectors(card.position, intersection);
    }

    // Visual feedback - lift card
    gsap.to(card.position, {
      y: card.position.y + 1.5,
      duration: 0.2,
      ease: 'power2.out'
    });

    gsap.to(card.scale, {
      x: 1.3, y: 1.3, z: 1.3,
      duration: 0.2,
      ease: 'power2.out'
    });

    gsap.to(card.rotation, {
      x: -0.1,
      duration: 0.2,
      ease: 'power2.out'
    });
  }

  /**
   * Handle mouse move during drag
   */
  onMouseMoveDrag(
    event: MouseEvent,
    camera: Camera,
    scene: Scene,
    canvas: HTMLCanvasElement
  ): void {
    if (!this.isDragging || !this.draggedCard) {
      return;
    }

    // Update raycaster
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, camera);

    // Intersect with drag plane
    const intersection = new Vector3();
    if (this.raycaster.ray.intersectPlane(this.dragPlane, intersection)) {
      // Move card to follow mouse
      this.draggedCard.position.copy(intersection.add(this.dragOffset));

      // Clamp position to board bounds
      this.draggedCard.position.x = Math.max(-22, Math.min(22, this.draggedCard.position.x));
      this.draggedCard.position.z = Math.max(-22, Math.min(22, this.draggedCard.position.z));

      // Highlight drop zones
      this.highlightNearestDropZone(this.draggedCard.position, scene);
    }
  }

  /**
   * Handle mouse up - end dragging
   */
  onMouseUp(
    event: MouseEvent,
    camera: Camera,
    scene: Scene,
    canvas: HTMLCanvasElement
  ): DropResult | null {
    if (!this.isDragging || !this.draggedCard) {
      return null;
    }

    // Find drop zone
    const dropZone = this.findDropZone(this.draggedCard.position);

    let result: DropResult | null = null;
    if (dropZone) {
      // Valid drop
      result = {
        handIndex: this.draggedCardHandIndex,
        zone: dropZone
      };
    } else {
      // Invalid drop - return to hand
      this.returnCardToHand(this.draggedCard);
    }

    // Reset drag state
    this.resetDragState();
    this.clearDropZoneHighlights(scene);

    return result;
  }

  /**
   * Find drop zone under card position
   */
  private findDropZone(position: Vector3): CardTarget | null {
    const ZONE_POSITIONS = {
      active: new Vector3(0, 0.1, 12),
      bench: [
        new Vector3(-12, 0.1, 18),
        new Vector3(-8, 0.1, 18),
        new Vector3(-4, 0.1, 18),
        new Vector3(0, 0.1, 18),
        new Vector3(4, 0.1, 18),
        new Vector3(8, 0.1, 18),
        new Vector3(12, 0.1, 18),
        new Vector3(16, 0.1, 18),
      ]
    };

    const SNAP_DISTANCE = 3.5;

    // Check active zone
    if (position.distanceTo(ZONE_POSITIONS.active) < SNAP_DISTANCE) {
      return {
        player: PlayerType.BOTTOM_PLAYER,
        slot: SlotType.ACTIVE,
        index: 0
      };
    }

    // Check bench zones
    for (let i = 0; i < ZONE_POSITIONS.bench.length; i++) {
      if (position.distanceTo(ZONE_POSITIONS.bench[i]) < SNAP_DISTANCE) {
        return {
          player: PlayerType.BOTTOM_PLAYER,
          slot: SlotType.BENCH,
          index: i
        };
      }
    }

    // Check general board area (fallback)
    if (position.z > 8 && position.z < 20) {
      return {
        player: PlayerType.BOTTOM_PLAYER,
        slot: SlotType.BOARD,
        index: 0
      };
    }

    return null;
  }

  /**
   * Return card to original hand position
   */
  private returnCardToHand(card: Object3D): void {
    gsap.to(card.position, {
      x: this.draggedCardOriginalPosition.x,
      y: this.draggedCardOriginalPosition.y,
      z: this.draggedCardOriginalPosition.z,
      duration: 0.3,
      ease: 'power2.out'
    });

    gsap.to(card.rotation, {
      x: this.draggedCardOriginalRotation.x,
      y: this.draggedCardOriginalRotation.y,
      z: this.draggedCardOriginalRotation.z,
      duration: 0.3,
      ease: 'power2.out'
    });

    gsap.to(card.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.3,
      ease: 'power2.in'
    });
  }

  /**
   * Reset drag state
   */
  private resetDragState(): void {
    this.isDragging = false;
    this.draggedCard = null;
    this.draggedCardHandIndex = -1;
  }

  /**
   * Create drop zone indicators
   */
  createDropZoneIndicators(scene: Scene): void {
    const ZONE_POSITIONS = {
      active: new Vector3(0, 0.05, 12),
      bench: [
        new Vector3(-12, 0.05, 18),
        new Vector3(-8, 0.05, 18),
        new Vector3(-4, 0.05, 18),
        new Vector3(0, 0.05, 18),
        new Vector3(4, 0.05, 18),
        new Vector3(8, 0.05, 18),
        new Vector3(12, 0.05, 18),
        new Vector3(16, 0.05, 18),
      ]
    };

    // Active zone indicator
    const activeIndicator = new Mesh(
      new CircleGeometry(2.5, 32),
      new MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0,
        side: DoubleSide
      })
    );
    activeIndicator.rotation.x = -Math.PI / 2;
    activeIndicator.position.copy(ZONE_POSITIONS.active);
    activeIndicator.userData.isDropZone = true;
    activeIndicator.userData.zoneType = 'active';
    scene.add(activeIndicator);
    this.dropZoneIndicators.push(activeIndicator);

    // Bench zone indicators
    ZONE_POSITIONS.bench.forEach((pos, i) => {
      const indicator = new Mesh(
        new CircleGeometry(2.5, 32),
        new MeshStandardMaterial({
          color: 0x00ff00,
          emissive: 0x00ff00,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0,
          side: DoubleSide
        })
      );
      indicator.rotation.x = -Math.PI / 2;
      indicator.position.copy(pos);
      indicator.userData.isDropZone = true;
      indicator.userData.zoneType = 'bench';
      indicator.userData.zoneIndex = i;
      scene.add(indicator);
      this.dropZoneIndicators.push(indicator);
    });
  }

  /**
   * Highlight nearest drop zone during drag
   */
  private highlightNearestDropZone(position: Vector3, scene: Scene): void {
    const SNAP_DISTANCE = 3.5;
    let nearestZone: Object3D | null = null;
    let minDistance = Infinity;

    // Find nearest drop zone
    this.dropZoneIndicators.forEach(obj => {
      const distance = position.distanceTo(obj.position);
      if (distance < SNAP_DISTANCE && distance < minDistance) {
        nearestZone = obj;
        minDistance = distance;
      }
    });

    // Update highlights
    this.dropZoneIndicators.forEach(obj => {
      const material = (obj as Mesh).material as MeshStandardMaterial;
      if (obj === nearestZone) {
        gsap.to(material, { opacity: 0.4, duration: 0.2 });
      } else {
        gsap.to(material, { opacity: 0, duration: 0.2 });
      }
    });
  }

  /**
   * Clear drop zone highlights
   */
  private clearDropZoneHighlights(scene: Scene): void {
    this.dropZoneIndicators.forEach(obj => {
      const material = (obj as Mesh).material as MeshStandardMaterial;
      gsap.to(material, { opacity: 0, duration: 0.2 });
    });
  }

  /**
   * Check if currently dragging
   */
  getIsDragging(): boolean {
    return this.isDragging;
  }

  /**
   * Cancel current drag
   */
  cancelDrag(): void {
    if (this.isDragging && this.draggedCard) {
      this.returnCardToHand(this.draggedCard);
      this.resetDragState();
    }
  }
}
