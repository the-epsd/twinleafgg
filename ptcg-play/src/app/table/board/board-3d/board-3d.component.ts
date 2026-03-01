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
  MeshBasicMaterial,
  Mesh,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  Vector3,
  RepeatWrapping,
  Group,
  DoubleSide
} from 'three';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
import { getCameraConfig } from './board-3d-config';
import { getBenchPositions, ZONE_POSITIONS } from './board-3d-zone-positions';

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

  // Per-slot outlines (always visible, independent of drop zones)
  private topBenchSpotOutlines: Group[] = [];
  private bottomBenchSpotOutlines: Group[] = [];
  private otherSpotOutlines: Group[] = [];

  // 4x4 grid overlay on the board
  private boardGridGroup: Group | null = null;

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
    this.postProcessingService.initialize(this.renderer, this.scene, this.camera, this.canvasRef.nativeElement);

    // Initialize wireframe service
    this.wireframeService.initialize(this.scene);

    // Initialize hand service
    this.scene.add(this.handService.getHandGroup());

    // Create drop zone indicators (async) with actual bench sizes
    const bottomBenchSize = this.bottomPlayer?.bench?.length ?? 5;
    const topBenchSize = this.topPlayer?.bench?.length ?? 5;
    this.interactionService.createDropZoneIndicators(this.scene, bottomBenchSize, topBenchSize).then(() => {
      this.createBenchSpotOutlines(bottomBenchSize, topBenchSize);
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

    // Clean up spot outline meshes
    this.disposeBenchOutlines();
    this.disposeOtherSpotOutlines();
    this.disposeBoardGrid();

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

    // Get camera configuration based on aspect ratio
    const cameraConfig = getCameraConfig(aspect, this.isUpsideDown);

    this.camera = new PerspectiveCamera(cameraConfig.fov, aspect, 0.1, 2000);
    this.camera.position.set(
      cameraConfig.position.x,
      cameraConfig.position.y,
      cameraConfig.position.z
    );
    this.camera.lookAt(
      cameraConfig.lookAt.x,
      cameraConfig.lookAt.y,
      cameraConfig.lookAt.z
    );
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

    // Shadow settings - optimized for performance
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    // Note: Shadow map size is controlled by light.shadow.mapSize, not renderer

    // Optimize renderer settings
    this.renderer.sortObjects = false; // Disable sorting for better performance (we handle transparency with alphaTest)

    // Color and tone mapping
    this.renderer.outputColorSpace = 'srgb';
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }


  private async createBoardAsync(): Promise<void> {
    // Create board surface geometry
    const boardGeometry = new PlaneGeometry(70, 50);

    // Load black grid texture
    // const boardTexture = await this.assetLoader.loadBoardGridTexture();

    // Board material - dark grey (texture commented out)
    const boardMaterial = new MeshStandardMaterial({
      // map: boardTexture,
      color: 0x404040, // Dark grey
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

    // Add 1-unit grid overlay (same thickness as slot outlines, half opacity)
    this.createBoardGrid();

    this.markDirty();
  }

  /** Grid height - below cards (0.1) so grid appears underneath */
  private static readonly BOARD_GRID_Y = 0.1;

  /**
   * Create a 1-unit grid overlay on the board surface.
   * Aligns with the game board's coordinate system so "move by 1 unit" is visible.
   * Same thickness as BENCH_OUTLINE_THICKNESS, half opacity.
   * Positioned below cards (y=0.01) so it renders underneath.
   */
  private createBoardGrid(): void {
    this.disposeBoardGrid();

    const t = Board3dComponent.BENCH_OUTLINE_THICKNESS;
    const y = Board3dComponent.BOARD_GRID_Y;
    const boardW = 70;
    const boardH = 50;
    const boardCenterZ = 12;
    const minX = -boardW / 2;
    const maxX = boardW / 2;
    const minZ = boardCenterZ - boardH / 2;
    const maxZ = boardCenterZ + boardH / 2;

    const material = new MeshBasicMaterial({
      color: Board3dComponent.BENCH_OUTLINE_COLOR,
      transparent: true,
      opacity: 0.5,
      side: DoubleSide,
      depthTest: true
    });

    this.boardGridGroup = new Group();

    // Vertical lines at every integer x (1 unit = 1 world unit, same as zone positions)
    for (let x = Math.ceil(minX) + 1; x <= Math.floor(maxX) - 1; x++) {
      const line = new Mesh(new PlaneGeometry(t, boardH), material);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, y, boardCenterZ);
      this.boardGridGroup.add(line);
    }

    // Horizontal lines at every integer z
    for (let z = Math.ceil(minZ) + 1; z <= Math.floor(maxZ) - 1; z++) {
      const line = new Mesh(new PlaneGeometry(boardW, t), material);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, y, z);
      this.boardGridGroup.add(line);
    }

    this.boardGridGroup.renderOrder = -1; // Render first so grid appears underneath cards
    this.boardGridGroup.userData.isBoardGrid = true;
    this.scene.add(this.boardGridGroup);
  }

  private disposeBoardGrid(): void {
    if (!this.boardGridGroup) {
      return;
    }
    this.scene.remove(this.boardGridGroup);
    let material: MeshBasicMaterial | null = null;
    for (const child of this.boardGridGroup.children) {
      if (child instanceof Mesh) {
        child.geometry.dispose();
        material = child.material as MeshBasicMaterial;
      }
    }
    material?.dispose();
    this.boardGridGroup = null;
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.stateSync.updateBillboards(this.camera);
    this.postProcessingService.render();
    this.needsRender = false;
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

    // Get camera configuration based on aspect ratio and perspective
    const cameraConfig = getCameraConfig(aspect, this.isUpsideDown);

    // Update camera position and lookAt from config
    this.camera.position.set(
      cameraConfig.position.x,
      cameraConfig.position.y,
      cameraConfig.position.z
    );
    this.camera.lookAt(
      cameraConfig.lookAt.x,
      cameraConfig.lookAt.y,
      cameraConfig.lookAt.z
    );

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
    // Force immediate render if animations are active or dragging
    if (this.animationService.hasActiveAnimations() || this.interactionService.getIsDragging()) {
      // Render will happen on next frame via animate loop
    }
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
          this.bottomPlayer,
          this.interactionService.getDraggedBoardCardId(),
          this.interactionService.getHoveredBoardCardId()
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
      this.createBenchSpotOutlines(bottomBenchSize, topBenchSize);
      this.markDirty();
    });
  }

  /** Slot dimensions (must match Board3dDropZone) */
  private static readonly BENCH_OUTLINE_THICKNESS = 0.02;
  private static readonly BENCH_OUTLINE_Y = 0.15;
  private static readonly BENCH_OUTLINE_COLOR = 0xffffff;

  /** Card/slot dimensions for outlines */
  private static readonly CARD_SLOT_WIDTH = 2.8;
  private static readonly CARD_SLOT_HEIGHT = 3.8;

  /**
   * Create per-slot outline meshes for bench and all other board slots.
   * Always visible, independent of drop zone state.
   */
  private createBenchSpotOutlines(bottomBenchSize: number, topBenchSize: number): void {
    this.disposeBenchOutlines();
    this.disposeOtherSpotOutlines();

    const w = Board3dComponent.CARD_SLOT_WIDTH;
    const h = Board3dComponent.CARD_SLOT_HEIGHT;

    // Bench slots
    const topPositions = getBenchPositions(topBenchSize, PlayerType.TOP_PLAYER);
    for (const pos of topPositions) {
      const group = this.createSpotOutlineGroup(pos, w, h);
      this.topBenchSpotOutlines.push(group);
      this.scene.add(group);
    }
    const bottomPositions = getBenchPositions(bottomBenchSize, PlayerType.BOTTOM_PLAYER);
    for (const pos of bottomPositions) {
      const group = this.createSpotOutlineGroup(pos, w, h);
      this.bottomBenchSpotOutlines.push(group);
      this.scene.add(group);
    }

    // Stadium (single shared slot)
    this.addSpotOutline(ZONE_POSITIONS.stadium, w, h);

    // Active, supporter, deck, discard (each player)
    for (const position of ['bottomPlayer', 'topPlayer'] as const) {
      const zp = ZONE_POSITIONS[position];
      this.addSpotOutline(zp.active, w, h);
      this.addSpotOutline(zp.supporter, w, h);
      this.addSpotOutline(zp.deck, w, h);
      this.addSpotOutline(zp.discard, w, h);
    }

    // Prize slots (6 per player, 2x3 grid - match board-3d-prize.service layout)
    for (const basePos of [ZONE_POSITIONS.bottomPlayer.prizes, ZONE_POSITIONS.topPlayer.prizes]) {
      for (let i = 0; i < 6; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const offsetX = (col - 0.5) * 3;
        const offsetZ = (row - 1) * 4;
        const pos = new Vector3(basePos.x + offsetX, basePos.y, basePos.z + offsetZ);
        this.addSpotOutline(pos, w, h);
      }
    }
  }

  private addSpotOutline(position: Vector3, width: number, height: number): void {
    const group = this.createSpotOutlineGroup(position, width, height);
    this.otherSpotOutlines.push(group);
    this.scene.add(group);
  }

  /**
   * Create a Group with 4 thin plane meshes forming a rectangle outline.
   */
  private createSpotOutlineGroup(position: Vector3, width: number, height: number): Group {
    const t = Board3dComponent.BENCH_OUTLINE_THICKNESS;
    const y = Board3dComponent.BENCH_OUTLINE_Y;
    const minX = position.x - width / 2;
    const maxX = position.x + width / 2;
    const minZ = position.z - height / 2;
    const maxZ = position.z + height / 2;

    const material = new MeshBasicMaterial({
      color: Board3dComponent.BENCH_OUTLINE_COLOR,
      transparent: true,
      opacity: 0,
      side: DoubleSide,
      depthTest: true
    });

    const group = new Group();

    const topEdge = new Mesh(new PlaneGeometry(width + t * 2, t), material);
    topEdge.rotation.x = -Math.PI / 2;
    topEdge.position.set(position.x, y, maxZ + t / 2);
    group.add(topEdge);

    const bottomEdge = new Mesh(new PlaneGeometry(width + t * 2, t), material);
    bottomEdge.rotation.x = -Math.PI / 2;
    bottomEdge.position.set(position.x, y, minZ - t / 2);
    group.add(bottomEdge);

    const leftEdge = new Mesh(new PlaneGeometry(t, height), material);
    leftEdge.rotation.x = -Math.PI / 2;
    leftEdge.position.set(minX - t / 2, y, position.z);
    group.add(leftEdge);

    const rightEdge = new Mesh(new PlaneGeometry(t, height), material);
    rightEdge.rotation.x = -Math.PI / 2;
    rightEdge.position.set(maxX + t / 2, y, position.z);
    group.add(rightEdge);

    group.renderOrder = 100;
    group.userData.isSpotOutline = true;
    return group;
  }

  /**
   * Remove and dispose bench spot outline meshes.
   */
  private disposeBenchOutlines(): void {
    const disposeGroup = (g: Group) => {
      this.scene.remove(g);
      let material: MeshBasicMaterial | null = null;
      for (const child of g.children) {
        if (child instanceof Mesh) {
          child.geometry.dispose();
          material = child.material as MeshBasicMaterial; // All children share one material
        }
      }
      material?.dispose();
    };
    this.topBenchSpotOutlines.forEach(disposeGroup);
    this.bottomBenchSpotOutlines.forEach(disposeGroup);
    this.topBenchSpotOutlines = [];
    this.bottomBenchSpotOutlines = [];
  }

  /**
   * Remove and dispose other (non-bench) spot outline meshes.
   */
  private disposeOtherSpotOutlines(): void {
    const disposeGroup = (g: Group) => {
      this.scene.remove(g);
      let material: MeshBasicMaterial | null = null;
      for (const child of g.children) {
        if (child instanceof Mesh) {
          child.geometry.dispose();
          material = child.material as MeshBasicMaterial;
        }
      }
      material?.dispose();
    };
    this.otherSpotOutlines.forEach(disposeGroup);
    this.otherSpotOutlines = [];
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
          // On error (e.g. already attached for turn), restore hand via syncHand
          this.gameService.playCardAction(
            this.gameState.gameId,
            result.handIndex,
            result.zone
          ).subscribe({ error: () => this.syncHand() });
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
    const isEnergyIcon = cardObject.userData.isEnergyIcon;
    const isToolCard = cardObject.userData.isToolCard;

    // Handle energy icon click (show energy card info)
    if (isEnergyIcon && cardData && cardList) {
      this.cardsBaseService.showCardInfo({
        card: cardData,
        cardList,
        players: [this.topPlayer, this.bottomPlayer].filter(p => p)
      });
      return;
    }

    // Handle tool card click (show tool card info)
    if (isToolCard && cardData && cardList) {
      this.cardsBaseService.showCardInfo({
        card: cardData,
        cardList,
        players: [this.topPlayer, this.bottomPlayer].filter(p => p)
      });
      return;
    }

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
      // Determine which player's discard this is by checking cardList reference
      const isBottomDiscard = this.bottomPlayer && this.bottomPlayer.discard === cardList;
      const isTopDiscard = this.topPlayer && this.topPlayer.discard === cardList;
      const player = isBottomDiscard ? PlayerType.BOTTOM_PLAYER : (isTopDiscard ? PlayerType.TOP_PLAYER : PlayerType.BOTTOM_PLAYER);
      const isOwner = (isBottomDiscard && this.bottomPlayer && this.bottomPlayer.id === this.clientId) ||
        (isTopDiscard && this.topPlayer && this.topPlayer.id === this.clientId);
      const isDeleted = this.gameState.deleted;

      if (!isOwner || isDeleted) {
        // Show card list without ability options
        this.cardsBaseService.showCardInfoList({
          card: cardData,
          cardList: cardList,
          players: [this.topPlayer, this.bottomPlayer].filter(p => p)
        });
        return;
      }

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
    if (isDeck && cardList) {
      // Use the full deck CardList from userData (set by updateDeckStack)
      // Determine which player's deck this is by checking cardList reference
      const isBottomDeck = this.bottomPlayer && this.bottomPlayer.deck === cardList;
      const isTopDeck = this.topPlayer && this.topPlayer.deck === cardList;

      if (cardList) {
        const facedown = true;
        const allowReveal = !!this.gameState.replay;
        this.cardsBaseService.showCardInfoList({
          card: cardData,
          cardList: cardList, // Use full deck CardList from userData
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
    let canRetreat = false;

    if (isHandCard) {
      // Hand cards: enable abilities with useFromHand (like Luxray's Swelling Flash)
      options = { enableAbility: { useFromHand: true }, enableAttack: false };
    } else if (cardTarget) {
      if (cardTarget.slot === SlotType.ACTIVE) {
        // Active Pokemon: enable abilities (useWhenInPlay), attacks, and retreat (if not already retreated this turn)
        canRetreat = !!(this.bottomPlayer && this.gameState?.state &&
          this.bottomPlayer.retreatedTurn !== this.gameState.state.turn);
        options = { enableAbility: { useWhenInPlay: true }, enableAttack: true, enableRetreat: canRetreat };
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
      } else if (result.retreat) {
        if (!canRetreat) return;
        this.boardInteractionService.startRetreatSelection(gameId, (benchIndex) => {
          this.gameService.retreatAction(gameId, benchIndex);
        });
      }
    });
  }
}
