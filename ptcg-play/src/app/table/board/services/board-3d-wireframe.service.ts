import { Injectable } from '@angular/core';
import { Scene, Group, Mesh, EdgesGeometry, LineSegments, LineBasicMaterial, Object3D } from 'three';

@Injectable()
export class Board3dWireframeService {
  private wireframeGroup: Group;
  private wireframeCache: Map<Object3D, LineSegments> = new Map(); // Cache wireframes by original mesh

  constructor() {
    this.wireframeGroup = new Group();
    this.wireframeGroup.name = 'wireframeOverlay';
  }

  /**
   * Initialize wireframe group in scene
   */
  initialize(scene: Scene): void {
    if (!scene.children.includes(this.wireframeGroup)) {
      scene.add(this.wireframeGroup);
    }
  }

  /**
   * Create wireframes for all meshes in the scene
   * Uses cached references to avoid expensive traversals
   */
  createWireframes(scene: Scene): void {
    // Clear any existing wireframes first
    this.removeWireframes(scene);

    // Traverse the scene and create wireframes for all meshes
    scene.traverse((object: any) => {
      // Skip the wireframe group itself
      if (object === this.wireframeGroup) {
        return;
      }
      
      // Create wireframes for all meshes with geometry
      if (object instanceof Mesh && object.geometry) {
        // Check cache first
        if (this.wireframeCache.has(object)) {
          const cachedWireframe = this.wireframeCache.get(object)!;
          if (cachedWireframe.parent) {
            // Wireframe already exists and is in scene
            return;
          }
        }

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
          
          // Cache the wireframe
          this.wireframeCache.set(object, wireframe);
        } catch (error) {
          // Skip geometries that can't create edges (e.g., some custom geometries)
          console.warn('Failed to create wireframe for mesh:', object, error);
        }
      }
    });
  }

  /**
   * Remove all wireframes from the scene
   * Uses cached references for faster cleanup
   */
  removeWireframes(scene: Scene): void {
    // Use cached wireframes for faster removal
    const wireframesToRemove: LineSegments[] = Array.from(this.wireframeCache.values());

    // Also check wireframeGroup children
    const groupChildren = [...this.wireframeGroup.children] as LineSegments[];
    groupChildren.forEach(wireframe => {
      if (wireframe instanceof LineSegments && !wireframesToRemove.includes(wireframe)) {
        wireframesToRemove.push(wireframe);
      }
    });

    // Dispose and remove all wireframes
    wireframesToRemove.forEach((wireframe) => {
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

      // Remove from cache
      const originalMesh = wireframe.userData.originalMesh;
      if (originalMesh) {
        this.wireframeCache.delete(originalMesh);
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

    // Clear cache
    this.wireframeCache.clear();
  }

  /**
   * Get wireframe group
   */
  getWireframeGroup(): Group {
    return this.wireframeGroup;
  }

  /**
   * Dispose of all resources
   */
  dispose(scene: Scene): void {
    this.removeWireframes(scene);
    if (scene.children.includes(this.wireframeGroup)) {
      scene.remove(this.wireframeGroup);
    }
  }
}
