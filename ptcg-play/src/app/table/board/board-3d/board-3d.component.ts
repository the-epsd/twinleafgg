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
  Vector2
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
import { Player, CardList } from 'ptcg-server';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { GameService } from '../../../api/services/game.service';

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
  private edgeGlow!: Board3dEdgeGlow;

  private animationFrameId: number = 0;
  private needsRender: boolean = true;
  private currentHoveredCard: any = null;
  private hasInitializedHand: boolean = false;

  constructor(
    private ngZone: NgZone,
    private assetLoader: Board3dAssetLoaderService,
    private stateSync: Board3dStateSyncService,
    private animationService: Board3dAnimationService,
    private interactionService: Board3dInteractionService,
    private handService: Board3dHandService,
    private cardsBaseService: CardsBaseService,
    private gameService: GameService
  ) { }

  ngOnInit(): void {
    // Initialize scene components
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.createBoard();
    this.createGlowingEdges();
    this.initPostProcessing();

    // Initialize hand service
    this.scene.add(this.handService.getHandGroup());

    // Create drop zone indicators
    this.interactionService.createDropZoneIndicators(this.scene);

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
  }

  ngOnChanges(changes: SimpleChanges): void {
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
    // Start render loop outside Angular zone
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });

    // Add event listeners
    this.addEventListeners();

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  ngOnDestroy(): void {
    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Kill any active animations
    this.animationService.killAllAnimations();

    // Clean up resources
    this.disposeScene();
    this.renderer?.dispose();
    this.composer?.dispose();

    // Remove event listeners
    this.removeEventListeners();
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  private initScene(): void {
    this.scene = new Scene();
  }

  private initCamera(): void {
    const canvas = this.canvasRef.nativeElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;

    this.camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 25, 40);
    this.camera.lookAt(0, -7, 0);  // Look higher up to show board in upper portion
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
    this.ambientLight = new AmbientLight(0xffffff, 0.3);
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

  private createBoard(): void {
    // Create board surface geometry
    const boardGeometry = new PlaneGeometry(50, 50);

    // Board material with sandy/beige color
    const boardMaterial = new MeshStandardMaterial({
      color: 0xd4c5a9,
      roughness: 1,
      metalness: 0.00
    });

    this.boardMesh = new Mesh(boardGeometry, boardMaterial);
    this.boardMesh.rotation.x = -Math.PI / 2; // Make it horizontal
    this.boardMesh.receiveShadow = false;
    this.scene.add(this.boardMesh);
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

    // Render if scene changed or animations are active
    if (this.needsRender || this.animationService.hasActiveAnimations()) {
      this.composer.render();
      this.needsRender = false;
    }
  };

  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;

    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.composer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Adjust camera for narrow screens
    if (aspect < 1.5) {
      this.camera.position.y = 30;
      this.camera.position.z = 50;
    } else {
      this.camera.position.y = 25;
      this.camera.position.z = 40;
    }

    this.camera.lookAt(0, 8, 0);  // Look higher up to show board in upper portion
    this.markDirty();
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

  private syncGameState(): void {
    // Run state sync outside Angular zone for better performance
    this.ngZone.runOutsideAngular(async () => {
      try {
        await this.stateSync.syncState(
          this.gameState,
          this.scene,
          this.clientId
        );
        this.markDirty();
      } catch (error) {
        console.error('Failed to sync 3D board state:', error);
      }
    });
  }

  private syncHand(): void {
    console.log('[Board3D] syncHand() called:', {
      hasBottomPlayerHand: !!this.bottomPlayerHand,
      hasBottomPlayer: !!this.bottomPlayer,
      handSize: this.bottomPlayerHand?.cards?.length,
      bottomPlayerId: this.bottomPlayer?.id,
      clientId: this.clientId
    });

    if (!this.bottomPlayerHand || !this.bottomPlayer) {
      console.log('[Board3D] syncHand() aborted - missing data');
      return;
    }

    this.ngZone.runOutsideAngular(async () => {
      try {
        const isOwner = this.bottomPlayer.id === this.clientId;
        console.log('[Board3D] Calling handService.updateHand:', {
          isOwner,
          handSize: this.bottomPlayerHand.cards.length
        });

        await this.handService.updateHand(
          this.bottomPlayerHand,
          isOwner,
          this.scene
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

      if (this.interactionService.getIsDragging()) {
        // Dragging
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
          if (this.currentHoveredCard) {
            this.animationService.unhoverCard(this.currentHoveredCard);
          }
          if (hoveredCard) {
            this.animationService.hoverCard(hoveredCard);
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
        // Card dropped on valid zone - send play action
        this.gameService.playCardAction(
          this.gameState.gameId,
          result.handIndex,
          result.zone
        );

        // Remove card from hand visually (will re-sync on state update)
        this.handService.removeCard(result.handIndex);
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
}
