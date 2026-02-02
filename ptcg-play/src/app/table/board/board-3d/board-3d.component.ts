import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  NgZone,
  Input
} from '@angular/core';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  Vector3,
  RepeatWrapping
} from 'three';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Board3dEdgeGlow } from './board-3d-edge-glow';
import { Board3dAssetLoaderService } from '../services/board-3d-asset-loader.service';
import { Board3dStateSyncService } from '../services/board-3d-state-sync.service';
import { Board3dAnimationService } from '../services/board-3d-animation.service';
import { Board3dInteractionService } from '../services/board-3d-interaction.service';
import { Board3dHandService } from '../services/board-3d-hand.service';
import { Board3dWireframeService } from '../services/board-3d-wireframe.service';
import { Board3dLightingService } from '../services/board-3d-lighting.service';
import { Board3dPostProcessingService } from '../services/board-3d-post-processing.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { Player, CardList, Card, SlotType, PlayerType, CardTarget, SuperType } from 'ptcg-server';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { CardInfoPaneOptions } from '../../../shared/cards/card-info-pane/card-info-pane.component';
import { GameService } from '../../../api/services/game.service';
import { BoardInteractionService } from '../../../shared/services/board-interaction.service';
import { Object3D } from 'three';

@UntilDestroy()
@Component({
  selector: 'ptcg-board-3d',
  templateUrl: './board-3d.component.html',
  styleUrls: ['./board-3d.component.scss']
})
export class Board3dComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() gameState: LocalGameState;
  @Input() topPlayer: Player;
  @Input() bottomPlayer: Player;
  @Input() bottomPlayerHand: CardList;
  @Input() topPlayerHand: CardList;
  @Input() player: any;
  @Input() clientId: any;

  public scene!: Scene; // Made public for stats component
  private camera!: PerspectiveCamera;
  public renderer!: WebGLRenderer; // Made public for stats component

  // Board elements
  private boardMesh!: Mesh;
  private boardCenterOverlay!: Mesh;
  private edgeGlow!: Board3dEdgeGlow;

  private animationFrameId: number = 0;
  private needsRender: boolean = true;
  private currentHoveredCard: any = null;
  private hasInitializedHand: boolean = false;
  private resizeObserver: ResizeObserver | null = null;

  // Player perspective - true when viewing from opposite side (like 2D board's isUpsideDown)
  private isUpsideDown: boolean = false;

  // Animation state caching
  private hasActiveAnimationsCache: boolean = false;
  private animationCheckInterval: number = 100; // Check animation state every 100ms instead of every frame
  private lastAnimationCheck: number = 0;

  // Wireframe overlay
  public showWireframes: boolean = false;

  constructor(
    private ngZone: NgZone,
    private assetLoader: Board3dAssetLoaderService,
    private stateSync: Board3dStateSyncService,
    private animationService: Board3dAnimationService,
    private interactionService: Board3dInteractionService,
    private handService: Board3dHandService,
    private wireframeService: Board3dWireframeService,
    private lightingService: Board3dLightingService,
    private postProcessingService: Board3dPostProcessingService,
    private cardsBaseService: CardsBaseService,
    private gameService: GameService,
    private boardInteractionService: BoardInteractionService
  ) { }

  ngOnInit(): void {
    // Initialize scene components
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.lightingService.initialize(this.scene);
    this.createBoardAsync();
    this.createGlowingEdges();
    this.postProcessingService.initialize(this.renderer, this.scene, this.camera, this.canvasRef.nativeElement);

    // Initialize wireframe service
    this.wireframeService.initialize(this.scene);

    // Initialize hand service
    this.scene.add(this.handService.getHandGroup());

    // Create drop zone indicators (async) with actual bench sizes
    const bottomBenchSize = this.bottomPlayer?.bench?.length ?? 5;
    const topBenchSize = this.topPlayer?.bench?.length ?? 5;
    this.interactionService.createDropZoneIndicators(this.scene, bottomBenchSize, topBenchSize).then(() => {
      this.markDirty();
    });

    // Sync initial game state if available
    if (this.gameState) {
      this.syncGameState();
    }

    // Sync initial hand if available
    if (this.bottomPlayerHand) {
      this.syncHand();
      this.hasInitializedHand = true;
    }

    // Subscribe to selection mode changes for ChoosePokemonPrompt etc.
    this.boardInteractionService.selectionMode$.pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.updateSelectionVisuals();
    });

    this.boardInteractionService.selectedTargets$.pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.updateSelectionVisuals();
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update perspective when player assignment changes
    if ((changes.topPlayer || changes.bottomPlayer || changes.clientId) && this.camera) {
      this.updatePerspective();
    }

    // Sync game state when it changes or when players change (for replay/spectator switchSide)
    const gameStateChanged = changes.gameState && !changes.gameState.firstChange;
    const playersChanged = (changes.topPlayer || changes.bottomPlayer) && this.scene;

    if ((gameStateChanged || playersChanged) && this.scene) {
      this.syncGameState();
    }

    // Sync hand when it changes
    if (changes.bottomPlayerHand && this.scene) {
      const isFirstChange = changes.bottomPlayerHand.firstChange;
      const shouldSync = !isFirstChange || (isFirstChange && !this.hasInitializedHand);

      if (shouldSync) {
        this.syncHand();
        if (isFirstChange) {
          this.hasInitializedHand = true;
        }
      }
    }
  }

  ngAfterViewInit(): void {
    // Initialize animation check
    this.lastAnimationCheck = performance.now();

    // Start render loop outside Angular zone
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });

    // Add event listeners
    this.addEventListeners();

    // Use ResizeObserver for container-based responsiveness
    const container = this.canvasRef.nativeElement.parentElement;
    if (container) {
      this.resizeObserver = new ResizeObserver(() => {
        this.onContainerResize();
      });
      this.resizeObserver.observe(container);
    }
  }

  ngOnDestroy(): void {
    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Kill any active animations
    this.animationService.killAllAnimations();

    // Clean up wireframes
    this.wireframeService.dispose(this.scene);

    // Clean up service state to prevent stale references on mode switch
    this.stateSync.dispose(this.scene);
    this.handService.dispose(this.scene);
    this.interactionService.dispose(this.scene);
    this.lightingService.dispose(this.scene);
    this.postProcessingService.dispose();

    // Clean up resources
    this.disposeScene();
    this.renderer?.dispose();

    // Remove event listeners
    this.removeEventListeners();

    // Clean up ResizeObserver
    this.resizeObserver?.disconnect();
  }

  private initScene(): void {
    this.scene = new Scene();
  }

  private initCamera(): void {
    const canvas = this.canvasRef.nativeElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;

    // Calculate initial perspective
    this.isUpsideDown = this.topPlayer?.id === this.clientId;
    const zMultiplier = this.isUpsideDown ? -1 : 1;

    this.camera = new PerspectiveCamera(31, aspect, 0.1, 2000);
    this.camera.position.set(0, 25, 40 * zMultiplier);
    this.camera.lookAt(0, 0, 12);  // Center of board
  }

  private initRenderer(): void {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });

    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Shadow settings
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    // Color and tone mapping
    this.renderer.outputColorSpace = 'srgb';
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }


  private async createBoardAsync(): Promise<void> {
    // Create board surface geometry
    const boardGeometry = new PlaneGeometry(70, 50);

    // Load black grid texture
    const boardTexture = await this.assetLoader.loadBoardGridTexture();

    // Board material with black grid texture
    const boardMaterial = new MeshStandardMaterial({
      map: boardTexture,
      color: 0xffffff, // White color to show texture properly
      roughness: 1,
      metalness: 0.00
    });

    this.boardMesh = new Mesh(boardGeometry, boardMaterial);
    this.boardMesh.rotation.x = -Math.PI / 2; // Make it horizontal
    this.boardMesh.position.z = 12;
    this.boardMesh.receiveShadow = false;
    this.scene.add(this.boardMesh);

    // Add twinleaf board center overlay
    const centerTexture = await this.assetLoader.loadBoardCenterTexture();
    // Make it 75% smaller, then another 25% smaller: 50 * 0.25 * 0.75 = 9.375
    const centerGeometry = new PlaneGeometry(9.375, 9.375);
    const centerMaterial = new MeshStandardMaterial({
      map: centerTexture,
      color: 0xffffff,
      roughness: 1,
      metalness: 0.00,
      transparent: true,
      opacity: 1.0,
      depthWrite: true, // Enable depth writing for proper layering
      depthTest: true
    });

    this.boardCenterOverlay = new Mesh(centerGeometry, centerMaterial);
    this.boardCenterOverlay.rotation.x = -Math.PI / 2; // Make it horizontal
    this.boardCenterOverlay.rotation.z = Math.PI; // Rotate 180 degrees
    // Mirror horizontally by scaling X axis negatively
    this.boardCenterOverlay.scale.x = -1;
    // Position significantly above board to prevent clipping
    this.boardCenterOverlay.position.y = 0.05; // Move along y-axis
    this.boardCenterOverlay.position.z = 14.1; // Board is at z=12, so 15.5 = 3.5 units above
    this.boardCenterOverlay.renderOrder = 100; // Higher render order to appear on top
    this.boardCenterOverlay.receiveShadow = false;
    this.scene.add(this.boardCenterOverlay);

    this.markDirty();
  }

  private createGlowingEdges(): void {
    this.edgeGlow = new Board3dEdgeGlow(this.scene);
  }


  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const currentTime = performance.now();

    // Check animation state periodically instead of every frame
    if (currentTime - this.lastAnimationCheck >= this.animationCheckInterval) {
      this.hasActiveAnimationsCache = this.animationService.hasActiveAnimations();
      this.lastAnimationCheck = currentTime;
    }

    // Render if scene changed or animations are active (using cached value)
    const didRender = this.needsRender || this.hasActiveAnimationsCache;
    if (didRender) {
      this.postProcessingService.render();
      this.needsRender = false;
    }
  };

  private onContainerResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const aspect = width / height;

    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.postProcessingService.setSize(width, height);

    // Flip Z based on player perspective (like 2D board's isUpsideDown)
    const zMultiplier = this.isUpsideDown ? -1 : 1;

    // Adjust camera for different aspect ratios
    // Camera must be at Z > 18 to see hand cards (hand is at Z=18)
    if (aspect < 1.2) {
      // Portrait/narrow - zoom out more
      this.camera.position.set(0, 35, 45 * zMultiplier);
    } else if (aspect < 1.5) {
      // Slightly narrow
      this.camera.position.set(0, 30, 40 * zMultiplier);
    } else {
      // Wide/normal
      this.camera.position.set(0, 47.5, 35 * zMultiplier);
    }

    this.camera.lookAt(0, 0, 18);  // Center of board
    this.markDirty();
  }

  /**
   * Update player perspective - determines if we're viewing from the opposite side
   * Mirrors the 2D board's isUpsideDown logic
   */
  private updatePerspective(): void {
    const wasUpsideDown = this.isUpsideDown;
    this.isUpsideDown = this.topPlayer?.id === this.clientId;

    // Only update camera if perspective changed
    if (wasUpsideDown !== this.isUpsideDown) {
      this.onContainerResize();
    }
  }

  private disposeScene(): void {
    // Dispose edge glow
    if (this.edgeGlow) {
      this.edgeGlow.dispose();
    }

    this.scene.traverse((object: any) => {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material: any) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }

  public markDirty(): void {
    // Set render flag immediately - batching happens at render level
    this.needsRender = true;
  }

  public onWireframeToggle(enabled: boolean): void {
    this.showWireframes = enabled;
    if (this.showWireframes) {
      this.wireframeService.createWireframes(this.scene);
    } else {
      this.wireframeService.removeWireframes(this.scene);
    }
    this.markDirty();
  }

  public toggleWireframes(): void {
    this.showWireframes = !this.showWireframes;
    if (this.showWireframes) {
      this.wireframeService.createWireframes(this.scene);
    } else {
      this.wireframeService.removeWireframes(this.scene);
    }
    this.markDirty();
  }

  private syncGameState(): void {
    // Run state sync outside Angular zone for better performance
    this.ngZone.runOutsideAngular(async () => {
      try {
        // Pass topPlayer and bottomPlayer to syncState so it uses the swapped players
        // when switchSide is true in replay/spectator mode
        await this.stateSync.syncState(
          this.gameState,
          this.scene,
          this.clientId,
          this.topPlayer,
          this.bottomPlayer
        );

        // Update drop zone occupied states
        this.updateDropZoneOccupancy();

        // Update drop zones if bench size changed
        this.updateDropZonesForBenchSize();

        // Update interactive objects cache for optimized raycasting
        this.interactionService.updateInteractiveObjects(this.scene);

        this.markDirty();
      } catch (error) {
        console.error('Failed to sync 3D board state:', error);
      }
    });
  }

  /**
   * Update drop zones if bench size has changed
   */
  private updateDropZonesForBenchSize(): void {
    const bottomBenchSize = this.bottomPlayer?.bench?.length ?? 5;
    const topBenchSize = this.topPlayer?.bench?.length ?? 5;

    // Recreate drop zones with updated bench sizes
    this.interactionService.createDropZoneIndicators(this.scene, bottomBenchSize, topBenchSize).then(() => {
      this.markDirty();
    });
  }

  private updateDropZoneOccupancy(): void {
    // Use the correctly assigned bottomPlayer and topPlayer from inputs
    // (these are already assigned correctly by parent component based on clientId)
    const bottom = this.bottomPlayer;
    const top = this.topPlayer;

    // Bottom player occupancy
    const bottomActive = bottom?.active?.cards?.length > 0;
    const bottomBench = bottom?.bench?.map(slot => slot?.cards?.length > 0) ?? [];

    // Top player occupancy
    const topActive = top?.active?.cards?.length > 0;
    const topBench = top?.bench?.map(slot => slot?.cards?.length > 0) ?? [];

    this.interactionService.updateOccupiedZones(
      bottomActive,
      bottomBench,
      topActive,
      topBench
    );
  }

  private syncHand(): void {
    // Skip sync if user is currently dragging a card to prevent destroying the dragged card
    if (this.interactionService.getIsDragging()) {
      return;
    }

    if (!this.bottomPlayerHand || !this.bottomPlayer) {
      return;
    }

    // Ensure handService is ready (handGroup exists and is in scene)
    const handGroup = this.handService.getHandGroup();
    if (!handGroup || !this.scene.children.includes(handGroup)) {
      this.scene.add(handGroup);
    }

    this.ngZone.runOutsideAngular(async () => {
      try {
        const isOwner = this.bottomPlayer.id === this.clientId;
        const playableCardIds = this.bottomPlayer.playableCardIds;

        await this.handService.updateHand(
          this.bottomPlayerHand,
          isOwner,
          this.scene,
          playableCardIds
        );

        // Update interactive objects cache after hand update
        this.interactionService.updateInteractiveObjects(this.scene);

        this.markDirty();
      } catch (error) {
        console.error('[Board3D] Failed to sync 3D hand:', error);
      }
    });
  }

  private addEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;

    // Drag-and-drop events
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('mouseleave', this.onMouseLeave);
  }

  private removeEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;

    canvas.removeEventListener('mousedown', this.onMouseDown);
    canvas.removeEventListener('mousemove', this.onMouseMove);
    canvas.removeEventListener('mouseup', this.onMouseUp);
    canvas.removeEventListener('mouseleave', this.onMouseLeave);
  }

  private onMouseDown = (event: MouseEvent): void => {
    this.ngZone.runOutsideAngular(() => {
      const canvas = this.canvasRef.nativeElement;
      const card = this.interactionService.onMouseDown(
        event,
        this.camera,
        this.scene,
        canvas
      );

      if (card) {
        canvas.style.cursor = 'grabbing';
        this.markDirty();
      }
    });
  };

  private onMouseMove = (event: MouseEvent): void => {
    this.ngZone.runOutsideAngular(() => {
      const canvas = this.canvasRef.nativeElement;

      // Call onMouseMoveDrag when dragging OR when there's a pending drag (waiting for threshold)
      if (this.interactionService.getIsDragging() || this.interactionService.hasPendingDrag()) {
        // Dragging or pending drag
        this.interactionService.onMouseMoveDrag(
          event,
          this.camera,
          this.scene,
          canvas
        );
      } else {
        // Hovering
        const hoveredCard = this.interactionService.onMouseMove(
          event,
          this.camera,
          this.scene,
          canvas
        );

        if (hoveredCard !== this.currentHoveredCard) {
          // Update cursor for UX feedback (no hover animations)
          if (hoveredCard) {
            canvas.style.cursor = hoveredCard.userData.isHandCard ? 'grab' : 'pointer';
          } else {
            canvas.style.cursor = 'default';
          }
          this.currentHoveredCard = hoveredCard;
        }
      }

      this.markDirty();
    });
  };

  private onMouseUp = (event: MouseEvent): void => {
    this.ngZone.run(() => {
      const canvas = this.canvasRef.nativeElement;
      const result = this.interactionService.onMouseUp(
        event,
        this.camera,
        this.scene,
        canvas
      );

      if (result) {
        if (result.action === 'click' && result.clickedCard) {
          // Card was clicked - show info pane
          this.onCardClicked(result.clickedCard);
        } else if (result.action === 'playCard' && result.handIndex !== undefined) {
          // Card dropped on valid zone - send play action
          this.gameService.playCardAction(
            this.gameState.gameId,
            result.handIndex,
            result.zone
          );

          // Card will be removed from hand when state sync confirms successful play
          // If play fails, card remains in hand (correct behavior)
        } else if (result.action === 'retreat' && result.benchIndex !== undefined) {
          // Retreat action (Active <-> Bench swap)
          this.gameService.retreatAction(
            this.gameState.gameId,
            result.benchIndex
          );
        }
      }

      canvas.style.cursor = 'default';
      this.markDirty();
    });
  };

  private onMouseLeave = (): void => {
    this.interactionService.cancelDrag();
    this.currentHoveredCard = null;
    this.markDirty();
  };

  /**
   * Update selection visuals for all cards based on BoardInteractionService state
   */
  private updateSelectionVisuals(): void {
    const isSelectionMode = this.boardInteractionService.isSelectionActive();

    // Update board cards via stateSync
    this.stateSync.updateSelectionState(
      isSelectionMode,
      this.boardInteractionService
    );

    // Update hand cards
    this.updateHandSelectionVisuals(isSelectionMode);

    this.markDirty();
  }

  /**
   * Update selection visuals for hand cards
   */
  private updateHandSelectionVisuals(isSelectionMode: boolean): void {
    const handGroup = this.handService.getHandGroup();
    handGroup.children.forEach((cardGroup, index) => {
      const card3d = this.handService.getCardAtIndex(index);
      if (!card3d) return;

      const cardData = cardGroup.userData.cardData;
      if (!cardData) return;

      // Create target for this hand card
      const target: CardTarget = {
        player: PlayerType.BOTTOM_PLAYER,
        slot: SlotType.HAND,
        index
      };

      if (isSelectionMode) {
        const isEligible = this.boardInteractionService.isTargetEligible(target);
        const isSelected = this.boardInteractionService.isTargetSelected(target);

        if (isSelected) {
          card3d.setOutline(true, 0x4ade80); // Green for selected
        } else if (isEligible) {
          card3d.setOutline(true, 0xffffff); // White for selectable
        } else {
          card3d.setOutline(false);
        }
      } else {
        // Reset to playable card state when not in selection mode
        const isPlayable = this.bottomPlayer?.playableCardIds?.includes(cardData.id);
        card3d.setOutline(isPlayable, 0x4ade80);
      }
    });
  }

  /**
   * Handle card click to show info pane with clickable abilities/attacks
   */
  private onCardClicked(cardObject: Object3D): void {
    const cardData = cardObject.userData.cardData as Card;
    const cardList = cardObject.userData.cardList;
    const cardTarget = cardObject.userData.cardTarget as CardTarget;
    const isHandCard = cardObject.userData.isHandCard;
    const isDiscard = cardObject.userData.isDiscard;
    const isLostZone = cardObject.userData.isLostZone;
    const isDeck = cardObject.userData.isDeck;
    const isPrize = cardObject.userData.isPrize;

    // Handle Lost Zone click
    if (isLostZone && cardList) {
      // Determine which player's Lost Zone this is
      const isBottomLostZone = this.bottomPlayer && this.bottomPlayer.lostzone === cardList;
      const isTopLostZone = this.topPlayer && this.topPlayer.lostzone === cardList;
      const player = isBottomLostZone ? PlayerType.BOTTOM_PLAYER : (isTopLostZone ? PlayerType.TOP_PLAYER : PlayerType.BOTTOM_PLAYER);
      const isOwner = (isBottomLostZone && this.bottomPlayer && this.bottomPlayer.id === this.clientId) ||
        (isTopLostZone && this.topPlayer && this.topPlayer.id === this.clientId);
      const isDeleted = this.gameState.deleted;

      if (isDeleted || !isOwner) {
        // Show card list without ability options
        this.cardsBaseService.showCardInfoList({
          card: cardData,
          cardList: cardList,
          players: [this.topPlayer, this.bottomPlayer].filter(p => p)
        });
        return;
      }

      const slot = SlotType.LOSTZONE;
      const options = { enableAbility: { useFromDiscard: false }, enableAttack: false };

      this.cardsBaseService.showCardInfoList({
        card: cardData,
        cardList: cardList,
        options,
        players: [this.topPlayer, this.bottomPlayer].filter(p => p)
      }).then(result => {
        if (!result) {
          return;
        }
        const gameId = this.gameState.gameId;
        const index = cardList.cards.indexOf(result.card);
        const target: CardTarget = { player, slot, index };
        // Note: Lost Zone cards typically don't have abilities that can be used from Lost Zone
        // but we handle the result in case future cards need this functionality
      });
      return;
    }

    // Handle discard pile click
    if (isDiscard && cardList) {
      const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
      const isDeleted = this.gameState.deleted;

      if (!isBottomOwner || isDeleted) {
        // Show card list without ability options
        this.cardsBaseService.showCardInfoList({
          card: cardData,
          cardList: cardList,
          players: [this.topPlayer, this.bottomPlayer].filter(p => p)
        });
        return;
      }

      const player = PlayerType.BOTTOM_PLAYER;
      const slot = SlotType.DISCARD;
      const options = { enableAbility: { useFromDiscard: true }, enableAttack: false };

      this.cardsBaseService.showCardInfoList({
        card: cardData,
        cardList: cardList,
        options,
        players: [this.topPlayer, this.bottomPlayer].filter(p => p)
      }).then(result => {
        if (!result) {
          return;
        }
        const gameId = this.gameState.gameId;
        const index = cardList.cards.indexOf(result.card);
        const target: CardTarget = { player, slot, index };

        // Use ability from the card
        if (result.ability) {
          if (result.card.superType === SuperType.TRAINER) {
            this.gameService.trainerAbility(gameId, result.ability, target);
          } else if (result.card.superType === SuperType.ENERGY) {
            this.gameService.energyAbility(gameId, result.ability, target);
          } else {
            this.gameService.ability(gameId, result.ability, target);
          }
        }
      });
      return;
    }

    // Handle deck click
    if (isDeck) {
      // Find the deck CardList from the player
      const deckCardList = this.bottomPlayer?.deck || this.topPlayer?.deck;
      if (deckCardList) {
        const facedown = true;
        const allowReveal = !!this.gameState.replay;
        this.cardsBaseService.showCardInfoList({
          card: cardData,
          cardList: deckCardList,
          allowReveal,
          facedown,
          players: [this.topPlayer, this.bottomPlayer].filter(p => p)
        });
      }
      return;
    }

    // Handle prize click
    if (isPrize && cardList) {
      const owner = (this.bottomPlayer && this.bottomPlayer.id === this.clientId) ||
        (this.topPlayer && this.topPlayer.id === this.clientId);
      if (cardList.cards.length === 0) {
        return;
      }
      const card = cardList.cards[0];
      const facedown = cardList.isSecret || (!cardList.isPublic && !owner);
      const allowReveal = facedown && !!this.gameState.replay;
      this.cardsBaseService.showCardInfo({
        card,
        allowReveal,
        facedown,
        players: [this.topPlayer, this.bottomPlayer].filter(p => p)
      });
      return;
    }

    // Handle Stadium click
    const isStadium = cardObject.userData.isStadium === true || cardObject.userData.cardId === 'shared_stadium';
    if (isStadium && cardList) {
      const isBottomOwner = this.bottomPlayer && this.bottomPlayer.id === this.clientId;
      const isDeleted = this.gameState.deleted;

      if (!isBottomOwner || isDeleted) {
        // Show normal card info without trainer options
        this.cardsBaseService.showCardInfo({
          card: cardData,
          cardList: cardList,
          players: [this.topPlayer, this.bottomPlayer].filter(p => p)
        });
        return;
      }

      // Owner can activate stadium effect
      const options = { enableTrainer: true };
      this.cardsBaseService.showCardInfo({
        card: cardData,
        cardList: cardList,
        options,
        players: [this.topPlayer, this.bottomPlayer].filter(p => p)
      }).then(result => {
        if (!result) {
          return;
        }

        // Use stadium card effect
        if (result.trainer) {
          this.gameService.stadium(this.gameState.gameId);
        }
      });
      return;
    }

    if (!cardData) return;

    // Check if we're in selection mode (for ChoosePokemonPrompt etc.)
    if (this.boardInteractionService.isSelectionActive()) {
      // Build target for selection
      const target: CardTarget = cardTarget || {
        player: PlayerType.BOTTOM_PLAYER,
        slot: isHandCard ? SlotType.HAND : SlotType.ACTIVE,
        index: isHandCard ? (cardObject.userData.handIndex ?? 0) : 0
      };

      // Toggle selection if target is eligible
      if (this.boardInteractionService.isTargetEligible(target)) {
        this.boardInteractionService.toggleTarget(target);
      }
      return; // Don't show info pane in selection mode
    }

    // Normal click behavior - show info pane
    // Determine options based on card location
    let options: CardInfoPaneOptions = {};

    if (isHandCard) {
      // Hand cards: enable abilities with useFromHand (like Luxray's Swelling Flash)
      options = { enableAbility: { useFromHand: true }, enableAttack: false };
    } else if (cardTarget) {
      if (cardTarget.slot === SlotType.ACTIVE) {
        // Active Pokemon: enable abilities (useWhenInPlay) and attacks
        options = { enableAbility: { useWhenInPlay: true }, enableAttack: true };
      } else if (cardTarget.slot === SlotType.BENCH) {
        // Bench Pokemon: enable abilities (useWhenInPlay), no attacks
        options = { enableAbility: { useWhenInPlay: true }, enableAttack: false };
      }
    }

    // Get players for targeting
    const players = [this.topPlayer, this.bottomPlayer].filter(p => p);

    this.cardsBaseService.showCardInfo({
      card: cardData,
      cardList: cardList,
      options,
      players
    }).then(result => {
      if (!result) return;
      const gameId = this.gameState.gameId;

      // For hand cards, use HAND slot with the card's hand index
      const target = cardTarget || {
        player: PlayerType.BOTTOM_PLAYER,
        slot: isHandCard ? SlotType.HAND : SlotType.ACTIVE,
        index: isHandCard ? (cardObject.userData.handIndex ?? 0) : 0
      };

      if (result.ability) {
        this.gameService.ability(gameId, result.ability, target);
      } else if (result.attack) {
        this.gameService.attack(gameId, result.attack);
      }
    });
  }
}
