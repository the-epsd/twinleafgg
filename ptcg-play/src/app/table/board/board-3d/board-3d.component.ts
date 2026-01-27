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
  AmbientLight,
  DirectionalLight,
  SpotLight,
  HemisphereLight,
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  PCFSoftShadowMap,
  sRGBEncoding,
  ACESFilmicToneMapping,
  Vector3,
  Vector2,
  RepeatWrapping,
  Group,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Board3dEdgeGlow } from './board-3d-edge-glow';
import { Board3dAssetLoaderService } from '../services/board-3d-asset-loader.service';
import { Board3dStateSyncService } from '../services/board-3d-state-sync.service';
import { Board3dAnimationService } from '../services/board-3d-animation.service';
import { Board3dInteractionService } from '../services/board-3d-interaction.service';
import { Board3dHandService } from '../services/board-3d-hand.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { Player, CardList, Card, SlotType, PlayerType, CardTarget, SuperType } from 'ptcg-server';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { CardInfoPaneOptions } from '../../../shared/cards/card-info-pane/card-info-pane.component';
import { GameService } from '../../../api/services/game.service';
import { BasicEntranceAnimationEvent, BoardInteractionService } from '../../../shared/services/board-interaction.service';
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

  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private composer!: EffectComposer;

  // Lights
  private ambientLight!: AmbientLight;
  private mainLight!: DirectionalLight;
  private hemisphereLight!: HemisphereLight;
  private bottomGlow!: SpotLight;
  private topGlow!: SpotLight;

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

  // FPS tracking
  public fps: number = 0;
  private frameCount: number = 0;
  private lastFpsUpdate: number = 0;
  private frameTimes: number[] = [];
  private lastFrameTime: number = 0;

  // Diagnostic stats
  public triangles: number = 0;
  public drawCalls: number = 0;
  public objectCount: number = 0;
  public geometries: number = 0;
  public textures: number = 0;
  private lastStats: {
    triangles: number;
    drawCalls: number;
    objectCount: number;
    geometries: number;
    textures: number;
  } = { triangles: 0, drawCalls: 0, objectCount: 0, geometries: 0, textures: 0 };

  // Wireframe overlay
  public showWireframes: boolean = false;
  private wireframeGroup!: Group;

  constructor(
    private ngZone: NgZone,
    private assetLoader: Board3dAssetLoaderService,
    private stateSync: Board3dStateSyncService,
    private animationService: Board3dAnimationService,
    private interactionService: Board3dInteractionService,
    private handService: Board3dHandService,
    private cardsBaseService: CardsBaseService,
    private gameService: GameService,
    private boardInteractionService: BoardInteractionService
  ) { }

  ngOnInit(): void {
    // Initialize scene components
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.createBoardAsync();
    this.createGlowingEdges();
    this.initPostProcessing();

    // Initialize wireframe group
    this.wireframeGroup = new Group();
    this.wireframeGroup.name = 'wireframeOverlay';
    this.scene.add(this.wireframeGroup);

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
      console.log('[Board3D] Hand data available at init, syncing:', {
        handSize: this.bottomPlayerHand.cards?.length,
        bottomPlayerId: this.bottomPlayer?.id,
        clientId: this.clientId
      });
      this.syncHand();
      this.hasInitializedHand = true;
    } else {
      console.log('[Board3D] Hand data NOT available at init, will sync on first change');
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

    // Subscribe to attack animation events
    this.boardInteractionService.attackAnimation$.pipe(
      untilDestroyed(this)
    ).subscribe((event) => {
      this.handleAttackAnimation(event);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update perspective when player assignment changes
    if ((changes.topPlayer || changes.bottomPlayer || changes.clientId) && this.camera) {
      this.updatePerspective();
    }

    // Sync game state when it changes
    if (changes.gameState && !changes.gameState.firstChange && this.scene) {
      this.syncGameState();
    }

    // Sync hand when it changes
    if (changes.bottomPlayerHand && this.scene) {
      const isFirstChange = changes.bottomPlayerHand.firstChange;
      const shouldSync = !isFirstChange || (isFirstChange && !this.hasInitializedHand);

      console.log('[Board3D] Hand change detected:', {
        isFirstChange,
        hasInitializedHand: this.hasInitializedHand,
        shouldSync,
        handSize: this.bottomPlayerHand?.cards?.length,
        previousHandSize: changes.bottomPlayerHand.previousValue?.cards?.length
      });

      if (shouldSync) {
        this.syncHand();
        if (isFirstChange) {
          this.hasInitializedHand = true;
        }
      }
    }
  }

  ngAfterViewInit(): void {
    // Initialize FPS tracking
    this.lastFrameTime = performance.now();
    this.lastFpsUpdate = performance.now();

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
    this.removeWireframes();
    if (this.wireframeGroup) {
      this.scene.remove(this.wireframeGroup);
    }

    // Clean up service state to prevent stale references on mode switch
    this.stateSync.dispose(this.scene);
    this.handService.dispose(this.scene);
    this.interactionService.dispose(this.scene);

    // Clean up resources
    this.disposeScene();
    this.renderer?.dispose();
    this.composer?.dispose();

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

    this.camera = new PerspectiveCamera(37.5, aspect, 0.1, 2000);
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
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  private initLights(): void {
    // Ambient base light
    this.ambientLight = new AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);

    // Main directional light with shadows
    this.mainLight = new DirectionalLight(0xffffff, 0.6);
    this.mainLight.position.set(5, 20, 10);
    this.mainLight.castShadow = true;

    // Shadow camera configuration
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;
    this.mainLight.shadow.camera.left = -30;
    this.mainLight.shadow.camera.right = 30;
    this.mainLight.shadow.camera.top = 30;
    this.mainLight.shadow.camera.bottom = -30;
    this.mainLight.shadow.camera.near = 0.5;
    this.mainLight.shadow.camera.far = 50;
    this.mainLight.shadow.bias = -0.0001;

    this.scene.add(this.mainLight);

    // Hemisphere light for subtle sky/ground color difference
    this.hemisphereLight = new HemisphereLight(0xddeeff, 0x333333, 0.3);
    this.scene.add(this.hemisphereLight);

    // Blue spotlight for active bottom player zone
    this.bottomGlow = new SpotLight(0x0052ff, 2.0);
    this.bottomGlow.position.set(0, 15, 15);
    this.bottomGlow.angle = Math.PI / 5;
    this.bottomGlow.penumbra = 0.3;
    this.bottomGlow.castShadow = false;
    this.scene.add(this.bottomGlow);

    // Red spotlight for top player zone
    this.topGlow = new SpotLight(0xff3333, 2.0);
    this.topGlow.position.set(0, 15, -15);
    this.topGlow.angle = Math.PI / 5;
    this.topGlow.penumbra = 0.3;
    this.topGlow.castShadow = false;
    this.scene.add(this.topGlow);
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
      depthWrite: false // Prevent z-fighting with board texture
    });

    this.boardCenterOverlay = new Mesh(centerGeometry, centerMaterial);
    this.boardCenterOverlay.rotation.x = -Math.PI / 2; // Make it horizontal
    this.boardCenterOverlay.rotation.z = Math.PI; // Rotate 180 degrees
    // Mirror horizontally by scaling X axis negatively
    this.boardCenterOverlay.scale.x = -1;
    // Move down 2 units and increase offset to prevent z-fighting
    this.boardCenterOverlay.position.z = 14.1; // Board is at z=12, so 14.1 = 2 units down + 0.1 offset
    this.boardCenterOverlay.receiveShadow = false;
    this.scene.add(this.boardCenterOverlay);

    this.markDirty();
  }

  private createGlowingEdges(): void {
    this.edgeGlow = new Board3dEdgeGlow(this.scene);
  }

  private initPostProcessing(): void {
    const canvas = this.canvasRef.nativeElement;

    this.composer = new EffectComposer(this.renderer);

    // Add render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Add bloom effect for glowing edges
    const bloomPass = new UnrealBloomPass(
      new Vector2(canvas.clientWidth, canvas.clientHeight),
      1.5,  // strength
      0.4,  // radius
      0.85  // threshold
    );

    this.composer.addPass(bloomPass);
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Calculate FPS
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Store frame time (limit to last 60 frames for averaging)
    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }

    // Render if scene changed or animations are active
    const didRender = this.needsRender || this.animationService.hasActiveAnimations();
    if (didRender) {
      this.composer.render();
      this.needsRender = false;

      // Read renderer statistics immediately after rendering (before auto-reset)
      const renderInfo = this.renderer.info.render;
      const memoryInfo = this.renderer.info.memory;

      // Count objects in scene
      let objectCount = 0;
      this.scene.traverse(() => {
        objectCount++;
      });

      // Store stats for display update
      this.lastStats = {
        triangles: renderInfo.triangles || 0,
        drawCalls: renderInfo.calls || 0,
        objectCount: objectCount,
        geometries: memoryInfo.geometries || 0,
        textures: memoryInfo.textures || 0
      };
    }

    // Update FPS and diagnostic stats display every second
    if (currentTime - this.lastFpsUpdate >= 1000) {
      const averageFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      const calculatedFps = Math.round(1000 / averageFrameTime);

      // Update all stats (run in Angular zone for change detection)
      this.ngZone.run(() => {
        this.fps = calculatedFps;
        this.triangles = this.lastStats.triangles;
        this.drawCalls = this.lastStats.drawCalls;
        this.objectCount = this.lastStats.objectCount;
        this.geometries = this.lastStats.geometries;
        this.textures = this.lastStats.textures;
      });

      this.lastFpsUpdate = currentTime;
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
    this.composer.setSize(width, height);

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
      this.camera.position.set(0, 40, 35 * zMultiplier);
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
    this.needsRender = true;
  }

  public toggleWireframes(): void {
    if (this.showWireframes) {
      this.createWireframes();
    } else {
      this.removeWireframes();
    }
    this.markDirty();
  }

  private createWireframes(): void {
    // Clear any existing wireframes first
    this.removeWireframes();

    // Traverse the scene and create wireframes for all meshes
    this.scene.traverse((object: any) => {
      // Skip the wireframe group itself
      if (object === this.wireframeGroup) {
        return;
      }
      
      // Create wireframes for all meshes with geometry
      if (object instanceof Mesh && object.geometry) {
        try {
          // Create edges geometry with threshold angle (15 degrees)
          const edgesGeometry = new EdgesGeometry(object.geometry, 15);
          
          // Create line material with bright color for visibility
          const lineMaterial = new LineBasicMaterial({
            color: 0x00ffff, // Cyan color
            linewidth: 1
          });

          // Create line segments
          const wireframe = new LineSegments(edgesGeometry, lineMaterial);
          
          // Copy position, rotation, and scale from original mesh
          wireframe.position.copy(object.position);
          wireframe.rotation.copy(object.rotation);
          wireframe.scale.copy(object.scale);
          
          // Set render order to ensure wireframes render on top
          wireframe.renderOrder = 1000;
          
          // Store reference to original mesh for tracking and cleanup
          wireframe.userData.originalMesh = object;
          wireframe.userData.isWireframe = true;
          
          // Add wireframe to the same parent as the original mesh
          // This ensures wireframes follow the same transform hierarchy
          if (object.parent) {
            object.parent.add(wireframe);
          } else {
            this.wireframeGroup.add(wireframe);
          }
          
          // Also add to wireframeGroup for easier tracking and cleanup
          // (but don't add as child, just track it)
          if (!this.wireframeGroup.children.includes(wireframe)) {
            // Store reference in wireframeGroup's userData for tracking
            if (!this.wireframeGroup.userData.wireframes) {
              this.wireframeGroup.userData.wireframes = [];
            }
            this.wireframeGroup.userData.wireframes.push(wireframe);
          }
        } catch (error) {
          // Skip geometries that can't create edges (e.g., some custom geometries)
          console.warn('Failed to create wireframe for mesh:', object, error);
        }
      }
    });
  }

  private removeWireframes(): void {
    // Remove all wireframes from the scene
    const objectsToRemove: LineSegments[] = [];
    
    // Find all wireframes by traversing the scene
    this.scene.traverse((object: any) => {
      if (object instanceof LineSegments && object.userData.isWireframe) {
        objectsToRemove.push(object);
      }
    });

    // Also check wireframeGroup's tracked wireframes
    if (this.wireframeGroup.userData.wireframes) {
      this.wireframeGroup.userData.wireframes.forEach((wireframe: LineSegments) => {
        if (!objectsToRemove.includes(wireframe)) {
          objectsToRemove.push(wireframe);
        }
      });
    }

    // Dispose and remove all wireframes
    objectsToRemove.forEach((wireframe) => {
      // Dispose geometry and material
      if (wireframe.geometry) {
        wireframe.geometry.dispose();
      }
      if (wireframe.material) {
        (wireframe.material as LineBasicMaterial).dispose();
      }
      
      // Remove from parent
      if (wireframe.parent) {
        wireframe.parent.remove(wireframe);
      }
    });

    // Clear wireframe group children
    while (this.wireframeGroup.children.length > 0) {
      const child = this.wireframeGroup.children[0];
      if (child instanceof LineSegments) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          (child.material as LineBasicMaterial).dispose();
        }
      }
      this.wireframeGroup.remove(child);
    }

    // Clear tracked wireframes
    if (this.wireframeGroup.userData.wireframes) {
      this.wireframeGroup.userData.wireframes = [];
    }
  }

  private syncGameState(): void {
    // Run state sync outside Angular zone for better performance
    this.ngZone.runOutsideAngular(async () => {
      try {
        await this.stateSync.syncState(
          this.gameState,
          this.scene,
          this.clientId
        );

        // Update drop zone occupied states
        this.updateDropZoneOccupancy();

        // Update drop zones if bench size changed
        this.updateDropZonesForBenchSize();

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
    console.log('[Board3D] syncHand() called:', {
      hasBottomPlayerHand: !!this.bottomPlayerHand,
      hasBottomPlayer: !!this.bottomPlayer,
      handSize: this.bottomPlayerHand?.cards?.length,
      bottomPlayerId: this.bottomPlayer?.id,
      clientId: this.clientId
    });

    // Skip sync if user is currently dragging a card to prevent destroying the dragged card
    if (this.interactionService.getIsDragging()) {
      console.log('[Board3D] Skipping hand sync - drag in progress');
      return;
    }

    if (!this.bottomPlayerHand || !this.bottomPlayer) {
      console.log('[Board3D] syncHand() aborted - missing data');
      return;
    }

    // Ensure handService is ready (handGroup exists and is in scene)
    const handGroup = this.handService.getHandGroup();
    if (!handGroup || !this.scene.children.includes(handGroup)) {
      console.log('[Board3D] Hand group not in scene, adding it');
      this.scene.add(handGroup);
    }

    this.ngZone.runOutsideAngular(async () => {
      try {
        const isOwner = this.bottomPlayer.id === this.clientId;
        const playableCardIds = this.bottomPlayer.playableCardIds;
        console.log('[Board3D] Calling handService.updateHand:', {
          isOwner,
          handSize: this.bottomPlayerHand.cards.length,
          playableCount: playableCardIds?.length ?? 0
        });

        await this.handService.updateHand(
          this.bottomPlayerHand,
          isOwner,
          this.scene,
          playableCardIds
        );

        console.log('[Board3D] Hand sync completed successfully');
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
   * Handle attack animation event
   */
  private handleAttackAnimation(event: BasicEntranceAnimationEvent): void {
    // Determine attacker position based on playerId
    const isBottomPlayer = this.bottomPlayer?.id === event.playerId;
    const isTopPlayer = this.topPlayer?.id === event.playerId;

    if (!isBottomPlayer && !isTopPlayer) {
      // Player not found, skip animation
      return;
    }

    const attackerPosition = isBottomPlayer ? 'bottomPlayer' : 'topPlayer';
    const defenderPosition = isBottomPlayer ? 'topPlayer' : 'bottomPlayer';

    // Construct attacker card ID
    // Active cards: ${position}_${playerId}_active (no index)
    // Bench cards: ${position}_${playerId}_bench_${index} (with index)
    const slot = event.slot || 'active';
    const index = event.index ?? 0;
    const attackerCardId = slot === 'active'
      ? `${attackerPosition}_${event.playerId}_active`
      : `${attackerPosition}_${event.playerId}_bench_${index}`;

    // Construct defender card ID (always opponent's active Pokemon - no index)
    const defenderPlayerId = isBottomPlayer ? this.topPlayer?.id : this.bottomPlayer?.id;
    if (!defenderPlayerId) {
      // No opponent found, skip animation
      return;
    }
    const defenderCardId = `${defenderPosition}_${defenderPlayerId}_active`;

    // Get attacker and defender cards
    const attackerCard = this.stateSync.getCardById(attackerCardId);
    const defenderCard = this.stateSync.getCardById(defenderCardId);

    // Debug logging
    console.log('[Board3D] Attack animation event:', {
      event,
      attackerCardId,
      defenderCardId,
      attackerFound: !!attackerCard,
      defenderFound: !!defenderCard
    });

    // Only animate if both cards exist
    if (attackerCard && defenderCard) {
      this.animationService.attackAnimation(
        attackerCard.getGroup(),
        defenderCard.getGroup()
      );
    } else {
      console.warn('[Board3D] Attack animation skipped - cards not found:', {
        attackerCardId,
        defenderCardId,
        attackerFound: !!attackerCard,
        defenderFound: !!defenderCard
      });
    }
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
    const isDeck = cardObject.userData.isDeck;
    const isPrize = cardObject.userData.isPrize;

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
