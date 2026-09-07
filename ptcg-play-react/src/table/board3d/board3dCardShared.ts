import {
  BufferGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Shape,
  Vector2,
} from 'three';
import type { Texture } from 'three';

/** Card face size — matches overlay layout / historical BoxGeometry. */
export const BOARD3D_CARD_WIDTH = 2.5;
export const BOARD3D_CARD_HEIGHT = 3.5;
export const BOARD3D_CARD_DEPTH = 0.02;

/**
 * Corner radius matching `assets/3d-card-mask.png` (~37px on 734px width).
 * Kept in sync so geometric silhouette aligns with the alpha mask.
 */
export const BOARD3D_CARD_CORNER_RADIUS = BOARD3D_CARD_WIDTH * (37 / 734);

const CARD_CURVE_SEGMENTS = 12;
const OUTLINE_THICKNESS = 0.15;
const OUTLINE_DEPTH = 0.01;

/** Shared cache key for face materials (matches {@link Board3dCard} history). */
export function board3dCardMaterialKey(texture: Texture, maskTexture?: Texture): string {
  const textureId =
    (texture as { uuid?: string; image?: { src?: string } }).uuid || texture.image?.src || 'unknown';
  const maskId = maskTexture
    ? (maskTexture as { uuid?: string; image?: { src?: string } }).uuid ||
      maskTexture.image?.src ||
      'unknown'
    : 'no-mask';
  return `${textureId}|${maskId}`;
}

let cardGeometry: BufferGeometry | undefined;
let outlineGeometry: BufferGeometry | undefined;
let edgeMaterial: MeshStandardMaterial | undefined;

/** Face/back materials keyed by {@link board3dCardMaterialKey} (shared across JSX + imperative cards). */
export const board3dCardFaceMaterialCache = new Map<string, MeshStandardMaterial>();

/** Outline materials keyed by color+mask (shared). */
export const board3dCardOutlineMaterialCache = new Map<string, MeshBasicMaterial>();

function createRoundedRectShape(width: number, height: number, radius: number): Shape {
  const r = Math.min(radius, width / 2, height / 2);
  const x = -width / 2;
  const y = -height / 2;
  const shape = new Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - r);
  shape.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2, false);
  shape.lineTo(x + r, y + height);
  shape.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + r);
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

function cardFaceUVGenerator(width: number, height: number) {
  return {
    generateTopUV(
      _geometry: BufferGeometry,
      vertices: number[],
      indexA: number,
      indexB: number,
      indexC: number,
    ): Vector2[] {
      const toUV = (i: number) =>
        new Vector2(
          (vertices[i * 3]! + width / 2) / width,
          (vertices[i * 3 + 1]! + height / 2) / height,
        );
      return [toUV(indexA), toUV(indexB), toUV(indexC)];
    },
    generateSideWallUV(
      _geometry: BufferGeometry,
      _vertices: number[],
      _indexA: number,
      _indexB: number,
      _indexC: number,
      _indexD: number,
    ): Vector2[] {
      return [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1)];
    },
  };
}

/**
 * Rounded-rect extrude with material groups:
 * 0 = edge (sides), 1 = front (+Z), 2 = back (-Z).
 * Back-face U is flipped so cardbacks aren't mirrored.
 */
function buildRoundedCardGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number,
  curveSegments: number = CARD_CURVE_SEGMENTS,
): BufferGeometry {
  const shape = createRoundedRectShape(width, height, radius);
  const extruded = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments,
    UVGenerator: cardFaceUVGenerator(width, height),
  });
  extruded.translate(0, 0, -depth / 2);
  extruded.computeVertexNormals();

  const pos = extruded.attributes.position!;
  const nrm = extruded.attributes.normal!;
  const uv = extruded.attributes.uv!;

  const front: number[] = [];
  const back: number[] = [];
  const sides: number[] = [];

  for (let i = 0; i < pos.count; i += 3) {
    const nz = (nrm.getZ(i) + nrm.getZ(i + 1) + nrm.getZ(i + 2)) / 3;
    const bucket = nz > 0.5 ? front : nz < -0.5 ? back : sides;
    bucket.push(i, i + 1, i + 2);
  }

  // Flip U on back face so cardback orientation matches the old BoxGeometry -Z face.
  for (const i of back) {
    uv.setX(i, 1 - uv.getX(i));
  }

  const order = [...sides, ...front, ...back];
  const newPos: number[] = [];
  const newNrm: number[] = [];
  const newUv: number[] = [];
  for (const i of order) {
    newPos.push(pos.getX(i), pos.getY(i), pos.getZ(i));
    newNrm.push(nrm.getX(i), nrm.getY(i), nrm.getZ(i));
    newUv.push(uv.getX(i), uv.getY(i));
  }

  extruded.dispose();

  const out = new BufferGeometry();
  out.setAttribute('position', new Float32BufferAttribute(newPos, 3));
  out.setAttribute('normal', new Float32BufferAttribute(newNrm, 3));
  out.setAttribute('uv', new Float32BufferAttribute(newUv, 2));
  out.clearGroups();
  out.addGroup(0, sides.length, 0);
  out.addGroup(sides.length, front.length, 1);
  out.addGroup(sides.length + front.length, back.length, 2);
  return out;
}

/** Shared rounded card mesh (edge / front / back material groups). */
export function getBoard3dCardGeometry(): BufferGeometry {
  if (!cardGeometry) {
    cardGeometry = buildRoundedCardGeometry(
      BOARD3D_CARD_WIDTH,
      BOARD3D_CARD_HEIGHT,
      BOARD3D_CARD_DEPTH,
      BOARD3D_CARD_CORNER_RADIUS,
    );
  }
  return cardGeometry;
}

/** @deprecated Prefer {@link getBoard3dCardGeometry} — same shared rounded mesh. */
export function getBoard3dCardBoxGeometry(): BufferGeometry {
  return getBoard3dCardGeometry();
}

/** Inflated rounded outline (parallel curve: radius + thickness). */
export function getBoard3dCardOutlineGeometry(): BufferGeometry {
  if (!outlineGeometry) {
    outlineGeometry = buildRoundedCardGeometry(
      BOARD3D_CARD_WIDTH + OUTLINE_THICKNESS * 2,
      BOARD3D_CARD_HEIGHT + OUTLINE_THICKNESS * 2,
      OUTLINE_DEPTH,
      BOARD3D_CARD_CORNER_RADIUS + OUTLINE_THICKNESS,
    );
  }
  return outlineGeometry;
}

export function getBoard3dCardEdgeMaterial(): MeshStandardMaterial {
  if (!edgeMaterial) {
    edgeMaterial = new MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.7,
      metalness: 0.1,
    });
  }
  return edgeMaterial;
}

export function disposeBoard3dCardSharedResources(): void {
  if (cardGeometry) {
    cardGeometry.dispose();
    cardGeometry = undefined;
  }
  if (outlineGeometry) {
    outlineGeometry.dispose();
    outlineGeometry = undefined;
  }
  if (edgeMaterial) {
    edgeMaterial.dispose();
    edgeMaterial = undefined;
  }
  board3dCardFaceMaterialCache.forEach((m) => m.dispose());
  board3dCardFaceMaterialCache.clear();
  board3dCardOutlineMaterialCache.forEach((m) => m.dispose());
  board3dCardOutlineMaterialCache.clear();
}
