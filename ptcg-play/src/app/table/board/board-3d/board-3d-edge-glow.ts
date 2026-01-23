import {
  Scene,
  Shape,
  Path,
  ExtrudeGeometry,
  MeshStandardMaterial,
  Mesh
} from 'three';

export class Board3dEdgeGlow {
  private edgeMesh!: Mesh;

  constructor(private scene: Scene) {
    this.createGlowingEdges();
  }

  private createGlowingEdges(): void {
    // Create shape for glowing edges (frame with hole in middle)
    const edgeShape = new Shape();

    // Outer rectangle
    edgeShape.moveTo(-25, -25);
    edgeShape.lineTo(25, -25);
    edgeShape.lineTo(25, 25);
    edgeShape.lineTo(-25, 25);
    edgeShape.lineTo(-25, -25);

    // Inner rectangle (hole)
    const holePath = new Path();
    holePath.moveTo(-22, -22);
    holePath.lineTo(-22, 22);
    holePath.lineTo(22, 22);
    holePath.lineTo(22, -22);
    holePath.lineTo(-22, -22);
    edgeShape.holes.push(holePath);

    // Extrude for 3D depth
    const extrudeSettings = {
      depth: 0.0,
      bevelEnabled: false,
      bevelThickness: 0.0,
      bevelSize: 0.1,
      bevelSegments: 3
    };

    const edgeGeometry = new ExtrudeGeometry(edgeShape, extrudeSettings);

    // Material with emissive glow
    const edgeMaterial = new MeshStandardMaterial({
      color: 0x0066ff,
      emissive: 0x0052ff,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.0,
      metalness: 0.3,
      roughness: 0.2
    });

    this.edgeMesh = new Mesh(edgeGeometry, edgeMaterial);

    // Rotate to horizontal and position slightly above board
    this.edgeMesh.rotation.x = -Math.PI / 2;
    this.edgeMesh.position.y = 0.05;

    // Disabled: edge glow is turned off
    // this.scene.add(this.edgeMesh);
  }

  public dispose(): void {
    if (this.edgeMesh) {
      this.edgeMesh.geometry.dispose();
      (this.edgeMesh.material as MeshStandardMaterial).dispose();
      this.scene.remove(this.edgeMesh);
    }
  }

  public getMesh(): Mesh {
    return this.edgeMesh;
  }
}
