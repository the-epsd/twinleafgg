import { Injectable } from '@angular/core';
import { Raycaster, Vector2, Vector3, Euler, Plane, Camera, Scene, Object3D, Intersection, Texture } from 'three';
import { PlayerType, SlotType, CardTarget, SuperType, Stage, TrainerType, Card, PokemonCard, TrainerCard } from 'ptcg-server';
import gsap from 'gsap';
import { Board3dDropZone, DropZoneType, DropZoneState, DropZoneConfig } from '../board-3d/board-3d-drop-zone';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { ZONE_POSITIONS, SNAP_DISTANCE, getBenchPositions } from '../board-3d/board-3d-zone-positions';

export interface DropResult {
  action: 'playCard' | 'retreat' | 'click';
  handIndex?: number;
  benchIndex?: number;
  zone?: CardTarget;
  clickedCard?: Object3D;
}

export interface DragContext {
  source: 'hand' | 'board';
  cardIndex: number;
  card: Card;
  superType: SuperType;
  stage?: Stage;
  trainerType?: TrainerType;
  originalTarget?: CardTarget;
}

@Injectable()
export class Board3dInteractionService {
  private raycaster: Raycaster;
  private mouse: Vector2;
  private currentHoveredCard: Object3D | null = null;

  // Raycasting optimization
  private interactiveObjects: Object3D[] = []; // Cache of interactive objects for faster raycasting
  private lastRaycastTime: number = 0;
  private raycastThrottleMs: number = 16; // ~60fps (1000/60 ≈ 16.67ms)
  private lastMousePosition: Vector2 = new Vector2();
  private cachedRaycastResult: Object3D | null = null;

  // Drag state
  private isDragging: boolean = false;
  private draggedCard: Object3D | null = null;
  private draggedCardHandIndex: number = -1;
  private draggedCardOriginalPosition: Vector3 = new Vector3();
  private draggedCardOriginalRotation: Euler = new Euler();
  private draggedCardOriginalScale: Vector3 = new Vector3();
  private dragPlane: Plane = new Plane(new Vector3(0, 1, 0), 0);
  private dragOffset: Vector3 = new Vector3();
  private previousDragPosition: Vector3 = new Vector3();
  private dragVelocity: Vector3 = new Vector3();

  // Click detection
  private mouseDownPosition: Vector2 = new Vector2();
  private mouseDownCard: Object3D | null = null;
  private clickThreshold: number = 5; // pixels

  // Pending drag state (before threshold exceeded)
  private pendingDragCard: Object3D | null = null;
  private pendingDragCamera: Camera | null = null;

  // Current drag context
  private currentDragContext: DragContext | null = null;

  // Drop zones
  private dropZones: Board3dDropZone[] = [];
  private occupiedZones: Set<string> = new Set();
  private slotGridTexture: Texture | null = null;
  private currentBenchSizes: { bottom: number; top: number } = { bottom: 5, top: 5 };

  constructor(private assetLoader: Board3dAssetLoaderService) {
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
  }

  /**
   * Update the list of interactive objects for optimized raycasting
   * Should be called when cards or drop zones are added/removed
   */
  updateInteractiveObjects(scene: Scene): void {
    this.interactiveObjects = [];
    scene.traverse((object: Object3D) => {
      // Only include objects that can be interacted with
      if (object.userData && (object.userData.isCard || object.userData.isDropZone)) {
        this.interactiveObjects.push(object);
      }
    });
  }

  /**
   * Update mouse position and find card under cursor
   * Optimized with throttling and caching
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
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Check if mouse actually moved (cache result if not)
    const mouseMoved = Math.abs(mouseX - this.lastMousePosition.x) > 0.001 ||
                      Math.abs(mouseY - this.lastMousePosition.y) > 0.001;

    if (!mouseMoved && this.cachedRaycastResult !== undefined) {
      return this.cachedRaycastResult;
    }

    // Throttle raycasting to max 60fps
    const currentTime = performance.now();
    const timeSinceLastRaycast = currentTime - this.lastRaycastTime;
    
    if (timeSinceLastRaycast < this.raycastThrottleMs && !mouseMoved) {
      return this.cachedRaycastResult;
    }

    this.mouse.x = mouseX;
    this.mouse.y = mouseY;
    this.lastMousePosition.set(mouseX, mouseY);
    this.lastRaycastTime = currentTime;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, camera);

    // Use cached interactive objects if available, otherwise fall back to scene traversal
    const objectsToTest = this.interactiveObjects.length > 0 
      ? this.interactiveObjects 
      : scene.children;

    // Find intersections with interactive objects only (much faster than entire scene)
    const intersects = this.raycaster.intersectObjects(objectsToTest, true);

    if (intersects.length > 0) {
      const card = this.getCardFromIntersection(intersects[0]);
      this.cachedRaycastResult = card;
      return card;
    }

    this.cachedRaycastResult = null;
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
   * Handle mouse down - prepare for potential drag (deferred until threshold)
   */
  onMouseDown(
    event: MouseEvent,
    camera: Camera,
    scene: Scene,
    canvas: HTMLCanvasElement
  ): Object3D | null {
    // Track mouse down position for click detection
    this.mouseDownPosition.set(event.clientX, event.clientY);

    const card = this.onMouseMove(event, camera, scene, canvas);
    this.mouseDownCard = card;

    // Clear any previous pending drag
    this.pendingDragCard = null;
    this.pendingDragCamera = null;

    if (card) {
      // Check if card is draggable, but DON'T start drag yet - wait for threshold
      if (card.userData.isHandCard) {
        // Store pending drag info - will start on move threshold
        this.pendingDragCard = card;
        this.pendingDragCamera = camera;
        return card;
      }
      // Board card dragging (for retreat)
      if (card.userData.isBoardCard && card.userData.cardTarget) {
        const target = card.userData.cardTarget as CardTarget;
        // Only allow dragging active/bench Pokemon for retreat
        if (target.slot === SlotType.ACTIVE || target.slot === SlotType.BENCH) {
          // Store pending drag info - will start on move threshold
          this.pendingDragCard = card;
          this.pendingDragCamera = camera;
          return card;
        }
      }
    }

    return null;
  }

  /**
   * Create drag context from the card being dragged
   */
  private createDragContext(card: Object3D, source: 'hand' | 'board'): void {
    const cardData = card.userData.cardData as Card;
    if (!cardData) {
      this.currentDragContext = null;
      return;
    }

    this.currentDragContext = {
      source,
      cardIndex: source === 'hand' ? card.userData.handIndex : card.userData.boardIndex,
      card: cardData,
      superType: cardData.superType,
      stage: (cardData as PokemonCard).stage,
      trainerType: (cardData as TrainerCard).trainerType,
      originalTarget: source === 'board' ? card.userData.cardTarget : undefined
    };

    // Show valid drop zones based on card type
    this.showValidDropZones();
  }

  /**
   * Check if a drop zone is valid for the current drag context
   */
  private isValidDropZone(zone: Board3dDropZone): boolean {
    if (!this.currentDragContext) {
      return false;
    }

    const config = zone.getConfig();
    const zoneKey = `${config.player}_${config.type}_${config.index}`;
    const isOccupied = this.occupiedZones.has(zoneKey);

    // Board-to-board (retreat)
    if (this.currentDragContext.source === 'board') {
      const originalTarget = this.currentDragContext.originalTarget;
      if (!originalTarget) return false;

      // Active to Bench
      if (originalTarget.slot === SlotType.ACTIVE && config.type === DropZoneType.BENCH) {
        return !isOccupied;
      }
      // Bench to Active
      if (originalTarget.slot === SlotType.BENCH && config.type === DropZoneType.ACTIVE) {
        return true; // Can always switch to active (will swap)
      }
      return false;
    }

    // Hand to Board
    const { superType, stage, trainerType } = this.currentDragContext;

    switch (superType) {
      case SuperType.POKEMON:
        // Basic Pokemon can only go to empty bench/active slots
        if (stage === Stage.BASIC) {
          if (config.type === DropZoneType.BENCH || config.type === DropZoneType.ACTIVE) {
            return !isOccupied;
          }
        }
        // Evolution Pokemon need to target a matching base Pokemon
        if (stage === Stage.STAGE_1 || stage === Stage.STAGE_2 ||
          stage === Stage.VMAX || stage === Stage.VSTAR || stage === Stage.MEGA) {
          if (config.type === DropZoneType.BENCH || config.type === DropZoneType.ACTIVE) {
            return isOccupied; // Must have a Pokemon to evolve
          }
        }
        return false;

      case SuperType.TRAINER:
        // Stadium cards go to stadium zone
        if (trainerType === TrainerType.STADIUM) {
          return config.type === DropZoneType.STADIUM;
        }
        // Supporter cards go to supporter zone
        if (trainerType === TrainerType.SUPPORTER) {
          return config.type === DropZoneType.SUPPORTER;
        }
        // Tool cards need to target a Pokemon
        if (trainerType === TrainerType.TOOL) {
          return (config.type === DropZoneType.BENCH || config.type === DropZoneType.ACTIVE) && isOccupied;
        }
        // Item cards go to board zone
        return config.type === DropZoneType.BOARD;

      case SuperType.ENERGY:
        // Energy attaches to Pokemon
        return (config.type === DropZoneType.BENCH || config.type === DropZoneType.ACTIVE) && isOccupied;

      default:
        return false;
    }
  }

  /**
   * Show valid drop zones based on current drag context
   */
  private showValidDropZones(): void {
    for (const zone of this.dropZones) {
      if (this.isValidDropZone(zone)) {
        zone.setValid();
      } else {
        zone.setState(DropZoneState.IDLE);
      }
    }
  }

  /**
   * Update occupied zones from game state
   */
  updateOccupiedZones(
    bottomActive: boolean,
    bottomBench: boolean[],
    topActive: boolean,
    topBench: boolean[]
  ): void {
    this.occupiedZones.clear();

    if (bottomActive) {
      this.occupiedZones.add(`${PlayerType.BOTTOM_PLAYER}_${DropZoneType.ACTIVE}_0`);
    }
    bottomBench.forEach((occupied, i) => {
      if (occupied) {
        this.occupiedZones.add(`${PlayerType.BOTTOM_PLAYER}_${DropZoneType.BENCH}_${i}`);
      }
    });

    if (topActive) {
      this.occupiedZones.add(`${PlayerType.TOP_PLAYER}_${DropZoneType.ACTIVE}_0`);
    }
    topBench.forEach((occupied, i) => {
      if (occupied) {
        this.occupiedZones.add(`${PlayerType.TOP_PLAYER}_${DropZoneType.BENCH}_${i}`);
      }
    });

    // Update zone visual states
    for (const zone of this.dropZones) {
      const config = zone.getConfig();
      const zoneKey = `${config.player}_${config.type}_${config.index}`;
      if (this.occupiedZones.has(zoneKey)) {
        zone.setOccupied();
      }
    }
  }

  /**
   * Start dragging a card
   */
  private startDrag(
    card: Object3D,
    event: MouseEvent,
    camera: Camera
  ): void {
    // Kill any existing animations on this card to prevent conflicts with hover
    gsap.killTweensOf(card.position);
    gsap.killTweensOf(card.rotation);
    gsap.killTweensOf(card.scale);

    this.isDragging = true;
    this.draggedCard = card;
    this.draggedCardHandIndex = card.userData.handIndex;

    // Store original position/rotation/scale
    this.draggedCardOriginalPosition.copy(card.position);
    this.draggedCardOriginalRotation.copy(card.rotation);
    this.draggedCardOriginalScale.copy(card.scale);

    // Create horizontal drag plane at elevated level (Y=2.0) to prevent clipping
    // This matches the minimum height we enforce during drag
    this.dragPlane.setFromNormalAndCoplanarPoint(
      new Vector3(0, 1, 0),
      new Vector3(0, 2.0, 0)
    );

    // Calculate offset between mouse ray and card's WORLD position
    // First, get the card's current world position
    const cardWorldPos = new Vector3();
    card.getWorldPosition(cardWorldPos);

    // Calculate intersection with drag plane
    const intersection = new Vector3();
    if (this.raycaster.ray.intersectPlane(this.dragPlane, intersection)) {
      // Calculate offset to maintain relative position
      this.dragOffset.subVectors(cardWorldPos, intersection);
    } else {
      // Fallback: set offset to zero if no intersection
      this.dragOffset.set(0, 0, 0);
    }

    // Initialize previous position for velocity calculation
    this.previousDragPosition.copy(cardWorldPos);
    this.dragVelocity.set(0, 0, 0);

    // Visual feedback - lift card high enough to prevent clipping when rotated
    // Card is ~3.5 units tall, rotated up to ~0.3 radians, so need at least 3.5 * sin(0.3) ≈ 1.05
    // Add extra margin for safety: lift to Y=3.0 (well above board at Y=0.1)
    const liftHeight = 3.0;

    // Calculate local Y position for the lift (cardWorldPos already calculated above)
    if (card.parent) {
      const localLiftPos = card.parent.worldToLocal(new Vector3(cardWorldPos.x, liftHeight, cardWorldPos.z));
      gsap.to(card.position, {
        y: localLiftPos.y,
        duration: 0.2,
        ease: 'power2.out'
      });
    } else {
      gsap.to(card.position, {
        y: liftHeight,
        duration: 0.2,
        ease: 'power2.out'
      });
    }

    gsap.to(card.scale, {
      x: 1.3, y: 1.3, z: 1.3,
      duration: 0.2,
      ease: 'power2.out'
    });

    // Initialize rotation to flat (will be updated by physics during drag)
    gsap.to(card.rotation, {
      x: 0,
      y: 0,
      z: 0,
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
    // Check if we have a pending drag that needs to be started
    if (this.pendingDragCard && !this.isDragging) {
      const dx = event.clientX - this.mouseDownPosition.x;
      const dy = event.clientY - this.mouseDownPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= this.clickThreshold) {
        // Start actual drag now that threshold is exceeded
        this.startDrag(this.pendingDragCard, event, this.pendingDragCamera!);
        this.createDragContext(
          this.pendingDragCard,
          this.pendingDragCard.userData.isHandCard ? 'hand' : 'board'
        );
        this.pendingDragCard = null;
        this.pendingDragCamera = null;
      }
    }

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
      // Calculate target world position
      const targetWorldPos = intersection.add(this.dragOffset);

      // Allow dragging anywhere - don't clamp to board bounds
      // This allows cards to be dragged to hand area (z=30) and anywhere else

      // Maintain lifted height to prevent clipping when rotated
      // Card is ~3.5 units tall, max rotation ~0.3 radians
      // Need at least: 3.5 * sin(0.3) ≈ 1.05, plus margin = 3.0
      const liftHeight = 3.0;
      targetWorldPos.y = liftHeight;

      // Calculate velocity for physics-based rotation (using X and Z only for rotation)
      // Use previous position to calculate velocity (change per frame)
      const previousPos2D = new Vector3(this.previousDragPosition.x, 0, this.previousDragPosition.z);
      const targetPos2D = new Vector3(targetWorldPos.x, 0, targetWorldPos.z);
      this.dragVelocity.subVectors(targetPos2D, previousPos2D);

      // Update previous position for next frame
      this.previousDragPosition.copy(targetWorldPos);

      // Convert to local space for the card's parent
      if (this.draggedCard.parent) {
        const localPos = this.draggedCard.parent.worldToLocal(targetWorldPos.clone());
        this.draggedCard.position.copy(localPos);
      } else {
        this.draggedCard.position.copy(targetWorldPos);
      }

      // Apply physics-based rotation based on drag direction
      // Normalize velocity for consistent rotation strength
      const velocityMagnitude = this.dragVelocity.length();
      if (velocityMagnitude > 0.01) {
        // Check if this is a hand card for enhanced physics
        const isHandCard = this.draggedCard?.userData?.isHandCard === true;
        
        // Scale factor for rotation intensity (double for hand cards)
        const rotationScale = isHandCard ? 0.6 : 0.3;
        const maxRotation = isHandCard ? 0.6 : 0.3; // Max rotation in radians (~34 degrees for hand, ~17 for board)

        // Calculate rotation based on drag direction
        // X rotation (pitch): tilt up/down based on Z velocity (forward/back)
        // Z rotation (roll): tilt left/right based on X velocity
        const targetRotationX = Math.max(-maxRotation, Math.min(maxRotation,
          -this.dragVelocity.z * rotationScale));
        const targetRotationZ = Math.max(-maxRotation, Math.min(maxRotation,
          -this.dragVelocity.x * rotationScale));

        // Smoothly animate to target rotation
        gsap.to(this.draggedCard.rotation, {
          x: targetRotationX,
          z: targetRotationZ,
          duration: 0.1,
          ease: 'power2.out'
        });
      }

      // Highlight drop zones using world position
      const worldPos = new Vector3();
      this.draggedCard.getWorldPosition(worldPos);
      
      // Check if card is over hand area
      const isOverHand = this.isOverHandArea(worldPos);
      
      // Provide visual feedback when over hand area (slight scale increase)
      if (isOverHand && this.currentDragContext?.source === 'hand') {
        gsap.to(this.draggedCard.scale, {
          x: 1.05,
          y: 1.05,
          z: 1.05,
          duration: 0.15,
          ease: 'power2.out'
        });
      } else {
        // Reset scale when not over hand area
        gsap.to(this.draggedCard.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.15,
          ease: 'power2.out'
        });
      }
      
      // Only highlight drop zones if not over hand area
      if (!isOverHand) {
        this.highlightNearestDropZone(worldPos, scene);
      } else {
        // Hide drop zones when over hand area
        this.hideAllDropZones();
      }
    }
  }

  /**
   * Check if the mouse movement from mousedown to mouseup constitutes a click
   */
  private isClick(event: MouseEvent): boolean {
    const dx = event.clientX - this.mouseDownPosition.x;
    const dy = event.clientY - this.mouseDownPosition.y;
    return Math.sqrt(dx * dx + dy * dy) < this.clickThreshold;
  }

  /**
   * Handle mouse up - end dragging or detect click
   */
  onMouseUp(
    event: MouseEvent,
    camera: Camera,
    scene: Scene,
    canvas: HTMLCanvasElement
  ): DropResult | null {
    // Clear pending drag state
    this.pendingDragCard = null;
    this.pendingDragCamera = null;

    // Check for click on non-draggable card (board cards that aren't active/bench)
    if (!this.isDragging && this.mouseDownCard && this.isClick(event)) {
      const clickedCard = this.mouseDownCard;
      this.mouseDownCard = null;
      return {
        action: 'click',
        clickedCard
      };
    }

    if (!this.isDragging || !this.draggedCard) {
      this.mouseDownCard = null;
      return null;
    }

    // Check if it was actually a click (no significant movement)
    if (this.isClick(event)) {
      // Return card to original position and treat as click
      this.returnCardToHand(this.draggedCard);
      const clickedCard = this.draggedCard;

      this.resetDragState();
      this.hideAllDropZones();
      this.mouseDownCard = null;

      return {
        action: 'click',
        clickedCard
      };
    }

    // Get world position for checks
    const worldPos = new Vector3();
    this.draggedCard.getWorldPosition(worldPos);
    
    // Check if card is over hand area first (priority over drop zones)
    const isOverHand = this.isOverHandArea(worldPos);
    
    let result: DropResult | null = null;
    
    // If over hand area and card came from hand, return to hand
    if (isOverHand && this.currentDragContext?.source === 'hand') {
      this.returnCardToHand(this.draggedCard);
      this.resetDragState();
      this.hideAllDropZones();
      this.mouseDownCard = null;
      return null; // No action needed, card returned to hand
    }
    
    // Otherwise, check for valid drop zone
    const dropZone = this.findValidDropZone(worldPos);
    
    if (dropZone) {
      const config = dropZone.getConfig();
      const zone = this.configToCardTarget(config);

      // Kill any running animations and reset card visual state before removal
      if (this.draggedCard) {
        gsap.killTweensOf(this.draggedCard.position);
        gsap.killTweensOf(this.draggedCard.rotation);
        gsap.killTweensOf(this.draggedCard.scale);
        this.draggedCard.scale.set(1, 1, 1);
      }

      if (this.currentDragContext?.source === 'board') {
        // Retreat action
        const originalTarget = this.currentDragContext.originalTarget;
        if (originalTarget) {
          result = {
            action: 'retreat',
            benchIndex: originalTarget.slot === SlotType.ACTIVE
              ? config.index  // Active -> Bench: benchIndex is destination
              : originalTarget.index, // Bench -> Active: benchIndex is source
            zone
          };
        }
      } else {
        // Play card from hand - return to hand immediately for responsive feedback
        // (like 2D board behavior - card animates back right away)
        if (this.draggedCard) {
          this.returnCardToHand(this.draggedCard);
        }
        
        // Use current index from userData (may have changed during drag)
        result = {
          action: 'playCard',
          handIndex: this.draggedCard?.userData?.handIndex ?? this.draggedCardHandIndex,
          zone
        };
      }
    } else {
      // Invalid drop - return to original position
      this.returnCardToHand(this.draggedCard);
    }

    // Reset drag state
    this.resetDragState();
    this.hideAllDropZones();
    this.mouseDownCard = null;

    return result;
  }

  /**
   * Convert DropZoneConfig to CardTarget
   */
  private configToCardTarget(config: DropZoneConfig): CardTarget {
    let slot: SlotType;
    switch (config.type) {
      case DropZoneType.ACTIVE:
        slot = SlotType.ACTIVE;
        break;
      case DropZoneType.BENCH:
        slot = SlotType.BENCH;
        break;
      case DropZoneType.STADIUM:
        slot = SlotType.BOARD; // Stadium uses BOARD slot
        break;
      case DropZoneType.SUPPORTER:
        slot = SlotType.BOARD; // Supporter uses BOARD slot (stored in player.supporter)
        break;
      case DropZoneType.BOARD:
      default:
        slot = SlotType.BOARD;
        break;
    }

    return {
      player: config.player,
      slot,
      index: config.index
    };
  }

  /**
   * Check if card position is over the hand area
   */
  private isOverHandArea(position: Vector3): boolean {
    // Hand is centered at (0, 0.1, 30)
    // Hand cards span approximately -20 to 20 on X axis
    // Hand is at z = 30, with some tolerance
    const handCenterZ = 30;
    const handTolerance = 5; // Allow some tolerance for easier targeting
    const handMinX = -25; // Extended bounds for easier targeting
    const handMaxX = 25;
    
    return position.x >= handMinX && 
           position.x <= handMaxX && 
           Math.abs(position.z - handCenterZ) < handTolerance;
  }

  /**
   * Find valid drop zone under card position
   */
  private findValidDropZone(position: Vector3): Board3dDropZone | null {
    let nearestZone: Board3dDropZone | null = null;
    let minDistance = Infinity;

    for (const zone of this.dropZones) {
      if (!this.isValidDropZone(zone)) {
        continue;
      }

      const distance = zone.distanceToPosition(position);
      // Use larger snap distance for BOARD zone (trainers)
      const snapDist = zone.getConfig().type === DropZoneType.BOARD ? 15 : SNAP_DISTANCE;
      if (distance < snapDist && distance < minDistance) {
        nearestZone = zone;
        minDistance = distance;
      }
    }

    return nearestZone;
  }

  /**
   * Return card to original hand position with smooth animation
   */
  private returnCardToHand(card: Object3D): void {
    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf(card.position);
    gsap.killTweensOf(card.rotation);
    gsap.killTweensOf(card.scale);
    
    // Check if this is a hand card and verify it's still valid
    // If card was removed from handGroup during updateHand(), it might be disposed
    // In that case, the hand will be re-synced and this card will be recreated
    if (card.userData.isHandCard) {
      // Check if card is still in the scene (not disposed)
      if (!card.parent) {
        // Card has no parent - it was likely removed/disposed
        // Don't animate, let updateHand() handle recreation
        return;
      }
      
      // Traverse up parent chain to verify card is still connected
      let currentParent: Object3D | null = card.parent;
      let depth = 0;
      const maxDepth = 10; // Safety limit
      
      while (currentParent && depth < maxDepth) {
        // Check if we've reached the scene root or handGroup-like structure
        // HandGroup is typically at z=30 and contains multiple cards
        if (currentParent.type === 'Scene' || 
            (Math.abs(currentParent.position.z - 30) < 1 && currentParent.children.length > 3)) {
          break;
        }
        currentParent = currentParent.parent;
        depth++;
      }
      
      // If card is orphaned (no valid parent chain), skip animation
      // The hand will be re-synced and card will be recreated
      if (!currentParent || depth >= maxDepth) {
        return;
      }
    }
    
    // Smoothly animate position back
    gsap.to(card.position, {
      x: this.draggedCardOriginalPosition.x,
      y: this.draggedCardOriginalPosition.y,
      z: this.draggedCardOriginalPosition.z,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Smoothly animate rotation back
    gsap.to(card.rotation, {
      x: this.draggedCardOriginalRotation.x,
      y: this.draggedCardOriginalRotation.y,
      z: this.draggedCardOriginalRotation.z,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Smoothly reset scale to original
    gsap.to(card.scale, {
      x: this.draggedCardOriginalScale.x,
      y: this.draggedCardOriginalScale.y,
      z: this.draggedCardOriginalScale.z,
      duration: 0.4,
      ease: 'power2.out'
    });
  }

  /**
   * Reset drag state
   */
  private resetDragState(): void {
    this.isDragging = false;
    this.draggedCard = null;
    this.draggedCardHandIndex = -1;
    this.currentDragContext = null;
    this.pendingDragCard = null;
    this.pendingDragCamera = null;
    this.dragVelocity.set(0, 0, 0);
    this.previousDragPosition.set(0, 0, 0);
  }

  /**
   * Create drop zone indicators for all zones
   */
  async createDropZoneIndicators(
    scene: Scene,
    bottomBenchSize?: number,
    topBenchSize?: number
  ): Promise<void> {
    // Use provided bench sizes or defaults
    const bottomSize = bottomBenchSize ?? this.currentBenchSizes.bottom ?? 5;
    const topSize = topBenchSize ?? this.currentBenchSizes.top ?? 5;

    // Check if bench sizes have changed
    const benchSizesChanged =
      bottomSize !== this.currentBenchSizes.bottom ||
      topSize !== this.currentBenchSizes.top;

    // Clear existing zones if bench sizes changed or if zones exist
    if (benchSizesChanged || this.dropZones.length > 0) {
      this.disposeDropZones(scene);
    }

    // Update current bench sizes
    this.currentBenchSizes.bottom = bottomSize;
    this.currentBenchSizes.top = topSize;

    // Load aqua grid texture for slots
    if (!this.slotGridTexture) {
      this.slotGridTexture = await this.assetLoader.loadSlotGridTexture();
    }

    // Bottom player zones
    await this.createPlayerDropZones(
      scene,
      PlayerType.BOTTOM_PLAYER,
      ZONE_POSITIONS.bottomPlayer,
      bottomSize
    );

    // Top player zones (for board-to-board visibility, but typically not interactive)
    // Uncomment if needed: await this.createPlayerDropZones(scene, PlayerType.TOP_PLAYER, ZONE_POSITIONS.topPlayer, topSize);

    // Shared stadium zone (between both players)
    const stadiumZone = new Board3dDropZone({
      type: DropZoneType.STADIUM,
      position: ZONE_POSITIONS.stadium,
      player: PlayerType.BOTTOM_PLAYER, // Use bottom player for ownership, but it's shared
      index: 0,
      width: 4.0,
      height: 5.5,
      texture: this.slotGridTexture
    });
    stadiumZone.addToScene(scene);
    this.dropZones.push(stadiumZone);

    // Update interactive objects cache after creating drop zones
    this.updateInteractiveObjects(scene);
  }

  /**
   * Create drop zones for a player
   */
  private async createPlayerDropZones(
    scene: Scene,
    player: PlayerType,
    positions: typeof ZONE_POSITIONS.bottomPlayer,
    benchSize: number = 5
  ): Promise<void> {
    // Ensure texture is loaded
    if (!this.slotGridTexture) {
      this.slotGridTexture = await this.assetLoader.loadSlotGridTexture();
    }

    // Active zone
    const activeZone = new Board3dDropZone({
      type: DropZoneType.ACTIVE,
      position: positions.active,
      player,
      index: 0,
      texture: this.slotGridTexture
    });
    activeZone.addToScene(scene);
    this.dropZones.push(activeZone);

    // Supporter zone
    const supporterZone = new Board3dDropZone({
      type: DropZoneType.SUPPORTER,
      position: positions.supporter,
      player,
      index: 0,
      texture: this.slotGridTexture
    });
    supporterZone.addToScene(scene);
    this.dropZones.push(supporterZone);

    // Bench zones - use dynamic positioning based on bench size
    const benchPositions = getBenchPositions(benchSize, player);
    benchPositions.forEach((pos, i) => {
      const benchZone = new Board3dDropZone({
        type: DropZoneType.BENCH,
        position: pos,
        player,
        index: i,
        texture: this.slotGridTexture
      });
      benchZone.addToScene(scene);
      this.dropZones.push(benchZone);
    });

    // Stadium zone is now shared - created in createDropZoneIndicators()

    // Board zone (for Items/Supporters) - large area covering player's side
    const boardZone = new Board3dDropZone({
      type: DropZoneType.BOARD,
      position: positions.board,
      player,
      index: 0,
      width: 30.0,
      height: 14.0,
      texture: this.slotGridTexture
    });
    boardZone.addToScene(scene);
    this.dropZones.push(boardZone);
  }

  /**
   * Highlight nearest valid drop zone during drag
   */
  private highlightNearestDropZone(position: Vector3, scene: Scene): void {
    const nearestZone = this.findValidDropZone(position);

    // Update visual states
    for (const zone of this.dropZones) {
      if (zone === nearestZone) {
        zone.setValid();
      } else if (this.isValidDropZone(zone)) {
        zone.setState(DropZoneState.IDLE);
      }
    }
  }

  /**
   * Hide all drop zones
   */
  private hideAllDropZones(): void {
    for (const zone of this.dropZones) {
      zone.hide();
    }
    // Don't clear currentDragContext here - it's needed for drop zone validation
    // It will be cleared in resetDragState() when drag actually ends
  }

  /**
   * Dispose of all drop zones
   */
  private disposeDropZones(scene: Scene): void {
    for (const zone of this.dropZones) {
      zone.removeFromScene(scene);
      zone.dispose();
    }
    this.dropZones = [];
  }

  /**
   * Clean up resources
   */
  dispose(scene: Scene): void {
    this.disposeDropZones(scene);
  }

  /**
   * Check if currently dragging
   */
  getIsDragging(): boolean {
    return this.isDragging;
  }

  /**
   * Check if there's a pending drag (mouse down on draggable card, waiting for threshold)
   */
  hasPendingDrag(): boolean {
    return this.pendingDragCard !== null;
  }

  /**
   * Cancel current drag
   */
  cancelDrag(): void {
    if (this.isDragging && this.draggedCard) {
      this.returnCardToHand(this.draggedCard);
      this.resetDragState();
      this.hideAllDropZones();
    }
  }

  /**
   * Get current drag context (for external use)
   */
  getDragContext(): DragContext | null {
    return this.currentDragContext;
  }
}
