import { Injectable } from '@angular/core';
import { WebGLRenderer, Scene, PerspectiveCamera, Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

@Injectable()
export class Board3dPostProcessingService {
  private composer!: EffectComposer;

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

    // Add render pass
    const renderPass = new RenderPass(scene, camera);
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

  /**
   * Render the post-processed scene
   */
  render(): void {
    if (this.composer) {
      this.composer.render();
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
