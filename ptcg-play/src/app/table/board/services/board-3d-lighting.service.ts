import { Injectable } from '@angular/core';
import { Scene, AmbientLight, DirectionalLight, HemisphereLight, SpotLight } from 'three';

@Injectable()
export class Board3dLightingService {
  private ambientLight!: AmbientLight;
  private mainLight!: DirectionalLight;
  private hemisphereLight!: HemisphereLight;
  private bottomGlow!: SpotLight;
  private topGlow!: SpotLight;

  constructor() { }

  /**
   * Initialize all lights and add them to the scene
   */
  initialize(scene: Scene): void {
    // Ambient base light
    this.ambientLight = new AmbientLight(0xffffff, 1);
    scene.add(this.ambientLight);

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

    scene.add(this.mainLight);

    // Hemisphere light for subtle sky/ground color difference
    this.hemisphereLight = new HemisphereLight(0xddeeff, 0x333333, 0.3);
    scene.add(this.hemisphereLight);

    // Blue spotlight for active bottom player zone
    this.bottomGlow = new SpotLight(0x0052ff, 2.0);
    this.bottomGlow.position.set(0, 15, 15);
    this.bottomGlow.angle = Math.PI / 5;
    this.bottomGlow.penumbra = 0.3;
    this.bottomGlow.castShadow = false;
    scene.add(this.bottomGlow);

    // Red spotlight for top player zone
    this.topGlow = new SpotLight(0xff3333, 2.0);
    this.topGlow.position.set(0, 15, -15);
    this.topGlow.angle = Math.PI / 5;
    this.topGlow.penumbra = 0.3;
    this.topGlow.castShadow = false;
    scene.add(this.topGlow);
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

    if (this.hemisphereLight && scene.children.includes(this.hemisphereLight)) {
      scene.remove(this.hemisphereLight);
      this.hemisphereLight.dispose();
    }

    if (this.bottomGlow && scene.children.includes(this.bottomGlow)) {
      scene.remove(this.bottomGlow);
      this.bottomGlow.dispose();
    }

    if (this.topGlow && scene.children.includes(this.topGlow)) {
      scene.remove(this.topGlow);
      this.topGlow.dispose();
    }
  }
}
