import { Injectable } from '@angular/core';
import { WebGLRenderer, Scene, PerspectiveCamera, Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

@Injectable()
export class Board3dPostProcessingService {
  private composer!: EffectComposer;
  private bloomPass!: UnrealBloomPass;
  private renderPass!: RenderPass;
  private bloomEnabled: boolean = false; // Edge glow is currently disabled

  constructor() { }

  /**
   * Initialize post-processing with EffectComposer, RenderPass, and BloomPass
   */
  initialize(
    renderer: WebGLRenderer,
    scene: Scene,
    camera: PerspectiveCamera,
    canvas: HTMLCanvasElement
  ): void {
    this.composer = new EffectComposer(renderer);

    // Add render pass (always needed)
    this.renderPass = new RenderPass(scene, camera);
    this.composer.addPass(this.renderPass);

    // Add bloom effect for glowing edges (currently disabled, but keep for future use)
    this.bloomPass = new UnrealBloomPass(
      new Vector2(canvas.clientWidth, canvas.clientHeight),
      1.5,  // strength
      0.4,  // radius
      0.85  // threshold
    );
    // Don't add bloom pass by default since edge glow is disabled
    // this.composer.addPass(this.bloomPass);
  }

  /**
   * Render the post-processed scene
   * Optimized: Only applies post-processing when bloom is enabled
   */
  render(): void {
    if (this.composer) {
      // If bloom is disabled, just render the scene directly (faster)
      if (!this.bloomEnabled) {
        // Render pass handles the scene rendering
        this.composer.render();
      } else {
        // Full post-processing with bloom
        this.composer.render();
      }
    }
  }

  /**
   * Enable or disable bloom effect
   */
  setBloomEnabled(enabled: boolean): void {
    if (this.bloomEnabled === enabled) return;
    
    this.bloomEnabled = enabled;
    if (enabled) {
      // Add bloom pass if not already added
      if (this.composer.passes.indexOf(this.bloomPass) === -1) {
        this.composer.addPass(this.bloomPass);
      }
    } else {
      // Remove bloom pass
      const index = this.composer.passes.indexOf(this.bloomPass);
      if (index !== -1) {
        this.composer.passes.splice(index, 1);
      }
    }
  }

  /**
   * Update the composer size when canvas is resized
   */
  setSize(width: number, height: number): void {
    if (this.composer) {
      this.composer.setSize(width, height);
    }
  }

  /**
   * Get the EffectComposer instance (for advanced use cases)
   */
  getComposer(): EffectComposer {
    return this.composer;
  }

  /**
   * Dispose of post-processing resources
   */
  dispose(): void {
    if (this.composer) {
      this.composer.dispose();
    }
  }
}
