import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { Scene, WebGLRenderer } from 'three';
import { NgZone } from '@angular/core';

export interface Board3dStats {
  fps: number;
  triangles: number;
  drawCalls: number;
  objectCount: number;
  geometries: number;
  textures: number;
}

@Component({
  selector: 'ptcg-board-3d-stats',
  templateUrl: './board-3d-stats.component.html',
  styleUrls: ['./board-3d-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Board3dStatsComponent implements OnInit, OnDestroy {
  @Input() scene!: Scene;
  @Input() renderer!: WebGLRenderer;
  @Output() wireframeToggle = new EventEmitter<boolean>();

  public stats: Board3dStats = {
    fps: 0,
    triangles: 0,
    drawCalls: 0,
    objectCount: 0,
    geometries: 0,
    textures: 0
  };

  public showWireframes: boolean = false;

  private frameTimes: number[] = [];
  private lastFrameTime: number = 0;
  private lastStatsUpdate: number = 0;
  private statsUpdateInterval: number = 2500; // Update every 2.5 seconds
  private lastStatsCollection: number = 0;
  private animationFrameId: number = 0;
  private isDestroyed: boolean = false;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.scene || !this.renderer) {
      console.warn('Board3dStatsComponent: scene or renderer not provided');
      return;
    }

    this.lastFrameTime = performance.now();
    this.lastStatsUpdate = performance.now();
    this.lastStatsCollection = performance.now();

    // Start stats collection outside Angular zone
    this.ngZone.runOutsideAngular(() => {
      this.collectStats();
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private collectStats(): void {
    if (this.isDestroyed) return;

    this.animationFrameId = requestAnimationFrame(() => this.collectStats());

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Store frame time (limit to last 60 frames for averaging)
    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }

    // Only collect expensive stats when needed (every 2.5 seconds)
    if (currentTime - this.lastStatsCollection >= this.statsUpdateInterval) {
      // Read renderer statistics immediately after rendering (before auto-reset)
      const renderInfo = this.renderer.info.render;
      const memoryInfo = this.renderer.info.memory;

      // Count objects in scene (only when stats update, not every frame)
      let objectCount = 0;
      this.scene.traverse(() => {
        objectCount++;
      });

      // Calculate FPS
      const averageFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      const calculatedFps = Math.round(1000 / averageFrameTime);

      // Update stats
      const newStats: Board3dStats = {
        fps: calculatedFps,
        triangles: renderInfo.triangles || 0,
        drawCalls: renderInfo.calls || 0,
        objectCount: objectCount,
        geometries: memoryInfo.geometries || 0,
        textures: memoryInfo.textures || 0
      };

      // Update display every 2.5 seconds (less frequent)
      if (currentTime - this.lastStatsUpdate >= this.statsUpdateInterval) {
        this.ngZone.run(() => {
          this.stats = newStats;
          this.cdr.markForCheck();
        });
        this.lastStatsUpdate = currentTime;
      }

      this.lastStatsCollection = currentTime;
    }
  }

  toggleWireframes(): void {
    this.wireframeToggle.emit(this.showWireframes);
  }
}
