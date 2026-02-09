import {
  BoxGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Mesh,
  Texture,
  Group,
  DoubleSide,
  Vector3
} from 'three';

// Outline border thickness (in card units)
const OUTLINE_THICKNESS = 0.15;

export class Board3dCard {
  private group: Group;
  private cardMesh: Mesh;
  private outlineMesh: Mesh | null = null;
  private maskTexture?: Texture;
  private static cardGeometry: BoxGeometry;
  private static edgeMaterial: MeshStandardMaterial;
  private static outlineGeometry: BoxGeometry;
  // Material cache: key is texture URL + mask texture URL, value is material
  private static materialCache: Map<string, MeshStandardMaterial> = new Map();
  // Outline material cache: key is color hex + mask texture URL, value is material
  private static outlineMaterialCache: Map<string, MeshBasicMaterial> = new Map();
  private frontMaterialKey?: string;
  private backMaterialKey?: string;

  constructor(
    frontTexture: Texture,
    backTexture: Texture,
    position: Vector3,
    rotation: number = 0,
    scale: number = 1,
    maskTexture?: Texture
  ) {
    this.group = new Group();
    this.group.userData.isCard = true;

    // Initialize shared geometry and materials if not already created
    if (!Board3dCard.cardGeometry) {
      // Box geometry for realistic depth (2.5 x 3.5 x 0.02 units)
      Board3dCard.cardGeometry = new BoxGeometry(2.5, 3.5, 0.02);
    }

    if (!Board3dCard.edgeMaterial) {
      // Dark material for card edges
      Board3dCard.edgeMaterial = new MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.7,
        metalness: 0.1
      });
    }

    // Create material keys for caching
    const frontKey = this.getMaterialKey(frontTexture, maskTexture);
    const backKey = this.getMaterialKey(backTexture, maskTexture);
    this.frontMaterialKey = frontKey;
    this.backMaterialKey = backKey;

    // Get or create materials from cache
    let frontMaterial = Board3dCard.materialCache.get(frontKey);
    if (!frontMaterial) {
      frontMaterial = new MeshStandardMaterial({
        map: frontTexture,
        ...(maskTexture && { alphaMap: maskTexture }),
        roughness: 0.4,
        metalness: 0.1,
        side: DoubleSide, // Keep DoubleSide for front face (cards can be viewed from above/below)
        alphaTest: 0.1,  // Use alphaTest instead of transparent for better performance
        depthWrite: true
      });
      Board3dCard.materialCache.set(frontKey, frontMaterial);
    }

    let backMaterial = Board3dCard.materialCache.get(backKey);
    if (!backMaterial) {
      backMaterial = new MeshStandardMaterial({
        map: backTexture,
        ...(maskTexture && { alphaMap: maskTexture }),
        roughness: 0.4,
        metalness: 0.1,
        side: DoubleSide, // Keep DoubleSide for back face
        alphaTest: 0.1,
        depthWrite: true
      });
      Board3dCard.materialCache.set(backKey, backMaterial);
    }

    // Create materials array for 6 faces
    const materials = [
      Board3dCard.edgeMaterial,  // Right edge
      Board3dCard.edgeMaterial,  // Left edge
      Board3dCard.edgeMaterial,  // Top edge
      Board3dCard.edgeMaterial,  // Bottom edge
      frontMaterial,  // Front face (card image) - shared if same texture
      backMaterial    // Back face (card back) - shared if same texture
    ];

    this.cardMesh = new Mesh(Board3dCard.cardGeometry, materials);
    this.cardMesh.castShadow = true;
    this.cardMesh.receiveShadow = false;

    // Rotate card to face upward (fix orientation)
    this.cardMesh.rotation.x = -Math.PI / 2;

    this.group.add(this.cardMesh);

    // Set position, rotation, and scale
    this.group.position.copy(position);
    this.group.rotation.y = (rotation * Math.PI) / 180;
    this.group.scale.setScalar(scale);

    // Store mask texture for use in outline
    this.maskTexture = maskTexture;
  }

  public getGroup(): Group {
    return this.group;
  }

  public getMesh(): Mesh {
    return this.cardMesh;
  }

  public setPosition(position: Vector3): void {
    this.group.position.copy(position);
  }

  public setRotation(rotation: number): void {
    this.group.rotation.y = (rotation * Math.PI) / 180;
  }

  public setScale(scale: number): void {
    this.group.scale.setScalar(scale);
  }

  public updateTexture(frontTexture: Texture, backTexture?: Texture, maskTexture?: Texture): void {
    const materials = this.cardMesh.material as MeshStandardMaterial[];
    
    // Check if we need to get new materials from cache
    const newFrontKey = this.getMaterialKey(frontTexture, maskTexture);
    const newBackKey = backTexture ? this.getMaterialKey(backTexture, maskTexture) : undefined;

    // If keys changed, get new materials from cache
    if (newFrontKey !== this.frontMaterialKey) {
      let frontMaterial = Board3dCard.materialCache.get(newFrontKey);
      if (!frontMaterial) {
        frontMaterial = new MeshStandardMaterial({
          map: frontTexture,
          ...(maskTexture && { alphaMap: maskTexture }),
          roughness: 0.4,
          metalness: 0.1,
          side: DoubleSide,
          alphaTest: 0.1,
          depthWrite: true
        });
        Board3dCard.materialCache.set(newFrontKey, frontMaterial);
      }
      materials[4] = frontMaterial;
      this.frontMaterialKey = newFrontKey;
    }

    if (backTexture && newBackKey !== this.backMaterialKey) {
      let backMaterial = Board3dCard.materialCache.get(newBackKey!);
      if (!backMaterial) {
        backMaterial = new MeshStandardMaterial({
          map: backTexture,
          ...(maskTexture && { alphaMap: maskTexture }),
          roughness: 0.4,
          metalness: 0.1,
          side: DoubleSide,
          alphaTest: 0.1,
          depthWrite: true
        });
        Board3dCard.materialCache.set(newBackKey!, backMaterial);
      }
      materials[5] = backMaterial;
      this.backMaterialKey = newBackKey;
    }

    // Update stored mask texture for outline
    if (maskTexture !== undefined) {
      this.maskTexture = maskTexture;
      // Update outline material if it exists
      if (this.outlineMesh) {
        const outlineMaterial = this.outlineMesh.material as MeshBasicMaterial;
        outlineMaterial.alphaMap = maskTexture;
        outlineMaterial.transparent = false; // Use alphaTest for outline too
        outlineMaterial.alphaTest = 0.1;
        outlineMaterial.needsUpdate = true;
      }
    }
  }

  public setEmissive(color: number, intensity: number): void {
    const materials = this.cardMesh.material as MeshStandardMaterial[];
    materials[4].emissive.setHex(color);
    materials[4].emissiveIntensity = intensity;
  }

  /**
   * Show or hide a colored outline around the card
   * Optimized: Uses shared outline materials and geometry
   */
  public setOutline(visible: boolean, color: number = 0x4ade80): void {
    if (visible) {
      if (!this.outlineMesh) {
        // Create outline geometry if not exists (slightly larger than card) - shared across all cards
        if (!Board3dCard.outlineGeometry) {
          Board3dCard.outlineGeometry = new BoxGeometry(
            2.5 + OUTLINE_THICKNESS * 2,
            3.5 + OUTLINE_THICKNESS * 2,
            0.01
          );
        }

        // Get or create shared outline material
        const maskKey = this.maskTexture ? 
          ((this.maskTexture as any).uuid || this.maskTexture.image?.src || 'unknown') : 
          'no-mask';
        const outlineKey = `${color.toString(16)}|${maskKey}`;
        
        let outlineMaterial = Board3dCard.outlineMaterialCache.get(outlineKey);
        if (!outlineMaterial) {
          outlineMaterial = new MeshBasicMaterial({
            color: color,
            side: DoubleSide,
            ...(this.maskTexture && { alphaMap: this.maskTexture }),
            alphaTest: 0.1, // Use alphaTest instead of transparent for better performance
            depthWrite: true
          });
          Board3dCard.outlineMaterialCache.set(outlineKey, outlineMaterial);
        }

        this.outlineMesh = new Mesh(Board3dCard.outlineGeometry, outlineMaterial);
        // Position slightly behind the card
        this.outlineMesh.position.z = 0.02;
        this.outlineMesh.rotation.x = -Math.PI / 2;

        this.group.add(this.outlineMesh);
      } else {
        // Check if we need to switch to a different shared material
        const maskKey = this.maskTexture ? 
          ((this.maskTexture as any).uuid || this.maskTexture.image?.src || 'unknown') : 
          'no-mask';
        const outlineKey = `${color.toString(16)}|${maskKey}`;
        
        let outlineMaterial = Board3dCard.outlineMaterialCache.get(outlineKey);
        if (!outlineMaterial) {
          outlineMaterial = new MeshBasicMaterial({
            color: color,
            side: DoubleSide,
            ...(this.maskTexture && { alphaMap: this.maskTexture }),
            alphaTest: 0.1,
            depthWrite: true
          });
          Board3dCard.outlineMaterialCache.set(outlineKey, outlineMaterial);
        }
        
        // Switch to new material if different
        if (this.outlineMesh.material !== outlineMaterial) {
          this.outlineMesh.material = outlineMaterial;
        }
        
        this.outlineMesh.visible = true;
      }
    } else if (this.outlineMesh) {
      this.outlineMesh.visible = false;
    }
  }

  /**
   * Generate a cache key for material sharing
   */
  private getMaterialKey(texture: Texture, maskTexture?: Texture): string {
    const textureId = (texture as any).uuid || texture.image?.src || 'unknown';
    const maskId = maskTexture ? ((maskTexture as any).uuid || maskTexture.image?.src || 'unknown') : 'no-mask';
    return `${textureId}|${maskId}`;
  }

  public dispose(): void {
    // Don't dispose shared materials or outline materials - they're cached and reused
    // Just remove the outline mesh from the group
    if (this.outlineMesh) {
      this.group.remove(this.outlineMesh);
      this.outlineMesh = null;
    }

    if (this.group.parent) {
      this.group.parent.remove(this.group);
    }
  }

  public static disposeSharedResources(): void {
    if (Board3dCard.cardGeometry) {
      Board3dCard.cardGeometry.dispose();
    }
    if (Board3dCard.edgeMaterial) {
      Board3dCard.edgeMaterial.dispose();
    }
    if (Board3dCard.outlineGeometry) {
      Board3dCard.outlineGeometry.dispose();
    }
    // Dispose all cached materials
    Board3dCard.materialCache.forEach(material => {
      material.dispose();
    });
    Board3dCard.materialCache.clear();
    // Dispose all cached outline materials
    Board3dCard.outlineMaterialCache.forEach(material => {
      material.dispose();
    });
    Board3dCard.outlineMaterialCache.clear();
  }
}
