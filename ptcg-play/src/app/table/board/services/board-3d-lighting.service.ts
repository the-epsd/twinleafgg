import { Injectable } from '@angular/core';
import { Scene, AmbientLight, DirectionalLight } from 'three';

@Injectable()
export class Board3dLightingService {
  private ambientLight!: AmbientLight;
  private mainLight!: DirectionalLight;

  constructor() { }

  /**
   * Initialize all lights and add them to the scene
   */
  initialize(scene: Scene): void {
    // Ambient base light
    this.ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(this.ambientLight);

    // Main directional light with shadows
    this.mainLight = new DirectionalLight(0xffffff, 1.0);
    this.mainLight.position.set(5, 20, 10);
    this.mainLight.castShadow = true;

    // Shadow camera configuration
    this.mainLight.shadow.mapSize.width = 512;
    this.mainLight.shadow.mapSize.height = 512;
    this.mainLight.shadow.camera.left = -30;
    this.mainLight.shadow.camera.right = 30;
    this.mainLight.shadow.camera.top = 30;
    this.mainLight.shadow.camera.bottom = -30;
    this.mainLight.shadow.camera.near = 0.5;
    this.mainLight.shadow.camera.far = 50;
    this.mainLight.shadow.bias = -0.0001;

    scene.add(this.mainLight);
  }

  /**
   * Get the main directional light (useful for other services that need shadow configuration)
   */
  getMainLight(): DirectionalLight {
    return this.mainLight;
  }

  /**
   * Dispose of all lights and remove them from the scene
   */
  dispose(scene: Scene): void {
    if (this.ambientLight && scene.children.includes(this.ambientLight)) {
      scene.remove(this.ambientLight);
      this.ambientLight.dispose();
    }

    if (this.mainLight && scene.children.includes(this.mainLight)) {
      scene.remove(this.mainLight);
      this.mainLight.dispose();
    }
  }
}
