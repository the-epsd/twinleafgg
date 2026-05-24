import {
  BoxGeometry,
  PlaneGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  DoubleSide,
} from 'three';
import type { Texture } from 'three';

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

const BORDER_THICKNESS = 0.07;
const OUTLINE_THICKNESS = 0.15;

/** Default card rim (#1a354b) — shared across all 3D cards. */
export const BOARD3D_DEFAULT_CARD_BORDER_COLOR = 0x1a354b;

let cardBoxGeometry: BoxGeometry | undefined;
let borderPlaneGeometry: PlaneGeometry | undefined;
let outlineBoxGeometry: BoxGeometry | undefined;
let edgeMaterial: MeshStandardMaterial | undefined;
let cardBorderMaskTexture: Texture | undefined;

/** Ring alpha for the default blue card rim ({@link Board3dAssetLoaderService}). */
export function setBoard3dCardBorderMaskTexture(texture: Texture | undefined): void {
  cardBorderMaskTexture = texture;
}

export function getBoard3dCardBorderMaskTexture(): Texture | undefined {
  return cardBorderMaskTexture;
}

/** Face/back materials keyed by {@link board3dCardMaterialKey} (shared across JSX + imperative cards). */
export const board3dCardFaceMaterialCache = new Map<string, MeshStandardMaterial>();

/** Outline materials keyed by color+mask (shared). */
export const board3dCardOutlineMaterialCache = new Map<string, MeshBasicMaterial>();

/** Default border materials keyed by mask (shared). */
export const board3dCardBorderMaterialCache = new Map<string, MeshBasicMaterial>();

export function getBoard3dCardBoxGeometry(): BoxGeometry {
  if (!cardBoxGeometry) {
    cardBoxGeometry = new BoxGeometry(2.5, 3.5, 0.02);
  }
  return cardBoxGeometry;
}

export function getBoard3dCardBorderGeometry(): PlaneGeometry {
  if (!borderPlaneGeometry) {
    borderPlaneGeometry = new PlaneGeometry(
      2.5 + BORDER_THICKNESS * 2,
      3.5 + BORDER_THICKNESS * 2,
    );
  }
  return borderPlaneGeometry;
}

export function getBoard3dCardOutlineGeometry(): BoxGeometry {
  if (!outlineBoxGeometry) {
    outlineBoxGeometry = new BoxGeometry(
      2.5 + OUTLINE_THICKNESS * 2,
      3.5 + OUTLINE_THICKNESS * 2,
      0.01,
    );
  }
  return outlineBoxGeometry;
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
  if (cardBoxGeometry) {
    cardBoxGeometry.dispose();
    cardBoxGeometry = undefined;
  }
  if (borderPlaneGeometry) {
    borderPlaneGeometry.dispose();
    borderPlaneGeometry = undefined;
  }
  cardBorderMaskTexture = undefined;
  if (outlineBoxGeometry) {
    outlineBoxGeometry.dispose();
    outlineBoxGeometry = undefined;
  }
  if (edgeMaterial) {
    edgeMaterial.dispose();
    edgeMaterial = undefined;
  }
  board3dCardFaceMaterialCache.forEach((m) => m.dispose());
  board3dCardFaceMaterialCache.clear();
  board3dCardOutlineMaterialCache.forEach((m) => m.dispose());
  board3dCardOutlineMaterialCache.clear();
  board3dCardBorderMaterialCache.forEach((m) => m.dispose());
  board3dCardBorderMaterialCache.clear();
}
