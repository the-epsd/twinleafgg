import {
  MeshStandardMaterial,
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  Texture,
  Group,
  DoubleSide,
  Vector3,
  type ShaderMaterial,
} from 'three';
import { createBoard3dHoloMaterial, releaseBoard3dHoloMaterial } from './board-3d-holo-material';
import {
  board3dCardMaterialKey,
  board3dCardFaceMaterialCache,
  board3dCardOutlineMaterialCache,
  getBoard3dCardBoxGeometry,
  getBoard3dCardOutlineGeometry,
  getBoard3dCardEdgeMaterial,
  disposeBoard3dCardSharedResources,
} from './board3dCardShared';

export class Board3dCard {
  private group: Group;
  private cardMesh: Mesh;
  private outlineMesh: Mesh | null = null;
  private maskTexture?: Texture;
  private frontMaterialKey?: string;
  private backMaterialKey?: string;
  private holoMesh: Mesh | null = null;
  private holoMaterial: ShaderMaterial | null = null;

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
    this.group.userData.board3dCard = this;

    const frontKey = board3dCardMaterialKey(frontTexture, maskTexture);
    const backKey = board3dCardMaterialKey(backTexture, maskTexture);
    this.frontMaterialKey = frontKey;
    this.backMaterialKey = backKey;

    // Get or create materials from cache
    let frontMaterial = board3dCardFaceMaterialCache.get(frontKey);
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
      board3dCardFaceMaterialCache.set(frontKey, frontMaterial);
    }

    let backMaterial = board3dCardFaceMaterialCache.get(backKey);
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
      board3dCardFaceMaterialCache.set(backKey, backMaterial);
    }

    // Create materials array for 6 faces
    const edgeMaterial = getBoard3dCardEdgeMaterial();
    const materials = [
      edgeMaterial,  // Right edge
      edgeMaterial,  // Left edge
      edgeMaterial,  // Top edge
      edgeMaterial,  // Bottom edge
      frontMaterial,  // Front face (card image) - shared if same texture
      backMaterial    // Back face (card back) - shared if same texture
    ];

    this.cardMesh = new Mesh(getBoard3dCardBoxGeometry(), materials);
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

  /**
   * Iridescent holo layer (2D art mask + animated shader), aligned with 2D CardFace.
   * Pass `null` to remove.
   */
  public setHolo(mask2d: Texture | null): void {
    if (this.holoMaterial) {
      releaseBoard3dHoloMaterial(this.holoMaterial);
      this.holoMaterial = null;
    }
    if (this.holoMesh) {
      this.cardMesh.remove(this.holoMesh);
      this.holoMesh.geometry.dispose();
      this.holoMesh = null;
    }
    if (!mask2d) {
      return;
    }
    const mat = createBoard3dHoloMaterial(mask2d);
    this.holoMaterial = mat;
    const geom = new PlaneGeometry(2.5, 3.5);
    this.holoMesh = new Mesh(geom, mat);
    this.holoMesh.renderOrder = 8;
    this.holoMesh.position.set(0, 0, 0.02);
    this.cardMesh.add(this.holoMesh);
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
    const newFrontKey = board3dCardMaterialKey(frontTexture, maskTexture);
    const newBackKey = backTexture ? board3dCardMaterialKey(backTexture, maskTexture) : undefined;

    // If keys changed, get new materials from cache
    if (newFrontKey !== this.frontMaterialKey) {
      let frontMaterial = board3dCardFaceMaterialCache.get(newFrontKey);
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
        board3dCardFaceMaterialCache.set(newFrontKey, frontMaterial);
      }
      materials[4] = frontMaterial;
      this.frontMaterialKey = newFrontKey;
    }

    if (backTexture && newBackKey !== this.backMaterialKey) {
      let backMaterial = board3dCardFaceMaterialCache.get(newBackKey!);
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
        board3dCardFaceMaterialCache.set(newBackKey!, backMaterial);
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
        const maskKey = this.maskTexture ?
          ((this.maskTexture as { uuid?: string; image?: { src?: string } }).uuid || this.maskTexture.image?.src || 'unknown') :
          'no-mask';
        const outlineKey = `${color.toString(16)}|${maskKey}`;

        let outlineMaterial = board3dCardOutlineMaterialCache.get(outlineKey);
        if (!outlineMaterial) {
          outlineMaterial = new MeshBasicMaterial({
            color: color,
            side: DoubleSide,
            ...(this.maskTexture && { alphaMap: this.maskTexture }),
            alphaTest: 0.1, // Use alphaTest instead of transparent for better performance
            depthWrite: true
          });
          board3dCardOutlineMaterialCache.set(outlineKey, outlineMaterial);
        }

        this.outlineMesh = new Mesh(getBoard3dCardOutlineGeometry(), outlineMaterial);
        // Position slightly behind the card
        this.outlineMesh.position.z = 0.02;
        this.outlineMesh.rotation.x = -Math.PI / 2;

        this.group.add(this.outlineMesh);
      } else {
        const maskKey = this.maskTexture ?
          ((this.maskTexture as { uuid?: string; image?: { src?: string } }).uuid || this.maskTexture.image?.src || 'unknown') :
          'no-mask';
        const outlineKey = `${color.toString(16)}|${maskKey}`;

        let outlineMaterial = board3dCardOutlineMaterialCache.get(outlineKey);
        if (!outlineMaterial) {
          outlineMaterial = new MeshBasicMaterial({
            color: color,
            side: DoubleSide,
            ...(this.maskTexture && { alphaMap: this.maskTexture }),
            alphaTest: 0.1,
            depthWrite: true
          });
          board3dCardOutlineMaterialCache.set(outlineKey, outlineMaterial);
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

  public dispose(): void {
    this.setHolo(null);
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
    disposeBoard3dCardSharedResources();
  }
}
