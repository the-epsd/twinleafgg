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
  Group,
  DoubleSide,
  Object3D,
  Clock,
} from 'three';
import { updateBoard3dHoloTime } from './board-3d-holo-material';
import { Subscription } from 'rxjs';
import gsap from 'gsap';
import type { ThreeEvent } from '@react-three/fiber';
import { Board3dAssetLoaderService } from './services/board-3d-asset-loader.service';
import { Board3dStateSyncService } from './services/board-3d-state-sync.service';
import { Board3dStackService } from './services/board-3d-stack.service';
import {
  Board3dAnimationService,
  getMultiDrawBatchStageLayout,
  getMultiDrawSharedHoldSec,
  MULTI_DRAW_STAGE_TO_HAND_STAGGER_SEC,
  type DrawFlightVisualPreset,
} from './services/board-3d-animation.service';
import { Board3dInteractionService, type DropResult, type PlayCardFlightPayload } from './services/board-3d-interaction.service';
import { Board3dHandService } from './services/board-3d-hand.service';
import { Board3dWireframeService } from './services/board-3d-wireframe.service';
import { Board3dLightingService } from './services/board-3d-lighting.service';
import { Board3dPostProcessingService } from './services/board-3d-post-processing.service';
import type { LocalGameState } from '../types/localGameState';
import {
  Player,
  CardList,
  Card,
  SlotType,
  PlayerType,
  SuperType,
  TrainerCard,
  GamePhase,
  PokemonCardList,
  type CardTarget,
  type State,
} from 'ptcg-server';
import type { Board3dCardsAdapter } from './board3dCardsAdapter';
import {
  BOARD3D_CARD_SLOT_BASE_HEIGHT,
  BOARD3D_CARD_SLOT_BASE_WIDTH,
  BOARD3D_BENCH_DROP_ZONE_HEIGHT,
  BOARD3D_BENCH_DROP_ZONE_WIDTH,
  BOARD3D_DROP_ZONE_TARGET_SCALE,
  BOARD_3D_BENCH_SLOT_OUTLINE_COLOR,
  BOARD_3D_BENCH_SLOT_OUTLINE_OPACITY,
  BOARD_3D_CENTER_EMBLEM_Y,
} from './board3d-constants';
import type { CardInfoPaneOptions } from '../../card-info/CardInfoPane';
import type { Board3dGameActions } from './board3dGameActions';
import { BoardInteractionService, type AbilityAnimationEvent, type AbilityFocusAnchor, type BasicEntranceAnimationEvent } from '../BoardInteractionService';
import {
  getBoardConfig,
  getCameraConfig,
  getBottomPrizeSlotWorld,
  getTopPrizeSlotWorld,
  getDrawFlightStageCenterWorld,
  getMaxDrawStageRowWidthWorld,
} from './board-3d-config';
import {
  board3dMeshIdForPlayTarget,
  cardIsFossilLikeTrainer,
  cardIsSupporter,
  cardIsTrainerBoardHandPlay,
  worldPositionForSupporterMeshId,
} from './board3dMeshIdForPlayTarget';
import { DropZoneType } from './board-3d-drop-zone';
import { getBenchPositions, ZONE_POSITIONS } from './board-3d-zone-positions';
import { r3fPointerEventAsMouse } from './board3dR3fPointer';
import { subscribeBoard3dInteractionStreams } from './board3dControllerSubscriptions';
import type { Board3dCard } from './board-3d-card';
import { projectCardFaceToScreenAnchor } from './board3dAbilityFocusProjection';
import { playDeckShufflePreview } from './board3dDeckShufflePreview';

export interface Board3dControllerProps {
  gameState: LocalGameState;
  topPlayer: Player;
  bottomPlayer: Player;
  bottomPlayerHand: CardList;
  topPlayerHand: CardList;
  clientId: number;
  player?: unknown;
  /** While true, React may hide Choose Prize until KO motion finishes. */
  onKoSequenceActiveChange?: (active: boolean) => void;
}

type HandDrawFlightSegment = { ids: number[]; preset: DrawFlightVisualPreset };

/** Prize→hand flight start: which side of the table (view) and 0–5 grid index. */
type PrizeFlightOrigin = { side: 'bottom' | 'top'; grid: number };

/** Context when the board runs inside React Three Fiber (shared gl/scene/camera). */
export type Board3dR3fInitContext = {
  gl: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  worldContentRoot: Object3D;
  handSlot: Object3D;
};

export class Board3dController {
  gameState!: LocalGameState;
  topPlayer!: Player;
  bottomPlayer!: Player;
  bottomPlayerHand!: CardList;
  topPlayerHand!: CardList;
  clientId!: number;
  player?: unknown;

  private canvasEl!: HTMLCanvasElement;
  private selectionSubs: Subscription[] = [];

  public scene!: Scene; // Made public for stats component
  private camera!: PerspectiveCamera;
  public renderer!: WebGLRenderer; // Made public for stats component

  // Board elements (legacy canvas mode only; R3F uses Board3dStaticScene)
  private boardMesh?: Mesh;
  private boardCenterOverlay?: Mesh;

  // Per-slot outlines (always visible, independent of drop zones)
  private topBenchSpotOutlines: Group[] = [];
  private bottomBenchSpotOutlines: Group[] = [];
  private otherSpotOutlines: Group[] = [];

  // 4x4 grid overlay on the board
  private boardGridGroup: Group | null = null;

  private animationFrameId: number = 0;
  private abilityFocusRafId: number | null = null;
  private holoClock = new Clock();
  private needsRender: boolean = true;
  private currentHoveredCard: any = null;
  private hasInitializedHand: boolean = false;
  private resizeObserver: ResizeObserver | null = null;

  private r3fMode = false;
  /** Deck/discard stacks and flight attachments (and R3F board-card subtree parent). */
  private worldContentRoot!: Object3D;
  /** Group that contains the hand fan (child of worldContentRoot in R3F). */
  private handSlot!: Object3D;

  /** When R3F mesh `onPointerDown` handles the same DOM event, skip duplicate canvas listener. */
  private r3fMeshPointerDownTs = -1;

  // Player perspective - true when viewing from opposite side (like 2D board's isUpsideDown)
  private isUpsideDown: boolean = false;

  // Animation state caching
  private hasActiveAnimationsCache: boolean = false;
  private animationCheckInterval: number = 100; // Check animation state every 100ms instead of every frame
  private lastAnimationCheck: number = 0;

  // Wireframe overlay
  public showWireframes: boolean = false;

  /** Card ids in hand order after last successful sync (for single-draw detection). */
  private lastHandCardIds: number[] = [];
  /** Which player's hand `lastHandCardIds` refers to (switch-sides swaps bottom hand → must reset diff). */
  private lastHandOwnerPlayerId: number | undefined = undefined;
  /** Prize card id → grid index (0–5) after last sync; used to detect prize→hand flights. */
  private lastBottomPrizeIdToGrid: Map<number, number> = new Map();
  private lastTopPrizeIdToGrid: Map<number, number> = new Map();
  /** Prize slots that just emptied (secret prizes use fake ids until hand sync; slot diff still works). */
  private pendingPrizeEmptiedBottom: number[] = [];
  private pendingPrizeEmptiedTop: number[] = [];
  /** Active player id after last hand sync (detect “our turn just began” vs mid-turn draws). */
  private lastHandSyncActivePlayerId: number | undefined = undefined;
  /** Serializes hand sync so rapid updates wait for draw animation to finish. */
  private syncHandChain: Promise<void> = Promise.resolve();
  /** Incremented when a failed play must supersede queued/in-flight hand sync (skip stale commits). */
  private handSyncInvalidationGen = 0;
  /** Hand update arrived while dragging; flush when drag ends. */
  private pendingHandSyncWhileDragging = false;

  /** Board mesh ids hidden while one or more hand-play flights are in progress. */
  private handPlayFlightHiddenMeshIds = new Set<string>();
  /**
   * Bench/slot meshes that already have a local hand-play flight; suppress duplicate
   * {@link playBoardBasicAnimation} from the server until consumed or timed out.
   */
  private handPlayBoardBasicAnimationSuppressedMeshIds = new Set<string>();
  /** During item hand-play flight, discard mesh stays at pre-play state until the flight ends. */
  private discardVisualFreezePlayerId: number | null = null;

  /** Supporter top card id per player after last sync (detect trainer/item → discard). */
  private lastSupporterTopCardIdByPlayerId: Map<number, number> = new Map();
  /** Player whose supporter mesh is flying to discard (freeze discard + supporter removal until done). */
  private trainerToDiscardResolvePlayerId: number | null = null;

  /** Active Pokémon top card id per player after last sync (KO detection). */
  private lastActiveTopCardIdByPlayerId = new Map<number, number>();
  /** Skip overlapping KO detach while a sequence is running. */
  private koSequenceLock = false;
  /** Keep discard pile mesh frozen while KO ghost flies (avoid duplicate top card at discard + flying ghost). */
  private koDiscardVisualFreezePlayerId: number | null = null;
  private onKoSequenceActiveChange?: (active: boolean) => void;

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private stateSync: Board3dStateSyncService,
    private animationService: Board3dAnimationService,
    private interactionService: Board3dInteractionService,
    private handService: Board3dHandService,
    private wireframeService: Board3dWireframeService,
    private lightingService: Board3dLightingService,
    private postProcessingService: Board3dPostProcessingService,
    private cardsAdapter: Board3dCardsAdapter,
    private gameActions: Board3dGameActions,
    private boardInteractionService: BoardInteractionService,
  ) { }

  getStateSync(): Board3dStateSyncService {
    return this.stateSync;
  }

  /** R3F mesh pointer surface: forwards native pointer + hit object into the interaction pipeline. */
  handleR3fMeshPointerDown(ev: ThreeEvent<PointerEvent>): void {
    if (!this.r3fMode) {
      return;
    }
    this.r3fMeshPointerDownTs = ev.nativeEvent.timeStamp;
    const canvas = this.canvasEl;
    const card = this.interactionService.onMouseDown(
      r3fPointerEventAsMouse(ev),
      this.camera,
      this.scene,
      canvas,
      ev.object,
    );
    if (card) {
      canvas.style.cursor = 'grabbing';
      this.markDirty();
    }
  }

  setProps(p: Board3dControllerProps): void {
    this.gameState = p.gameState;
    this.topPlayer = p.topPlayer;
    this.bottomPlayer = p.bottomPlayer;
    this.bottomPlayerHand = p.bottomPlayerHand;
    this.topPlayerHand = p.topPlayerHand;
    this.clientId = p.clientId;
    this.player = p.player;
    this.onKoSequenceActiveChange = p.onKoSequenceActiveChange;
    this.interactionService.setHandPlayZoneGameSettings(p.gameState.state.gameSettings);
  }

  init(canvas: HTMLCanvasElement, initial: Board3dControllerProps): void {
    this.canvasEl = canvas;
    this.setProps(initial);
    this.runInit();
    this.afterCanvasReady();
  }

  /** Initialize when React Three Fiber owns the renderer, scene, and camera. */
  initFromR3f(ctx: Board3dR3fInitContext, initial: Board3dControllerProps): void {
    this.r3fMode = true;
    this.canvasEl = ctx.gl.domElement;
    this.renderer = ctx.gl;
    this.scene = ctx.scene;
    this.camera = ctx.camera;
    this.worldContentRoot = ctx.worldContentRoot;
    this.handSlot = ctx.handSlot;
    this.setProps(initial);
    this.stateSync.setAttachmentTargets(this.worldContentRoot, null, this.scene);
    this.interactionService.setWorldContentRoot(this.worldContentRoot);
    this.runInitR3f();
    this.afterCanvasReadyR3f();
  }

  private runInit(): void {
    this.r3fMode = false;
    this.handService.setR3fDeclarativeHand(false);
    // Initialize scene components
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.worldContentRoot = this.scene;
    this.handSlot = this.scene;
    this.stateSync.setAttachmentTargets(this.worldContentRoot, this.worldContentRoot, this.scene);
    this.interactionService.setWorldContentRoot(this.worldContentRoot);
    this.lightingService.initialize(this.scene);
    this.createBoardAsync();
    this.postProcessingService.initialize(this.renderer, this.scene, this.camera, this.canvasEl);

    // Initialize wireframe service
    this.wireframeService.initialize(this.scene);

    // Initialize hand service
    this.handSlot.add(this.handService.getHandGroup());

    // Create drop zone indicators (async) with actual bench sizes
    const bottomBenchSize = this.bottomPlayer?.bench?.length ?? 5;
    const topBenchSize = this.topPlayer?.bench?.length ?? 5;
    this.interactionService.createDropZoneIndicators(this.scene, bottomBenchSize, topBenchSize).then(rebuilt => {
      if (rebuilt) {
        this.createBenchSpotOutlines(bottomBenchSize, topBenchSize);
      }
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

    this.selectionSubs.push(
      ...subscribeBoard3dInteractionStreams(this.boardInteractionService, {
        updateSelectionVisuals: () => this.updateSelectionVisuals(),
        refreshPutDamagePlacementOverlays: () => this.refreshPutDamagePlacementOverlays(),
        playBoardAttackAnimation: (ev) => this.playBoardAttackAnimation(ev),
        playBoardBasicAnimation: (ev) => this.playBoardBasicAnimation(ev),
        playBoardEvolutionAnimation: (ev) => this.playBoardEvolutionAnimation(ev),
        playBoardAbilityAnimation: (ev) => this.playBoardAbilityAnimation(ev),
      }),
    );

    this.stateSync.setBoardInteractionForDamagePreview(this.boardInteractionService);
  }

  private runInitR3f(): void {
    this.wireframeService.initialize(this.scene);
    this.handSlot.add(this.handService.getHandGroup());

    const bottomBenchSize = this.bottomPlayer?.bench?.length ?? 5;
    const topBenchSize = this.topPlayer?.bench?.length ?? 5;
    this.interactionService.createDropZoneIndicators(this.scene, bottomBenchSize, topBenchSize).then(rebuilt => {
      if (rebuilt) {
        this.createBenchSpotOutlines(bottomBenchSize, topBenchSize);
      }
      this.markDirty();
    });

    if (this.gameState) {
      this.syncGameState();
    }

    if (this.bottomPlayerHand) {
      this.syncHand();
      this.hasInitializedHand = true;
    }

    this.selectionSubs.push(
      ...subscribeBoard3dInteractionStreams(this.boardInteractionService, {
        updateSelectionVisuals: () => this.updateSelectionVisuals(),
        refreshPutDamagePlacementOverlays: () => this.refreshPutDamagePlacementOverlays(),
        playBoardAttackAnimation: (ev) => this.playBoardAttackAnimation(ev),
        playBoardBasicAnimation: (ev) => this.playBoardBasicAnimation(ev),
        playBoardEvolutionAnimation: (ev) => this.playBoardEvolutionAnimation(ev),
        playBoardAbilityAnimation: (ev) => this.playBoardAbilityAnimation(ev),
      }),
    );

    this.stateSync.setBoardInteractionForDamagePreview(this.boardInteractionService);
  }

  /** Called from React when props change after mount. */
  refreshProps(next: Board3dControllerProps): void {
    const topChanged = this.topPlayer !== next.topPlayer;
    const bottomChanged = this.bottomPlayer !== next.bottomPlayer;
    const clientChanged = this.clientId !== next.clientId;
    const gameStateChanged = this.gameState !== next.gameState;
    const handChanged = this.bottomPlayerHand !== next.bottomPlayerHand;

    // Capture prize layout *before* applying incoming props so prize→hand draws still
    // match card ids to grid slots after setProps (prizes may already be empty on next).
    let prevBottomPrizeOcc: boolean[] = Array(6).fill(false);
    let prevTopPrizeOcc: boolean[] = Array(6).fill(false);
    if (this.scene) {
      prevBottomPrizeOcc = this.prizeSlotsOccupied(this.bottomPlayer);
      prevTopPrizeOcc = this.prizeSlotsOccupied(this.topPlayer);
      if (this.bottomPlayer) {
        this.rebuildPrizeIdToGridFromPlayerPrizes(this.bottomPlayer, this.lastBottomPrizeIdToGrid);
      }
      if (this.topPlayer) {
        this.rebuildPrizeIdToGridFromPlayerPrizes(this.topPlayer, this.lastTopPrizeIdToGrid);
      }
    }

    this.setProps(next);

    if (handChanged) {
      this.pendingPrizeEmptiedBottom = this.emptiedPrizeSlotIndices(
        prevBottomPrizeOcc,
        this.prizeSlotsOccupied(this.bottomPlayer)
      );
      this.pendingPrizeEmptiedTop = this.emptiedPrizeSlotIndices(
        prevTopPrizeOcc,
        this.prizeSlotsOccupied(this.topPlayer)
      );
    } else {
      this.pendingPrizeEmptiedBottom = [];
      this.pendingPrizeEmptiedTop = [];
    }

    if (this.camera && (topChanged || bottomChanged || clientChanged)) {
      this.updatePerspective();
    }

    if (this.scene && (gameStateChanged || topChanged || bottomChanged)) {
      this.syncGameState();
    }

    if (this.scene && handChanged) {
      this.syncHand();
      this.hasInitializedHand = true;
    }
  }

  private afterCanvasReadyR3f(): void {
    this.lastAnimationCheck = performance.now();
    this.addEventListeners();
  }

  private afterCanvasReady(): void {
    this.lastAnimationCheck = performance.now();
    this.animate();
    this.addEventListeners();
    const container = this.canvasEl.parentElement;
    if (container) {
      this.resizeObserver = new ResizeObserver(() => {
        this.onContainerResize();
      });
      this.resizeObserver.observe(container);
    }
  }

  destroy(): void {
    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Kill any active animations
    this.animationService.killAllAnimations();
    this.stopAbilityFocusTracking();

    this.lastSupporterTopCardIdByPlayerId.clear();
    this.trainerToDiscardResolvePlayerId = null;
    this.lastActiveTopCardIdByPlayerId.clear();
    this.koSequenceLock = false;
    this.koDiscardVisualFreezePlayerId = null;

    this.wireframeService.dispose(this.scene);

    this.disposeBenchOutlines();
    this.disposeOtherSpotOutlines();
    this.disposeBoardGrid();

    this.stateSync.setBoardInteractionForDamagePreview(null);
    this.stateSync.dispose(this.scene);
    this.handService.dispose(this.worldContentRoot);
    this.interactionService.dispose(this.scene);

    if (!this.r3fMode) {
      this.lightingService.dispose(this.scene);
      this.postProcessingService.dispose();
      this.disposeScene();
      this.renderer?.dispose();
    }

    this.removeEventListeners();

    this.resizeObserver?.disconnect();

    for (const s of this.selectionSubs) {
      s.unsubscribe();
    }
    this.selectionSubs = [];
    this.lastHandCardIds = [];
    this.lastHandOwnerPlayerId = undefined;
    this.lastBottomPrizeIdToGrid.clear();
    this.lastTopPrizeIdToGrid.clear();
    this.pendingPrizeEmptiedBottom = [];
    this.pendingPrizeEmptiedTop = [];
    this.lastHandSyncActivePlayerId = undefined;
    this.syncHandChain = Promise.resolve();
    this.handSyncInvalidationGen = 0;
    this.pendingHandSyncWhileDragging = false;
    this.handPlayFlightHiddenMeshIds.clear();
    this.handPlayBoardBasicAnimationSuppressedMeshIds.clear();
    this.discardVisualFreezePlayerId = null;
  }

  private beginHandPlayFlightHiddenMeshes(meshIds: readonly string[]): void {
    const ids = meshIds.filter((id): id is string => Boolean(id));
    if (ids.length === 0) {
      return;
    }
    for (const meshId of ids) {
      this.handPlayFlightHiddenMeshIds.add(meshId);
      this.handPlayBoardBasicAnimationSuppressedMeshIds.add(meshId);
    }
    this.stateSync.hideBoardCardsForHandFlight(ids);
  }

  private endHandPlayFlightHiddenMeshes(meshIds: readonly string[]): void {
    const ids = meshIds.filter((id): id is string => Boolean(id));
    if (ids.length === 0) {
      return;
    }
    for (const meshId of ids) {
      this.handPlayFlightHiddenMeshIds.delete(meshId);
      if (!this.handPlayFlightHiddenMeshIds.has(meshId)) {
        const boardCard = this.stateSync.getCardById(meshId);
        if (boardCard) {
          boardCard.getGroup().visible = true;
        }
      }
    }
    window.setTimeout(() => {
      for (const meshId of ids) {
        this.handPlayBoardBasicAnimationSuppressedMeshIds.delete(meshId);
      }
    }, 2000);
  }

  private getHandPlayFlightHiddenMeshIdsForSync(): readonly string[] | undefined {
    return this.handPlayFlightHiddenMeshIds.size > 0
      ? [...this.handPlayFlightHiddenMeshIds]
      : undefined;
  }

  private initScene(): void {
    this.scene = new Scene();
  }

  private initCamera(): void {
    const canvas = this.canvasEl;
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
    const canvas = this.canvasEl;

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

    // Twinleaf emblem at true midfield (midpoint between bottom and top active rows)
    const centerTexture = await this.assetLoader.loadBoardCenterTexture();
    const emblemSize = Board3dController.BOARD_CENTER_EMBLEM_SIZE;
    const centerGeometry = new PlaneGeometry(emblemSize, emblemSize);
    const centerMaterial = new MeshBasicMaterial({
      map: centerTexture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      side: DoubleSide,
    });

    this.boardCenterOverlay = new Mesh(centerGeometry, centerMaterial);
    this.boardCenterOverlay.rotation.x = -Math.PI / 2;
    this.boardCenterOverlay.rotation.z = Math.PI;
    this.boardCenterOverlay.scale.x = -1;

    const midX =
      (ZONE_POSITIONS.bottomPlayer.active.x + ZONE_POSITIONS.topPlayer.active.x) / 2;
    const midZ =
      (ZONE_POSITIONS.bottomPlayer.active.z + ZONE_POSITIONS.topPlayer.active.z) / 2;
    this.boardCenterOverlay.position.set(midX, BOARD_3D_CENTER_EMBLEM_Y, midZ);
    this.boardCenterOverlay.renderOrder = 50;
    this.boardCenterOverlay.receiveShadow = false;
    this.scene.add(this.boardCenterOverlay);

    // Add 1-unit grid overlay (same thickness as slot outlines, half opacity)
    this.createBoardGrid();

    this.markDirty();
  }

  /** Grid height - below cards (0.1) so grid appears underneath */
  private static readonly BOARD_GRID_Y = 0.1;
  /** Diameter in world units — ~fit between active rows with margin */
  private static readonly BOARD_CENTER_EMBLEM_SIZE = 7;

  /**
   * Create a 1-unit grid overlay on the board surface.
   * Aligns with the game board's coordinate system so "move by 1 unit" is visible.
   * Same thickness as BENCH_OUTLINE_THICKNESS, 10% opacity.
   * Positioned below cards (y=0.01) so it renders underneath.
   */
  private createBoardGrid(): void {
    this.disposeBoardGrid();

    const t = Board3dController.BENCH_OUTLINE_THICKNESS;
    const y = Board3dController.BOARD_GRID_Y;
    const boardW = 70;
    const boardH = 50;
    const boardCenterZ = 12;
    const minX = -boardW / 2;
    const maxX = boardW / 2;
    const minZ = boardCenterZ - boardH / 2;
    const maxZ = boardCenterZ + boardH / 2;

    const material = new MeshBasicMaterial({
      color: Board3dController.BENCH_OUTLINE_COLOR,
      transparent: true,
      opacity: 0.1,
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
    if (this.r3fMode) {
      return;
    }
    this.animationFrameId = requestAnimationFrame(this.animate);
    updateBoard3dHoloTime(this.holoClock.getElapsedTime());
    this.stateSync.updateBillboards(this.camera);
    this.syncRemoveDamageHudPosition();
    this.postProcessingService.render();
    this.needsRender = false;
  };

  /** Legacy hook for tests; R3F uses {@link Board3dFrameEffects} instead. */
  tick(): void {
    if (!this.r3fMode) {
      return;
    }
  }

  /** World → client pixels for floating Remove damage +/- HUD (follows orbit / selected Pokémon). */
  private syncRemoveDamageHudPosition(): void {
    if (!this.boardInteractionService.isFloatingDamageHudOverlayActive()) {
      this.boardInteractionService.setRemoveDamageHudAnchor(null);
      return;
    }
    const targets = this.boardInteractionService.getSelectedTargets();
    if (targets.length === 0) {
      this.boardInteractionService.setRemoveDamageHudAnchor(null);
      return;
    }
    const group = this.stateSync.getBoardPokemonGroupForTarget(targets[0]);
    if (!group) {
      this.boardInteractionService.setRemoveDamageHudAnchor(null);
      return;
    }
    const worldPos = new Vector3(0, -2.35, 0);
    group.localToWorld(worldPos);
    worldPos.project(this.camera);
    const rect = this.canvasEl.getBoundingClientRect();
    const x = rect.left + (worldPos.x * 0.5 + 0.5) * rect.width;
    const y = rect.top + (-worldPos.y * 0.5 + 0.5) * rect.height;
    this.boardInteractionService.setRemoveDamageHudAnchor({ x, y });
  }

  /** Walk from an overlay mesh (energy icon, tool, etc.) to the host board Pokémon {@link CardTarget}. */
  private resolveBoardPokemonCardTargetFromObject(cardObject: Object3D): CardTarget | null {
    let obj: Object3D | null = cardObject;
    while (obj) {
      const ud = obj.userData;
      if (ud?.isBoardCard && ud?.cardTarget) {
        return ud.cardTarget as CardTarget;
      }
      obj = obj.parent;
    }
    return null;
  }

  private onContainerResize(): void {
    const canvas = this.canvasEl;
    const container = canvas.parentElement;
    if (!container) return;

    this.applyViewportDimensions(container.clientWidth, container.clientHeight);
  }

  /** Resize camera (and legacy renderer/composer); R3F sets gl size separately. */
  applyViewportDimensions(width: number, height: number): void {
    if (width === 0 || height === 0) return;

    const aspect = width / height;

    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    if (!this.r3fMode) {
      this.renderer.setSize(width, height);
      this.postProcessingService.setSize(width, height);
    }

    const cameraConfig = getCameraConfig(aspect, this.isUpsideDown);

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

  /** Visual-only deck shuffle preview for tuning animation (e.g. S key in R3F). */
  triggerDeckShufflePreview(): void {
    if (!this.r3fMode) {
      return;
    }
    const stackService = this.stateSync.getStackService();
    for (const stackId of stackService.getDeckStackIds()) {
      playDeckShufflePreview({
        stackService,
        getCardById: (id) => this.stateSync.getCardById(id),
        stackId,
      });
    }
  }

  private refreshActiveTopCardSnapshot(): void {
    for (const p of [this.bottomPlayer, this.topPlayer]) {
      if (!p) {
        continue;
      }
      const top = p.active?.cards[0]?.id;
      if (top != null) {
        this.lastActiveTopCardIdByPlayerId.set(p.id, top);
      } else {
        this.lastActiveTopCardIdByPlayerId.delete(p.id);
      }
    }
  }

  private tryDetectActiveKo(): {
    ghostKey: string;
    playerId: number;
    position: 'topPlayer' | 'bottomPlayer';
  } | null {
    const run = (player: Player | undefined, position: 'topPlayer' | 'bottomPlayer') => {
      if (!player) {
        return null;
      }
      if (this.gameState?.replay) {
        return null;
      }
      if (this.trainerToDiscardResolvePlayerId != null || this.koSequenceLock) {
        return null;
      }
      const prevTop = this.lastActiveTopCardIdByPlayerId.get(player.id);
      const nextTop = player.active?.cards[0]?.id;
      if (prevTop == null || nextTop === prevTop) {
        return null;
      }
      const inDiscard = player.discard?.cards?.some((c) => c.id === prevTop) ?? false;
      if (!inDiscard) {
        return null;
      }
      const ghostKey = this.stateSync.detachActiveAsKoGhost(position, player.id);
      if (!ghostKey) {
        return null;
      }
      return { ghostKey, playerId: player.id, position };
    };
    return run(this.bottomPlayer, 'bottomPlayer') ?? run(this.topPlayer, 'topPlayer');
  }

  private async runKoSequence(spec: {
    ghostKey: string;
    playerId: number;
    position: 'topPlayer' | 'bottomPlayer';
  }): Promise<void> {
    try {
      const player =
        this.bottomPlayer?.id === spec.playerId
          ? this.bottomPlayer
          : this.topPlayer?.id === spec.playerId
            ? this.topPlayer
            : undefined;
      if (!player) {
        return;
      }
      const boardCard = this.stateSync.getCardById(spec.ghostKey);
      if (!boardCard) {
        return;
      }
      const group = boardCard.getGroup();
      const prevOrder = group.renderOrder;
      group.renderOrder = 120;

      const discardCount = player.discard?.cards?.length ?? 0;
      const stackY =
        discardCount > 0
          ? (discardCount - 1) * Board3dStackService.STACK_HEIGHT_INCREMENT
          : 0;
      const target = ZONE_POSITIONS[spec.position].discard.clone();
      target.y += stackY;

      await this.animationService.playKnockOutToDiscardSequence(group, target);
      group.renderOrder = prevOrder;
      this.stateSync.removeBoardCardById(spec.ghostKey);
    } finally {
      this.koSequenceLock = false;
      this.koDiscardVisualFreezePlayerId = null;
      this.onKoSequenceActiveChange?.(false);
      this.interactionService.updateInteractiveObjects(this.scene);
      this.syncGameState();
      this.markDirty();
    }
  }

  private syncGameState(): void {
    void (async () => {
      let pendingKo: {
        ghostKey: string;
        playerId: number;
        position: 'topPlayer' | 'bottomPlayer';
      } | null = null;
      try {
        pendingKo = this.tryDetectActiveKo();
        if (pendingKo != null) {
          this.koSequenceLock = true;
          this.koDiscardVisualFreezePlayerId = pendingKo.playerId;
          this.onKoSequenceActiveChange?.(true);
        }

        let trainerDiscardDetectedPlayerId: number | null = null;
        if (this.trainerToDiscardResolvePlayerId == null) {
          const tryDetect = (player: Player | undefined): void => {
            if (!player) {
              return;
            }
            const prev = this.lastSupporterTopCardIdByPlayerId.get(player.id) ?? null;
            const cur = player.supporter?.cards[0]?.id ?? null;
            const disc = player.discard?.cards;
            const topDisc = disc?.length ? disc[disc.length - 1]?.id : null;
            if (prev != null && cur == null && topDisc === prev) {
              trainerDiscardDetectedPlayerId = player.id;
            }
          };
          tryDetect(this.bottomPlayer);
          tryDetect(this.topPlayer);
          if (trainerDiscardDetectedPlayerId != null) {
            this.trainerToDiscardResolvePlayerId = trainerDiscardDetectedPlayerId;
          }
        }

        const freezeDiscardForSync =
          this.discardVisualFreezePlayerId ??
          this.trainerToDiscardResolvePlayerId ??
          this.koDiscardVisualFreezePlayerId ??
          undefined;
        const freezeSupporterClearForSync = this.trainerToDiscardResolvePlayerId ?? undefined;

        await this.stateSync.syncState(
          this.gameState,
          this.clientId,
          this.topPlayer,
          this.bottomPlayer,
          this.interactionService.getDraggedBoardCardId(),
          this.interactionService.getScaleLockedBoardCardIds(),
          this.getHandPlayFlightHiddenMeshIdsForSync(),
          freezeDiscardForSync,
          freezeSupporterClearForSync
        );

        for (const p of [this.bottomPlayer, this.topPlayer]) {
          if (!p) {
            continue;
          }
          if (p.id === this.trainerToDiscardResolvePlayerId) {
            continue;
          }
          const supId = p.supporter?.cards[0]?.id;
          if (supId != null) {
            this.lastSupporterTopCardIdByPlayerId.set(p.id, supId);
          } else {
            this.lastSupporterTopCardIdByPlayerId.delete(p.id);
          }
        }

        if (trainerDiscardDetectedPlayerId != null) {
          void this.runTrainerToDiscardFlight(trainerDiscardDetectedPlayerId);
        }

        this.refreshActiveTopCardSnapshot();

        if (pendingKo != null) {
          void this.runKoSequence(pendingKo);
        }

        this.updateDropZoneOccupancy();
        this.updateDropZonesForBenchSize();
        this.interactionService.updateInteractiveObjects(this.scene);
        this.markDirty();
        if (this.r3fMode) {
          this.stateSync.publishSceneModel(this.handService.getHandSlotSnapshots());
          requestAnimationFrame(() => {
            this.stateSync.drainPendingR3fBoardCardDisposals();
            this.handService.drainPendingR3fHandDisposals();
          });
        }
      } catch (error) {
        if (pendingKo != null) {
          this.koSequenceLock = false;
          this.koDiscardVisualFreezePlayerId = null;
          this.onKoSequenceActiveChange?.(false);
        }
        console.error('Failed to sync 3D board state:', error);
      }
    })();
  }

  private async runTrainerToDiscardFlight(playerId: number): Promise<void> {
    try {
      const isBottom = this.bottomPlayer.id === playerId;
      const player = isBottom ? this.bottomPlayer : this.topPlayer;
      if (!player || player.id !== playerId) {
        return;
      }
      const position = isBottom ? 'bottomPlayer' : 'topPlayer';
      const meshId = `${position}_${playerId}_supporter`;
      const boardCard = this.stateSync.getCardById(meshId);
      if (!boardCard) {
        return;
      }

      const group = boardCard.getGroup();
      const prevOrder = group.renderOrder;
      group.renderOrder = 110;

      const discardCount = player.discard?.cards?.length ?? 0;
      const stackY =
        discardCount > 0
          ? (discardCount - 1) * Board3dStackService.STACK_HEIGHT_INCREMENT
          : 0;
      const target = ZONE_POSITIONS[position].discard.clone();
      target.y += stackY;

      await this.animationService.playTrainerResolveToDiscard(group, target);

      group.renderOrder = prevOrder;
    } finally {
      this.trainerToDiscardResolvePlayerId = null;
      for (const p of [this.bottomPlayer, this.topPlayer]) {
        if (!p) {
          continue;
        }
        const supId = p.supporter?.cards[0]?.id;
        if (supId != null) {
          this.lastSupporterTopCardIdByPlayerId.set(p.id, supId);
        } else {
          this.lastSupporterTopCardIdByPlayerId.delete(p.id);
        }
      }
      this.syncGameState();
    }
  }

  /**
   * Update drop zones if bench size has changed
   */
  private updateDropZonesForBenchSize(): void {
    const bottomBenchSize = this.bottomPlayer?.bench?.length ?? 5;
    const topBenchSize = this.topPlayer?.bench?.length ?? 5;

    // Recreate drop zones with updated bench sizes
    this.interactionService.createDropZoneIndicators(this.scene, bottomBenchSize, topBenchSize).then(rebuilt => {
      if (rebuilt) {
        this.createBenchSpotOutlines(bottomBenchSize, topBenchSize);
      }
      this.markDirty();
    });
  }

  /** Bench ribbon tuning */
  private static readonly BENCH_OUTLINE_THICKNESS = 0.02;
  private static readonly BENCH_OUTLINE_Y = 0.15;
  private static readonly BENCH_OUTLINE_COLOR = 0xffffff;

  /** Card/slot dimensions for non-bench outlines (match enlarged {@link Board3dDropZone} defaults). */
  private static readonly CARD_SLOT_WIDTH =
    BOARD3D_CARD_SLOT_BASE_WIDTH * BOARD3D_DROP_ZONE_TARGET_SCALE;
  private static readonly CARD_SLOT_HEIGHT =
    BOARD3D_CARD_SLOT_BASE_HEIGHT * BOARD3D_DROP_ZONE_TARGET_SCALE;

  /** Bench slot outlines — match {@link BOARD3D_BENCH_DROP_ZONE_WIDTH} / height. */
  private static readonly BENCH_SLOT_WIDTH = BOARD3D_BENCH_DROP_ZONE_WIDTH;
  private static readonly BENCH_SLOT_HEIGHT = BOARD3D_BENCH_DROP_ZONE_HEIGHT;

  /**
   * Create per-slot outline meshes for bench and all other board slots.
   * Always visible, independent of drop zone state.
   */
  private createBenchSpotOutlines(bottomBenchSize: number, topBenchSize: number): void {
    this.disposeBenchOutlines();
    this.disposeOtherSpotOutlines();

    const w = Board3dController.CARD_SLOT_WIDTH;
    const h = Board3dController.CARD_SLOT_HEIGHT;
    const benchW = Board3dController.BENCH_SLOT_WIDTH;
    const benchH = Board3dController.BENCH_SLOT_HEIGHT;

    // Bench slots
    const topPositions = getBenchPositions(topBenchSize, PlayerType.TOP_PLAYER);
    for (const pos of topPositions) {
      const group = this.createSpotOutlineGroup(
        pos,
        benchW,
        benchH,
        BOARD_3D_BENCH_SLOT_OUTLINE_COLOR,
        BOARD_3D_BENCH_SLOT_OUTLINE_OPACITY,
      );
      this.topBenchSpotOutlines.push(group);
      this.scene.add(group);
    }
    const bottomPositions = getBenchPositions(bottomBenchSize, PlayerType.BOTTOM_PLAYER);
    for (const pos of bottomPositions) {
      const group = this.createSpotOutlineGroup(
        pos,
        benchW,
        benchH,
        BOARD_3D_BENCH_SLOT_OUTLINE_COLOR,
        BOARD_3D_BENCH_SLOT_OUTLINE_OPACITY,
      );
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
      this.addSpotOutline(zp.lostZone, w, h);
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
  private createSpotOutlineGroup(
    position: Vector3,
    width: number,
    height: number,
    outlineColor: number = Board3dController.BENCH_OUTLINE_COLOR,
    outlineOpacity: number = 0,
  ): Group {
    const t = Board3dController.BENCH_OUTLINE_THICKNESS;
    const y = Board3dController.BENCH_OUTLINE_Y;
    const minX = position.x - width / 2;
    const maxX = position.x + width / 2;
    const minZ = position.z - height / 2;
    const maxZ = position.z + height / 2;

    const material = new MeshBasicMaterial({
      color: outlineColor,
      transparent: true,
      opacity: outlineOpacity,
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

  /** Replay viewer sees both hands; near-hand must render face-up like the owner's. */
  private isReplayOmniscient(): boolean {
    return !!this.gameState?.replay;
  }

  /**
   * Socket animation events use the same mesh ids as {@link Board3dStateSyncService}.
   * Slot may be `'active'` / `'bench'` (attack, board emit helpers) or stringified {@link SlotType} (`"1"` / `"2"`).
   */
  private boardMeshIdFromAnimationEvent(ev: BasicEntranceAnimationEvent): string | null {
    if (!this.bottomPlayer?.id || !this.topPlayer?.id) {
      return null;
    }
    const pos =
      ev.playerId === this.bottomPlayer.id
        ? 'bottomPlayer'
        : ev.playerId === this.topPlayer.id
          ? 'topPlayer'
          : null;
    if (!pos) {
      return null;
    }
    const slot = ev.slot;
    const isActive =
      slot === 'active' || slot === String(SlotType.ACTIVE);
    const isBench =
      slot === 'bench' || slot === String(SlotType.BENCH);
    if (isActive) {
      return `${pos}_${ev.playerId}_active`;
    }
    if (isBench && ev.index !== undefined) {
      return `${pos}_${ev.playerId}_bench_${ev.index}`;
    }
    return null;
  }

  private playBoardAttackAnimation(ev: BasicEntranceAnimationEvent): void {
    const meshId = this.boardMeshIdFromAnimationEvent(ev);
    if (!meshId) {
      this.boardInteractionService.setPendingAttackAnimationPromise(Promise.resolve());
      return;
    }
    const boardCard = this.stateSync.getCardById(meshId);
    if (!boardCard) {
      this.boardInteractionService.setPendingAttackAnimationPromise(Promise.resolve());
      return;
    }
    const p = this.animationService.playAttackAnimation(boardCard.getGroup());
    this.boardInteractionService.setPendingAttackAnimationPromise(p);
  }

  private playBoardAbilityAnimation(ev: AbilityAnimationEvent): void {
    this.stopAbilityFocusTracking();
    const maxAttempts = 12;
    const fallbackWait = this.animationService.createAbilityActivationFallbackWait();

    const tryPlay = (attempt: number): void => {
      const meshId = this.boardMeshIdFromAnimationEvent(ev);
      if (!meshId) {
        this.boardInteractionService.setPendingAbilityAnimationPromise(fallbackWait());
        return;
      }
      const boardCard = this.stateSync.getCardById(meshId);
      if (!boardCard) {
        if (attempt < maxAttempts) {
          requestAnimationFrame(() => tryPlay(attempt + 1));
          return;
        }
        this.boardInteractionService.setPendingAbilityAnimationPromise(fallbackWait());
        return;
      }
      const group = boardCard.getGroup();
      const data = group.userData?.cardData as Card | undefined;
      if (data && data.id !== ev.cardId) {
        if (attempt < maxAttempts) {
          requestAnimationFrame(() => tryPlay(attempt + 1));
          return;
        }
        this.boardInteractionService.setPendingAbilityAnimationPromise(fallbackWait());
        return;
      }

      this.startAbilityFocusTracking(group, ev.abilityName);
      const p = this.animationService.playAbilityActivationAnimation(group);
      this.boardInteractionService.setPendingAbilityAnimationPromise(p);
      void p.finally(() => {
        this.stopAbilityFocusTracking();
      });
    };

    tryPlay(0);
  }

  private projectCardGroupToScreenRect(group: Object3D): AbilityFocusAnchor | null {
    if (!this.canvasEl || !this.camera) {
      return null;
    }

    const bridge = group.userData?.board3dCard as Board3dCard | undefined;
    const cardMesh = bridge?.getMesh();
    if (!cardMesh) {
      return null;
    }

    const canvasRect = this.canvasEl.getBoundingClientRect();
    return projectCardFaceToScreenAnchor(cardMesh, this.camera, canvasRect, 6);
  }

  private startAbilityFocusTracking(group: Object3D, abilityName: string): void {
    const tick = (): void => {
      const anchor = this.projectCardGroupToScreenRect(group);
      this.boardInteractionService.setAbilityFocus({ abilityName, anchor });
      this.abilityFocusRafId = requestAnimationFrame(tick);
    };
    tick();
  }

  private stopAbilityFocusTracking(): void {
    if (this.abilityFocusRafId != null) {
      cancelAnimationFrame(this.abilityFocusRafId);
      this.abilityFocusRafId = null;
    }
    this.boardInteractionService.clearAbilityFocus();
  }

  /**
   * Basic Pokémon entrance from deck/item (socket): same motion as dragging from hand to bench
   * ({@link Board3dAnimationService.playHandCardDropOnBoard}), not {@link Board3dAnimationService.playBasicAnimation}.
   */
  private playBoardBasicAnimation(ev: BasicEntranceAnimationEvent): void {
    const maxAttempts = 12;
    /** Matches {@link Board3dHandService} hand row Z. */
    const handPlayFlightStartZ = 30;
    /** Matches retained drag scale when {@link Board3dInteractionService} uses hand play flight. */
    const handPlayFlightInitialScale = 1.3;

    const tryPlay = (attempt: number): void => {
      const meshId = this.boardMeshIdFromAnimationEvent(ev);
      if (!meshId) {
        return;
      }
      const boardCard = this.stateSync.getCardById(meshId);
      if (!boardCard) {
        if (attempt < maxAttempts) {
          requestAnimationFrame(() => tryPlay(attempt + 1));
        }
        return;
      }
      if (this.handPlayBoardBasicAnimationSuppressedMeshIds.has(meshId)) {
        this.handPlayBoardBasicAnimationSuppressedMeshIds.delete(meshId);
        return;
      }
      if (this.handPlayFlightHiddenMeshIds.has(meshId)) {
        return;
      }
      const group = boardCard.getGroup();
      const data = group.userData?.cardData as Card | undefined;
      if (data && data.id !== ev.cardId) {
        if (attempt < maxAttempts) {
          requestAnimationFrame(() => tryPlay(attempt + 1));
        }
        return;
      }

      const targetWorld = group.position.clone();
      targetWorld.y = Math.max(targetWorld.y, 0.08);

      const isTopPlayer = meshId.startsWith('topPlayer_');
      const endRotationY = isTopPlayer ? Math.PI : 0;
      const isActive = meshId.endsWith('_active');
      const endScale = isActive ? 1.5 : 1.0;

      gsap.killTweensOf(group.position);
      gsap.killTweensOf(group.rotation);
      gsap.killTweensOf(group.scale);

      group.position.set(targetWorld.x, 0.15, handPlayFlightStartZ);
      group.rotation.set(0, 0, 0);
      group.scale.setScalar(handPlayFlightInitialScale);

      void this.animationService.playHandCardDropOnBoard(group, targetWorld, {
        endScale,
        endRotationY,
      });
    };
    tryPlay(0);
  }

  private playBoardEvolutionAnimation(ev: BasicEntranceAnimationEvent): void {
    const maxAttempts = 12;
    const tryPlay = (attempt: number): void => {
      const meshId = this.boardMeshIdFromAnimationEvent(ev);
      if (!meshId) {
        return;
      }
      const boardCard = this.stateSync.getCardById(meshId);
      if (!boardCard) {
        if (attempt < maxAttempts) {
          requestAnimationFrame(() => tryPlay(attempt + 1));
        }
        return;
      }
      const group = boardCard.getGroup();
      const data = group.userData?.cardData as Card | undefined;
      if (data && data.id !== ev.cardId) {
        if (attempt < maxAttempts) {
          requestAnimationFrame(() => tryPlay(attempt + 1));
        }
        return;
      }
      void this.animationService.evolutionAnimation(group);
    };
    tryPlay(0);
  }

  private getRenderedHandCardIds(): number[] {
    return this.handService
      .getHandSlotSnapshots()
      .map(s => s.cardId)
      .filter((id): id is number => id !== undefined);
  }

  /**
   * Detect newly drawn cards by id (not positional prefix/suffix overlap).
   * Merges rendered hand ids so a stale {@link lastHandCardIds} snapshot cannot
   * re-animate cards that are already on screen.
   */
  private computeHandDrawDelta(prevIds: number[], nextIds: number[]): {
    incomingDrawIds: number[];
    stableK: number;
    drawCount: number;
    incomingFormsContiguousSuffix: boolean;
    effectivePrevCardCount: number;
  } {
    const renderedIds = this.getRenderedHandCardIds();
    const effectivePrevSet = new Set([...prevIds, ...renderedIds]);
    const incomingDrawIds = nextIds.filter(id => !effectivePrevSet.has(id));
    const drawCount = incomingDrawIds.length;

    let stableK = nextIds.length;
    if (drawCount > 0) {
      const incomingSet = new Set(incomingDrawIds);
      const firstIncomingIdx = nextIds.findIndex(id => incomingSet.has(id));
      stableK = firstIncomingIdx >= 0 ? firstIncomingIdx : nextIds.length;
    }

    const incomingFormsContiguousSuffix =
      drawCount === 0 ||
      (nextIds.length - stableK === drawCount &&
        nextIds.slice(stableK).every((id, i) => id === incomingDrawIds[i]));

    const effectivePrevCardCount = Math.max(prevIds.length, renderedIds.length);

    return {
      incomingDrawIds,
      stableK,
      drawCount,
      incomingFormsContiguousSuffix,
      effectivePrevCardCount,
    };
  }

  private flushPendingHandSyncAfterDrag(): void {
    if (!this.pendingHandSyncWhileDragging) {
      return;
    }
    this.pendingHandSyncWhileDragging = false;
    if (this.interactionService.getIsDragging() || this.interactionService.hasPendingDrag()) {
      this.pendingHandSyncWhileDragging = true;
      return;
    }
    this.syncHand();
  }

  private syncHand(): void {
    // Skip sync if user is currently dragging a card to prevent destroying the dragged card
    if (this.interactionService.getIsDragging()) {
      this.pendingHandSyncWhileDragging = true;
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

    this.syncHandChain = this.syncHandChain.then(() => this.runSyncHandOnce());
  }

  /** After server rejects playCard: skip animation queue and rebuild hand from current props immediately. */
  private forceHandResyncAfterFailedPlay(): void {
    if (this.interactionService.getIsDragging()) {
      this.pendingHandSyncWhileDragging = true;
      return;
    }
    if (!this.bottomPlayerHand || !this.bottomPlayer) {
      return;
    }
    const handGroup = this.handService.getHandGroup();
    if (!this.scene.children.includes(handGroup)) {
      this.scene.add(handGroup);
    }
    this.handSyncInvalidationGen++;
    this.syncHandChain = Promise.resolve();
    this.syncHandChain = this.syncHandChain.then(() => this.runSyncHandOnce({ immediate: true }));
  }

  /**
   * Prize card id → grid index for the given player's prize layout.
   * Used so prize→hand flights start from the prize mesh, not the deck.
   */
  private rebuildPrizeIdToGridFromPlayerPrizes(player: Player | undefined, into: Map<number, number>): void {
    into.clear();
    const prizes = player?.prizes;
    if (!prizes) {
      return;
    }
    prizes.forEach((pile, gridIndex) => {
      const card = pile?.cards?.[0];
      if (card) {
        into.set(card.id, gridIndex);
      }
    });
  }

  private prizeSlotsOccupied(player: Player | undefined): boolean[] {
    const occ = Array(6).fill(false) as boolean[];
    const prizes = player?.prizes;
    if (!prizes) {
      return occ;
    }
    for (let i = 0; i < 6; i++) {
      const pile = prizes[i];
      occ[i] = !!(pile?.cards?.length);
    }
    return occ;
  }

  private emptiedPrizeSlotIndices(prev: boolean[], next: boolean[]): number[] {
    const out: number[] = [];
    for (let i = 0; i < 6; i++) {
      if (prev[i] && !next[i]) {
        out.push(i);
      }
    }
    return out;
  }

  /**
   * Map hand card id → prize world slot for this draw sync (id map + secret-prize slot diff).
   */
  private buildPrizeFlightOrigins(incomingDrawIds: number[]): Map<number, PrizeFlightOrigin> {
    const meta = new Map<number, PrizeFlightOrigin>();
    const frozenBottom = new Map(this.lastBottomPrizeIdToGrid);
    const frozenTop = new Map(this.lastTopPrizeIdToGrid);
    for (const id of incomingDrawIds) {
      const gb = frozenBottom.get(id);
      if (gb !== undefined) {
        meta.set(id, { side: 'bottom', grid: gb });
      }
      const gt = frozenTop.get(id);
      if (gt !== undefined) {
        meta.set(id, { side: 'top', grid: gt });
      }
    }
    const bottomSlots = [...this.pendingPrizeEmptiedBottom].sort((a, b) => a - b);
    const topSlots = [...this.pendingPrizeEmptiedTop].sort((a, b) => a - b);
    const slotQueue: PrizeFlightOrigin[] = [
      ...bottomSlots.map(grid => ({ side: 'bottom' as const, grid })),
      ...topSlots.map(grid => ({ side: 'top' as const, grid })),
    ];
    for (const id of incomingDrawIds) {
      if (!meta.has(id) && slotQueue.length > 0) {
        meta.set(id, slotQueue.shift()!);
      }
    }
    return meta;
  }

  private refreshBottomPrizeSnapshotFromCurrentState(): void {
    this.rebuildPrizeIdToGridFromPlayerPrizes(this.bottomPlayer, this.lastBottomPrizeIdToGrid);
    this.rebuildPrizeIdToGridFromPlayerPrizes(this.topPlayer, this.lastTopPrizeIdToGrid);
  }

  /**
   * When the server batches several draws into one hand update, run flights in order:
   * prize cards → other deck draws (mulligan/comp style) → turn-open draw.
   */
  private buildHandDrawFlightSegments(
    incoming: number[],
    isPrize: (id: number) => boolean,
    gs: State | undefined,
    ourTurnJustBegan: boolean,
    bottomId: number | undefined,
    nowActivePlayerId: number | undefined
  ): HandDrawFlightSegment[] {
    if (incoming.length === 0) {
      return [];
    }

    let firstDeckIdx = 0;
    while (firstDeckIdx < incoming.length && isPrize(incoming[firstDeckIdx])) {
      firstDeckIdx++;
    }
    let afterDeck = firstDeckIdx;
    while (afterDeck < incoming.length && !isPrize(incoming[afterDeck])) {
      afterDeck++;
    }
    if (afterDeck < incoming.length && isPrize(incoming[afterDeck])) {
      return [{ ids: incoming, preset: 'default' }];
    }

    const prizePart = firstDeckIdx > 0 ? incoming.slice(0, firstDeckIdx) : [];
    const deckPart = incoming.slice(firstDeckIdx);

    const segs: HandDrawFlightSegment[] = [];
    if (prizePart.length > 0) {
      segs.push({ ids: prizePart, preset: 'default' });
    }

    if (deckPart.length === 0) {
      return segs;
    }

    const firstTurnOpen =
      gs?.phase === GamePhase.PLAYER_TURN &&
      (ourTurnJustBegan ||
        (gs.turn === 1 && bottomId !== undefined && nowActivePlayerId === bottomId));

    if (gs?.phase === GamePhase.SETUP) {
      segs.push({ ids: deckPart, preset: 'setupMulligan' });
      return segs;
    }

    // Only split "comp-style then mandatory draw" when our turn actually just began
    // (opponent → us). Turn 1 + we are active (going first) must not split: a batched
    // deck slice would wrongly animate as (n−1) mulligan + 1 turn draw.
    if (deckPart.length >= 2 && gs?.phase === GamePhase.PLAYER_TURN && ourTurnJustBegan) {
      segs.push({ ids: deckPart.slice(0, -1), preset: 'setupMulligan' });
      segs.push({ ids: deckPart.slice(-1), preset: 'turnBegin' });
      return segs;
    }

    const singleTurnOpen =
      deckPart.length === 1 && gs?.phase === GamePhase.PLAYER_TURN && firstTurnOpen;
    segs.push({
      ids: deckPart,
      preset: singleTurnOpen ? 'turnBegin' : 'default'
    });
    return segs;
  }

  private async runAnimatedHandDrawSegments(
    segments: HandDrawFlightSegment[],
    fullIncoming: number[],
    stableKStart: number,
    finalTotal: number,
    isOwner: boolean,
    playableCardIds: number[] | undefined,
    aspect: number,
    boardConfig: ReturnType<typeof getBoardConfig>,
    prizeFlightOrigins: ReadonlyMap<number, PrizeFlightOrigin>,
    totalDeckDrawsFull: number
  ): Promise<boolean> {
    const isFromPrize = (id: number) => prizeFlightOrigins.has(id);

    const flightStartAtGlobal = (stepInFull: number): Vector3 => {
      const id = fullIncoming[stepInFull];
      const origin = prizeFlightOrigins.get(id);
      if (origin !== undefined) {
        return origin.side === 'bottom'
          ? getBottomPrizeSlotWorld(aspect, origin.grid)
          : getTopPrizeSlotWorld(aspect, origin.grid);
      }
      let deckOrd = 0;
      for (let j = 0; j < stepInFull; j++) {
        if (!isFromPrize(fullIncoming[j])) {
          deckOrd++;
        }
      }
      const base = boardConfig.zonePositions.bottomPlayer.deck.clone();
      const L = this.bottomPlayer.deck?.cards.length ?? 0;
      const deckSizeBefore = L + totalDeckDrawsFull - deckOrd;
      base.y += Math.max(0, deckSizeBefore - 1) * 0.015;
      return base;
    };

    let stableKRun = stableKStart;
    let globalBase = 0;

    for (const seg of segments) {
      const drawCount = seg.ids.length;
      const drawFlightPreset = seg.preset;

      if (drawCount === 1) {
        const batchOkSingle = this.handService.beginBatchDrawPrepare();
        if (!batchOkSingle) {
          return false;
        }
        try {
          const flightStart = flightStartAtGlobal(globalBase);
          const flyCardId = fullIncoming[globalBase];
          const prep = await this.handService.prepareBatchDrawFlightStep(
            this.bottomPlayerHand,
            isOwner,
            this.handSlot,
            this.worldContentRoot,
            flightStart,
            playableCardIds,
            stableKRun,
            0,
            true,
            flyCardId
          );
          if (!prep) {
            return false;
          }
          const stage = getDrawFlightStageCenterWorld(aspect, this.isUpsideDown);
          await this.animationService.playDrawFromDeckToHand(
            prep.flyingCard,
            stage,
            prep.handSlotWorld,
            {
              onRevealFace: () => {
                this.handService.revealDrawFlightFace(prep.flyingCard);
              },
              visualPreset: drawFlightPreset
            }
          );
          this.handService.finishDrawFlight(prep.flyingCard, finalTotal);
        } finally {
          this.handService.endBatchDrawPrepare();
        }
      } else {
        const stageBase = getDrawFlightStageCenterWorld(aspect, this.isUpsideDown);
        const maxRowWidth = getMaxDrawStageRowWidthWorld(aspect, this.isUpsideDown);
        const { stageScale: batchStageScale, centerSpread: spread } = getMultiDrawBatchStageLayout(
          drawCount,
          maxRowWidth
        );

        let prizePrefixLenSeg = 0;
        while (prizePrefixLenSeg < drawCount && isFromPrize(fullIncoming[globalBase + prizePrefixLenSeg])) {
          prizePrefixLenSeg++;
        }
        let prizeFirstIncomingBlock = true;
        for (let p = prizePrefixLenSeg; p < drawCount; p++) {
          if (isFromPrize(fullIncoming[globalBase + p])) {
            prizeFirstIncomingBlock = false;
            break;
          }
        }
        const deckInSeg = drawCount - prizePrefixLenSeg;
        const usePrizeThenDeckPhases =
          prizeFirstIncomingBlock && prizePrefixLenSeg > 0 && deckInSeg > 0;

        const batchOk = this.handService.beginBatchDrawPrepare();
        if (!batchOk) {
          return false;
        }
        try {
          let aborted = false;
          let globalFirstStep = true;
          const staged: Object3D[] = new Array(drawCount);

          const runCardToStageOnly = async (localStep: number) => {
            const g = globalBase + localStep;
            const flightStart = flightStartAtGlobal(g);
            const flyCardId = fullIncoming[g];
            const prep = await this.handService.prepareBatchDrawFlightStep(
              this.bottomPlayerHand,
              isOwner,
              this.handSlot,
              this.worldContentRoot,
              flightStart,
              playableCardIds,
              stableKRun,
              localStep,
              globalFirstStep,
              flyCardId
            );
            globalFirstStep = false;
            if (!prep) {
              aborted = true;
              return;
            }
            const stagePos = stageBase.clone();
            stagePos.x += (localStep - (drawCount - 1) / 2) * spread;
            await this.animationService.playDrawDeckToStage(prep.flyingCard, stagePos, {
              onRevealFace: () => {
                this.handService.revealDrawFlightFace(prep.flyingCard);
              },
              omitPhasePad: true,
              targetStageScale: batchStageScale,
              visualPreset: drawFlightPreset
            });
            staged[localStep] = prep.flyingCard;
          };

          if (usePrizeThenDeckPhases) {
            for (let i = 0; i < prizePrefixLenSeg && !aborted; i++) {
              await runCardToStageOnly(i);
            }
            for (let i = prizePrefixLenSeg; i < drawCount && !aborted; i++) {
              await runCardToStageOnly(i);
            }
          } else {
            for (let i = 0; i < drawCount && !aborted; i++) {
              await runCardToStageOnly(i);
            }
          }

          const allStaged = !aborted && staged.every(c => c != null);
          if (!allStaged) {
            return false;
          }

          await new Promise<void>(resolve => {
            setTimeout(resolve, getMultiDrawSharedHoldSec(drawFlightPreset) * 1000);
          });
          await Promise.all(
            staged.map((card, i) =>
              this.animationService.playDrawStageToHand(
                card,
                this.handService.getHandSlotWorld(stableKRun + i, finalTotal),
                {
                  burst: true,
                  visualPreset: drawFlightPreset,
                  delay: i * MULTI_DRAW_STAGE_TO_HAND_STAGGER_SEC,
                }
              )
            )
          );
          for (let i = 0; i < drawCount; i++) {
            this.handService.finishDrawFlight(staged[i], finalTotal);
          }
        } finally {
          this.handService.endBatchDrawPrepare();
        }
      }

      globalBase += drawCount;
      stableKRun += drawCount;
    }

    return true;
  }

  private async runSyncHandOnce(opts?: { immediate?: boolean }): Promise<void> {
    const genAtStart = this.handSyncInvalidationGen;
    try {
      if (!this.bottomPlayerHand || !this.bottomPlayer) {
        return;
      }

      if (
        this.lastHandOwnerPlayerId !== undefined &&
        this.bottomPlayer.id !== this.lastHandOwnerPlayerId
      ) {
        this.lastHandCardIds = [];
        this.lastHandSyncActivePlayerId = undefined;
      }

      const nextIds = this.bottomPlayerHand.cards.map(c => c.id);

      if (opts?.immediate) {
        if (genAtStart !== this.handSyncInvalidationGen) {
          return;
        }
        const isOwnerImm = this.bottomPlayer.id === this.clientId || this.isReplayOmniscient();
        const playableImm = this.isReplayOmniscient()
          ? undefined
          : this.bottomPlayer.playableCardIds;
        await this.handService.updateHand(
          this.bottomPlayerHand,
          isOwnerImm,
          this.handSlot,
          playableImm
        );
        if (genAtStart !== this.handSyncInvalidationGen) {
          return;
        }
        this.lastHandCardIds = nextIds;
        this.lastHandOwnerPlayerId = this.bottomPlayer.id;
        this.refreshBottomPrizeSnapshotFromCurrentState();
        if (this.gameState?.state) {
          const s = this.gameState.state;
          this.lastHandSyncActivePlayerId = s.players[s.activePlayer]?.id;
        }
        this.interactionService.updateInteractiveObjects(this.scene);
        this.markDirty();
        return;
      }

      const prevIds = this.lastHandCardIds;
      const prevLen = prevIds.length;

      const {
        incomingDrawIds,
        stableK,
        drawCount,
        incomingFormsContiguousSuffix,
        effectivePrevCardCount,
      } = this.computeHandDrawDelta(prevIds, nextIds);

      const handIdsSameMultiset = (a: number[], b: number[]): boolean => {
        if (a.length !== b.length) {
          return false;
        }
        const sa = [...a].sort((x, y) => x - y);
        const sb = [...b].sort((x, y) => x - y);
        for (let i = 0; i < sa.length; i++) {
          if (sa[i] !== sb[i]) {
            return false;
          }
        }
        return true;
      };

      const looksLikeHandReorderOnly =
        drawCount > 0 &&
        prevLen === nextIds.length &&
        handIdsSameMultiset(prevIds, nextIds);

      // Playing a card removes from hand (shorter). Deck draws keep size or grow; never treat a shrink as draw.
      const nextIdSet = new Set(nextIds);
      const removedCount = prevIds.filter(id => !nextIdSet.has(id)).length;
      const netGrowth = nextIds.length - effectivePrevCardCount;
      const handShrank = netGrowth < 0;
      const shouldAnimateDraw =
        effectivePrevCardCount > 0 &&
        !handShrank &&
        drawCount >= 1 &&
        removedCount + netGrowth === drawCount &&
        incomingFormsContiguousSuffix &&
        !looksLikeHandReorderOnly;

      const isOwner = this.bottomPlayer.id === this.clientId || this.isReplayOmniscient();
      const playableCardIds = this.isReplayOmniscient()
        ? undefined
        : this.bottomPlayer.playableCardIds;
      const aspect = this.canvasEl.clientWidth / Math.max(this.canvasEl.clientHeight, 1);
      const boardConfig = getBoardConfig(aspect);

      const gs = this.gameState?.state;
      const nowActivePlayerId = gs ? gs.players[gs.activePlayer]?.id : undefined;
      const bottomId = this.bottomPlayer?.id;
      const ourTurnJustBegan =
        !!gs &&
        gs.phase === GamePhase.PLAYER_TURN &&
        bottomId !== undefined &&
        nowActivePlayerId === bottomId &&
        this.lastHandSyncActivePlayerId !== undefined &&
        this.lastHandSyncActivePlayerId !== bottomId;

      // Option A (setup UX): never deck-flight the hand during SETUP — avoids 7× mulligan
      // parades when an empty-hand stateChange is missed and diff looks like a full redraw.
      const shouldAnimateDrawEffective =
        shouldAnimateDraw && gs?.phase !== GamePhase.SETUP;

      if (import.meta.env.DEV && gs?.phase === GamePhase.SETUP) {
        const incomingPreview =
          incomingDrawIds.length <= 6
            ? incomingDrawIds
            : [...incomingDrawIds.slice(0, 3), '…', ...incomingDrawIds.slice(-2)];
        console.debug('[Board3D] hand sync (SETUP)', {
          prevLen,
          nextLen: nextIds.length,
          stableK,
          drawCount,
          handShrank,
          shouldAnimateDraw,
          shouldAnimateDrawEffective,
          handClearedToEmpty: prevLen > 0 && nextIds.length === 0,
          incomingPreview,
        });
      }

      if (shouldAnimateDrawEffective && incomingDrawIds.length > 0) {
        const prizeFlightOrigins = this.buildPrizeFlightOrigins(incomingDrawIds);
        const isFromPrizeForSegments = (id: number) => prizeFlightOrigins.has(id);
        const totalDeckDrawsThisSync = incomingDrawIds.filter(id => !prizeFlightOrigins.has(id)).length;
        const segments = this.buildHandDrawFlightSegments(
          incomingDrawIds,
          isFromPrizeForSegments,
          gs,
          ourTurnJustBegan,
          bottomId,
          nowActivePlayerId
        );
        const animated = await this.runAnimatedHandDrawSegments(
          segments,
          incomingDrawIds,
          stableK,
          nextIds.length,
          isOwner,
          playableCardIds,
          aspect,
          boardConfig,
          prizeFlightOrigins,
          totalDeckDrawsThisSync
        );
        if (genAtStart !== this.handSyncInvalidationGen) {
          return;
        }
        if (!animated) {
          await this.handService.updateHand(
            this.bottomPlayerHand,
            isOwner,
            this.handSlot,
            playableCardIds
          );
        }
      } else {
        await this.handService.updateHand(
          this.bottomPlayerHand,
          isOwner,
          this.handSlot,
          playableCardIds
        );
      }

      if (genAtStart !== this.handSyncInvalidationGen) {
        return;
      }
      this.lastHandCardIds = nextIds;
      this.lastHandOwnerPlayerId = this.bottomPlayer.id;
      this.refreshBottomPrizeSnapshotFromCurrentState();
      if (this.gameState?.state) {
        const s = this.gameState.state;
        this.lastHandSyncActivePlayerId = s.players[s.activePlayer]?.id;
      }
      this.interactionService.updateInteractiveObjects(this.scene);
      this.markDirty();
      if (this.r3fMode) {
        this.stateSync.publishSceneModel(this.handService.getHandSlotSnapshots());
        requestAnimationFrame(() => {
          this.handService.drainPendingR3fHandDisposals();
        });
      }
    } catch (error) {
      console.error('[Board3D] Failed to sync 3D hand:', error);
    } finally {
      this.pendingPrizeEmptiedBottom = [];
      this.pendingPrizeEmptiedTop = [];
    }
  }

  private addEventListeners(): void {
    const canvas = this.canvasEl;

    if (this.r3fMode) {
      // `pointerdown`: raycast for hand, prizes, stacks, drop zones; board cards also fire mesh `onPointerDown`
      // with the same timestamp — {@link handleR3fMeshPointerDown} + {@link r3fMeshPointerDownTs} dedup.
      canvas.addEventListener('pointerdown', this.onPointerDown);
      canvas.addEventListener('pointermove', this.onPointerMove);
      canvas.addEventListener('pointerup', this.onPointerUp);
      canvas.addEventListener('pointercancel', this.onPointerCancel);
      canvas.addEventListener('pointerleave', this.onPointerLeave);
      canvas.addEventListener('contextmenu', this.onContextMenu);
    } else {
      canvas.addEventListener('mousedown', this.onMouseDown);
      canvas.addEventListener('mousemove', this.onMouseMove);
      canvas.addEventListener('mouseup', this.onMouseUp);
      canvas.addEventListener('mouseleave', this.onMouseLeave);
      canvas.addEventListener('contextmenu', this.onContextMenu);
    }
  }

  private removeEventListeners(): void {
    const canvas = this.canvasEl;

    if (this.r3fMode) {
      canvas.removeEventListener('pointerdown', this.onPointerDown);
      canvas.removeEventListener('pointermove', this.onPointerMove);
      canvas.removeEventListener('pointerup', this.onPointerUp);
      canvas.removeEventListener('pointercancel', this.onPointerCancel);
      canvas.removeEventListener('pointerleave', this.onPointerLeave);
      canvas.removeEventListener('contextmenu', this.onContextMenu);
    } else {
      canvas.removeEventListener('mousedown', this.onMouseDown);
      canvas.removeEventListener('mousemove', this.onMouseMove);
      canvas.removeEventListener('mouseup', this.onMouseUp);
      canvas.removeEventListener('mouseleave', this.onMouseLeave);
      canvas.removeEventListener('contextmenu', this.onContextMenu);
    }
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (this.r3fMode && event.timeStamp === this.r3fMeshPointerDownTs) {
      return;
    }
    this.onMouseDown(event as unknown as MouseEvent);
  };

  private onPointerMove = (event: PointerEvent): void => {
    this.onMouseMove(event as unknown as MouseEvent);
  };

  private onPointerUp = (event: PointerEvent): void => {
    this.onMouseUp(event as unknown as MouseEvent);
  };

  private onPointerCancel = (): void => {
    this.onMouseLeave();
  };

  private onPointerLeave = (): void => {
    this.onMouseLeave();
  };

  private onMouseDown = (event: MouseEvent): void => {
    const canvas = this.canvasEl;
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
  };

  private onMouseMove = (event: MouseEvent): void => {
    const canvas = this.canvasEl;

    if (this.interactionService.getIsDragging() || this.interactionService.hasPendingDrag()) {
      this.interactionService.onMouseMoveDrag(
        event,
        this.camera,
        this.scene,
        canvas
      );
    } else {
      const hoveredCard = this.interactionService.onMouseMove(
        event,
        this.camera,
        this.scene,
        canvas
      );

      if (hoveredCard !== this.currentHoveredCard) {
        if (hoveredCard) {
          canvas.style.cursor = hoveredCard.userData.isHandCard ? 'grab' : 'pointer';
        } else {
          canvas.style.cursor = 'default';
        }
        this.currentHoveredCard = hoveredCard;
      }
    }

    this.markDirty();
  };

  private onMouseUp = (event: MouseEvent): void => {
    const canvas = this.canvasEl;
    const isHandPlayTargetSelection = this.boardInteractionService.isHandPlayTargetSelectionActive();
    const result = this.interactionService.onMouseUp(
      event,
      this.camera,
      this.scene,
      canvas,
      this.boardInteractionService.isSelectionActive(),
      isHandPlayTargetSelection,
    );

    if (result?.action === 'cancelHandPlayTarget') {
      this.boardInteractionService.cancelHandPlayTargetSelection();
      this.updateSelectionVisuals();
      canvas.style.cursor = 'default';
      this.markDirty();
      return;
    }

    if (
      result &&
      (result.action === 'playCard' ||
        result.action === 'pickAttachTarget' ||
        (result.action === 'click' && result.clickedCard?.userData.isHandCard))
    ) {
      if (isHandPlayTargetSelection) {
        this.boardInteractionService.clearHandPlayTargetSelectionSilently();
        this.updateSelectionVisuals();
      }
    }

    if (result) {
      if (result.action === 'click' && result.clickedCard) {
        this.onCardClicked(result.clickedCard);
      } else if (result.action === 'pickAttachTarget' && result.handIndex !== undefined && result.eligibleTargets) {
        this.boardInteractionService.startHandPlayTargetSelection(result.eligibleTargets, (target) => {
          this.updateSelectionVisuals();
          if (target && result.handIndex !== undefined) {
            this.executeHandAttachPlay(result.handIndex, target);
          }
        });
        this.updateSelectionVisuals();
      } else if (result.action === 'playCard' && result.handIndex !== undefined && result.zone) {
        this.executeHandPlayCard(result);
      } else if (result.action === 'retreat' && result.benchIndex !== undefined) {
        void this.gameActions.retreatAction(this.gameState.gameId, result.benchIndex);
      }
    }

    canvas.style.cursor = 'default';
    this.flushPendingHandSyncAfterDrag();
    this.markDirty();
  };

  private executeHandAttachPlay(handIndex: number, zone: CardTarget): void {
    const handCard = handIndex >= 0 ? this.bottomPlayerHand.cards[handIndex] : undefined;
    if (handCard?.superType === SuperType.ENERGY) {
      const ejected = this.handService.detachCardForBoardPlay(handIndex, this.worldContentRoot);
      if (ejected) {
        this.executeEnergyAttachFlight(handIndex, zone, {
          board3dCard: ejected,
          targetWorld: new Vector3(),
          endScale: 1,
          endRotationY: 0,
          dropZoneType: DropZoneType.BENCH,
          energyAttach: {
            attachTarget: zone,
            energyCard: handCard,
          },
        });
        return;
      }
    }
    this.handService.removeCard(handIndex);
    void this.gameActions
      .playCardAction(this.gameState.gameId, handIndex, zone)
      .catch(() => this.forceHandResyncAfterFailedPlay());
    this.markDirty();
  }

  private pokemonListForAttachTarget(target: CardTarget): PokemonCardList | null {
    const player = target.player === PlayerType.BOTTOM_PLAYER ? this.bottomPlayer : this.topPlayer;
    if (!player) {
      return null;
    }
    if (target.slot === SlotType.ACTIVE) {
      return player.active;
    }
    if (target.slot === SlotType.BENCH) {
      return player.bench[target.index] ?? null;
    }
    return null;
  }

  private hostMeshIdForAttachTarget(target: CardTarget): string | null {
    const dropType = target.slot === SlotType.ACTIVE ? DropZoneType.ACTIVE : DropZoneType.BENCH;
    return board3dMeshIdForPlayTarget(target, dropType, this.bottomPlayer, this.topPlayer);
  }

  private executeEnergyAttachFlight(
    handIndex: number,
    playTarget: CardTarget,
    flight: PlayCardFlightPayload,
  ): void {
    const energyAttach = flight.energyAttach;
    if (!energyAttach) {
      return;
    }

    const hostMeshId = this.hostMeshIdForAttachTarget(playTarget);
    const hostBoardCard = hostMeshId ? this.stateSync.getCardById(hostMeshId) : undefined;
    const pokemonBeforeAttach = this.pokemonListForAttachTarget(playTarget);
    const energySlotIndex = pokemonBeforeAttach?.energies?.cards.length ?? 0;
    const group = flight.board3dCard.getGroup();
    let flightDisposed = false;

    if (hostMeshId) {
      this.stateSync.setSuppressedEnergyIconSlot(hostMeshId, energySlotIndex);
    }

    const finishFlight = (): void => {
      if (flightDisposed) {
        return;
      }
      flightDisposed = true;
      if (hostMeshId) {
        this.stateSync.clearSuppressedEnergyIconSlot(hostMeshId);
        const pokemonAfter = this.pokemonListForAttachTarget(playTarget);
        if (pokemonAfter?.energies) {
          void this.stateSync.refreshEnergyOverlayForCard(hostMeshId, pokemonAfter.energies);
        }
      }
      flight.board3dCard.dispose();
      this.interactionService.updateInteractiveObjects(this.scene);
      this.markDirty();
    };

    const abortFlight = (): void => {
      gsap.killTweensOf(group.position);
      gsap.killTweensOf(group.rotation);
      gsap.killTweensOf(group.scale);
      group.removeFromParent();
      if (hostMeshId) {
        this.stateSync.clearSuppressedEnergyIconSlot(hostMeshId);
      }
      if (!flightDisposed) {
        flightDisposed = true;
        flight.board3dCard.dispose();
      }
      this.interactionService.updateInteractiveObjects(this.scene);
      this.syncGameState();
      this.forceHandResyncAfterFailedPlay();
      this.markDirty();
    };

    void this.gameActions
      .playCardAction(this.gameState.gameId, handIndex, playTarget)
      .catch(() => abortFlight());

    if (!hostBoardCard) {
      finishFlight();
      this.syncGameState();
      return;
    }

    void (async () => {
      try {
        const energyList = pokemonBeforeAttach?.energies ?? new CardList();
        const iconTexture = await this.stateSync.loadEnergyIconTexture(
          energyAttach.energyCard,
          energyList,
        );
        await this.animationService.playEnergyAttachToPokemon(
          flight.board3dCard,
          hostBoardCard,
          energySlotIndex,
          iconTexture,
        );
        finishFlight();
        this.syncGameState();
      } catch {
        abortFlight();
      }
    })();
  }

  private executeHandPlayCard(result: DropResult): void {
    if (result.handIndex === undefined || !result.zone) {
      return;
    }

    const playedHandCard =
      result.handIndex >= 0 ? this.bottomPlayerHand.cards[result.handIndex] : undefined;
    if (
      !this.gameState.replay &&
      playedHandCard?.superType === SuperType.TRAINER &&
      !cardIsFossilLikeTrainer(playedHandCard)
    ) {
      this.boardInteractionService.beginTrainerPlayEffectPromptDelay();
    }
    const trainerBoardHandPlay = cardIsTrainerBoardHandPlay(playedHandCard);
    const playTarget: CardTarget = trainerBoardHandPlay
      ? {
        player: result.zone.player,
        slot: SlotType.BOARD,
        index: result.zone.index,
      }
      : result.zone;

    const flight = result.playCardFlight;
    if (flight) {
      if (flight.energyAttach) {
        this.executeEnergyAttachFlight(result.handIndex, playTarget, flight);
        return;
      }

      const group = flight.board3dCard.getGroup();
      let flightDisposed = false;
      const handCard = playedHandCard;
      const resolvedTrainerType =
        handCard?.superType === SuperType.TRAINER
          ? (handCard as TrainerCard).trainerType
          : flight.trainerType;

      const itemHandPlayFlight =
        trainerBoardHandPlay && !cardIsSupporter(playedHandCard);
      if (itemHandPlayFlight) {
        this.discardVisualFreezePlayerId =
          playTarget.player === PlayerType.BOTTOM_PLAYER
            ? this.bottomPlayer.id
            : this.topPlayer.id;
      }

      const supporterSlotMeshId = trainerBoardHandPlay
        ? board3dMeshIdForPlayTarget(
          playTarget,
          DropZoneType.SUPPORTER,
          this.bottomPlayer,
          this.topPlayer,
          resolvedTrainerType
        )
        : null;

      const flightHiddenMeshIds: string[] = [];
      if (cardIsSupporter(playedHandCard)) {
        if (supporterSlotMeshId) {
          flightHiddenMeshIds.push(supporterSlotMeshId);
        }
      } else if (trainerBoardHandPlay) {
        if (supporterSlotMeshId) {
          flightHiddenMeshIds.push(supporterSlotMeshId);
        }
      } else {
        const singleHidden = board3dMeshIdForPlayTarget(
          playTarget,
          flight.dropZoneType,
          this.bottomPlayer,
          this.topPlayer,
          resolvedTrainerType
        );
        if (singleHidden) {
          flightHiddenMeshIds.push(singleHidden);
        }
      }

      const hiddenForThisFlight = flightHiddenMeshIds;
      this.beginHandPlayFlightHiddenMeshes(hiddenForThisFlight);

      const trainerBoardLanding =
        supporterSlotMeshId && worldPositionForSupporterMeshId(supporterSlotMeshId);
      if (trainerBoardLanding && supporterSlotMeshId) {
        flight.targetWorld.copy(trainerBoardLanding);
        flight.endScale = 1.0;
        flight.endRotationY = supporterSlotMeshId.startsWith('topPlayer_') ? Math.PI : 0;
      }

      const disposeFlight = (): void => {
        if (flightDisposed) {
          return;
        }
        flightDisposed = true;
        this.endHandPlayFlightHiddenMeshes(hiddenForThisFlight);
        this.discardVisualFreezePlayerId = null;
        flight.board3dCard.dispose();
        this.interactionService.updateInteractiveObjects(this.scene);
        this.syncGameState();
        this.markDirty();
      };

      void this.gameActions
        .playCardAction(this.gameState.gameId, result.handIndex, playTarget)
        .catch(() => {
          gsap.killTweensOf(group.position);
          gsap.killTweensOf(group.rotation);
          gsap.killTweensOf(group.scale);
          group.removeFromParent();
          this.endHandPlayFlightHiddenMeshes(hiddenForThisFlight);
          this.discardVisualFreezePlayerId = null;
          if (!flightDisposed) {
            flightDisposed = true;
            flight.board3dCard.dispose();
          }
          this.interactionService.updateInteractiveObjects(this.scene);
          this.syncGameState();
          this.forceHandResyncAfterFailedPlay();
          this.markDirty();
        });

      void this.animationService
        .playHandCardDropOnBoard(group, flight.targetWorld, {
          endScale: flight.endScale,
          endRotationY: flight.endRotationY
        })
        .then(() => disposeFlight());
    } else {
      void this.gameActions
        .playCardAction(this.gameState.gameId, result.handIndex, playTarget)
        .catch(() => this.forceHandResyncAfterFailedPlay());
    }
  };

  private onMouseLeave = (): void => {
    this.interactionService.cancelDrag();
    this.currentHoveredCard = null;
    this.flushPendingHandSyncAfterDrag();
    this.markDirty();
  };

  /** Right-click (or Ctrl+click on macOS) opens the card info pane. */
  private onContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
    const canvas = this.canvasEl;
    const card = this.interactionService.onMouseMove(
      event,
      this.camera,
      this.scene,
      canvas,
    );
    if (card) {
      this.onCardClicked(card);
    }
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

  private refreshPutDamagePlacementOverlays(): void {
    this.stateSync.refreshPutDamagePlacementOverlays(this.boardInteractionService);
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
      if (this.boardInteractionService.isSelectionActive()) {
        const hostTarget = this.resolveBoardPokemonCardTargetFromObject(cardObject);
        if (hostTarget !== null && this.boardInteractionService.isTargetEligible(hostTarget)) {
          this.boardInteractionService.toggleTarget(hostTarget);
          return;
        }
      }
      this.cardsAdapter.showCardInfo({
        card: cardData,
        cardList,
        players: [this.topPlayer, this.bottomPlayer].filter(p => p)
      });
      return;
    }

    // Handle tool card click (show tool card info)
    if (isToolCard && cardData && cardList) {
      if (this.boardInteractionService.isSelectionActive()) {
        const hostTarget = this.resolveBoardPokemonCardTargetFromObject(cardObject);
        if (hostTarget !== null && this.boardInteractionService.isTargetEligible(hostTarget)) {
          this.boardInteractionService.toggleTarget(hostTarget);
          return;
        }
      }
      this.cardsAdapter.showCardInfo({
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
        this.cardsAdapter.showCardInfoList({
          card: cardData,
          cardList: cardList,
          players: [this.topPlayer, this.bottomPlayer].filter(p => p)
        });
        return;
      }

      const slot = SlotType.LOSTZONE;
      const options = { enableAbility: { useFromDiscard: false }, enableAttack: false };

      this.cardsAdapter.showCardInfoList({
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
        this.cardsAdapter.showCardInfoList({
          card: cardData,
          cardList: cardList,
          players: [this.topPlayer, this.bottomPlayer].filter(p => p)
        });
        return;
      }

      const slot = SlotType.DISCARD;
      const options = { enableAbility: { useFromDiscard: true }, enableAttack: false };

      this.cardsAdapter.showCardInfoList({
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
            this.gameActions.trainerAbility(gameId, result.ability, target);
          } else if (result.card.superType === SuperType.ENERGY) {
            this.gameActions.energyAbility(gameId, result.ability, target);
          } else {
            this.gameActions.ability(gameId, result.ability, target);
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
        const sandboxMode = this.gameState.state.gameSettings?.sandboxMode === true;
        const facedown = !sandboxMode;
        const allowReveal = !sandboxMode && !!this.gameState.replay;
        this.cardsAdapter.showCardInfoList({
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
      this.cardsAdapter.showCardInfo({
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
        this.cardsAdapter.showCardInfo({
          card: cardData,
          cardList: cardList,
          players: [this.topPlayer, this.bottomPlayer].filter(p => p)
        });
        return;
      }

      // Owner can activate stadium effect
      const options = { enableTrainer: true };
      this.cardsAdapter.showCardInfo({
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
          this.gameActions.stadium(this.gameState.gameId);
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

    this.cardsAdapter.showCardInfo({
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
        if (cardData.superType === SuperType.TRAINER) {
          this.gameActions.trainerAbility(gameId, result.ability, target);
        } else {
          this.gameActions.ability(gameId, result.ability, target);
        }
      } else if (result.attack) {
        this.gameActions.attack(gameId, result.attack);
      } else if (result.retreat) {
        if (!canRetreat) return;
        this.gameActions.retreatStart(gameId);
      }
    });
  }
}
