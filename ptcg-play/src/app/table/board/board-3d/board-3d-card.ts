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
  private static cardGeometry: BoxGeometry;
  private static edgeMaterial: MeshStandardMaterial;
  private static outlineGeometry: BoxGeometry;

  constructor(
    frontTexture: Texture,
    backTexture: Texture,
    position: Vector3,
    rotation: number = 0,
    scale: number = 1
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

    // Create materials array for 6 faces
    const materials = [
      Board3dCard.edgeMaterial,  // Right edge
      Board3dCard.edgeMaterial,  // Left edge
      Board3dCard.edgeMaterial,  // Top edge
      Board3dCard.edgeMaterial,  // Bottom edge
      new MeshStandardMaterial({  // Front face (card image)
        map: frontTexture,
        roughness: 0.4,
        metalness: 0.1,
        side: DoubleSide,
        transparent: true,
        alphaTest: 0.1  // Discard pixels with alpha < 0.1 for cleaner edges
      }),
      new MeshStandardMaterial({  // Back face (card back)
        map: backTexture,
        roughness: 0.4,
        metalness: 0.1,
        side: DoubleSide,
        transparent: true,
        alphaTest: 0.1
      })
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

  public updateTexture(frontTexture: Texture, backTexture?: Texture): void {
    const materials = this.cardMesh.material as MeshStandardMaterial[];
    materials[4].map = frontTexture;
    materials[4].needsUpdate = true;

    if (backTexture) {
      materials[5].map = backTexture;
      materials[5].needsUpdate = true;
    }
  }

  public setEmissive(color: number, intensity: number): void {
    const materials = this.cardMesh.material as MeshStandardMaterial[];
    materials[4].emissive.setHex(color);
    materials[4].emissiveIntensity = intensity;
  }

  /**
   * Show or hide a colored outline around the card
   */
  public setOutline(visible: boolean, color: number = 0x4ade80): void {
    if (visible) {
      if (!this.outlineMesh) {
        // Create outline geometry if not exists (slightly larger than card)
        if (!Board3dCard.outlineGeometry) {
          Board3dCard.outlineGeometry = new BoxGeometry(
            2.5 + OUTLINE_THICKNESS * 2,
            3.5 + OUTLINE_THICKNESS * 2,
            0.01
          );
        }

        // Create outline material with the specified color
        const outlineMaterial = new MeshBasicMaterial({
          color: color,
          side: DoubleSide
        });

        this.outlineMesh = new Mesh(Board3dCard.outlineGeometry, outlineMaterial);
        // Position slightly behind the card
        this.outlineMesh.position.z = 0.02;
        this.outlineMesh.rotation.x = -Math.PI / 2;

        this.group.add(this.outlineMesh);
      } else {
        // Update color if outline already exists
        (this.outlineMesh.material as MeshBasicMaterial).color.setHex(color);
        this.outlineMesh.visible = true;
      }
    } else if (this.outlineMesh) {
      this.outlineMesh.visible = false;
    }
  }

  public dispose(): void {
    // Dispose of dynamic materials (not shared ones)
    const materials = this.cardMesh.material as MeshStandardMaterial[];
    materials[4].dispose();
    materials[5].dispose();

    // Dispose outline mesh if exists
    if (this.outlineMesh) {
      (this.outlineMesh.material as MeshBasicMaterial).dispose();
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
  }
}
