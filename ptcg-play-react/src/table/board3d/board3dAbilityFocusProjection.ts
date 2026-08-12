import type { PerspectiveCamera } from 'three';
import { Vector3, type Mesh } from 'three';
import type { AbilityFocusAnchor, AbilityFocusPoint } from '../BoardInteractionService';

/** Matches {@link getBoard3dCardBoxGeometry} (2.5 × 3.5 × 0.02). */
const CARD_HALF_W = 1.25;
const CARD_HALF_H = 1.75;
const CARD_HALF_D = 0.01;

/** Card-local +Y inset on the top edge so the cutout does not sit above the visible card. */
const ABILITY_FOCUS_TOP_INSET = 0.18;

/** Indices of the card artwork top edge in {@link FACE_CORNER_LOCAL}. */
const ABILITY_FOCUS_TOP_CORNER_INDICES = new Set([2, 3]);

const TOP_CORNER_Y = CARD_HALF_H - ABILITY_FOCUS_TOP_INSET;

const FACE_CORNER_LOCAL = [
  new Vector3(-CARD_HALF_W, -CARD_HALF_H, CARD_HALF_D),
  new Vector3(CARD_HALF_W, -CARD_HALF_H, CARD_HALF_D),
  new Vector3(CARD_HALF_W, TOP_CORNER_Y, CARD_HALF_D),
  new Vector3(-CARD_HALF_W, TOP_CORNER_Y, CARD_HALF_D),
];

/**
 * Lower text region for ability/attack plates — slightly wider than the card so
 * boxes may overhang; excludes the bottom retreat strip.
 * Order: BL, BR, TR, TL in card-local face space.
 */
const TEXT_PLATE_HALF_W = 1.38;
const TEXT_PLATE_BOTTOM_Y = -CARD_HALF_H + 0.38;
const TEXT_PLATE_TOP_Y = -CARD_HALF_H + 3.5 * 0.52;
export const CARD_TEXT_PLATE_LOCAL_SIZE = {
  width: TEXT_PLATE_HALF_W * 2,
  height: TEXT_PLATE_TOP_Y - TEXT_PLATE_BOTTOM_Y,
} as const;
const TEXT_PLATE_CORNER_LOCAL = [
  new Vector3(-TEXT_PLATE_HALF_W, TEXT_PLATE_BOTTOM_Y, CARD_HALF_D),
  new Vector3(TEXT_PLATE_HALF_W, TEXT_PLATE_BOTTOM_Y, CARD_HALF_D),
  new Vector3(TEXT_PLATE_HALF_W, TEXT_PLATE_TOP_Y, CARD_HALF_D),
  new Vector3(-TEXT_PLATE_HALF_W, TEXT_PLATE_TOP_Y, CARD_HALF_D),
];

/**
 * Compact retreat-cost chip (bottom-right of the printed stats row).
 * Order: BL, BR, TR, TL.
 */
const RETREAT_LEFT_X = 0.05;
const RETREAT_RIGHT_X = CARD_HALF_W - 0.05;
const RETREAT_BOTTOM_Y = -CARD_HALF_H + 0.04;
const RETREAT_TOP_Y = -CARD_HALF_H + 0.42;
export const CARD_RETREAT_PLATE_LOCAL_SIZE = {
  width: RETREAT_RIGHT_X - RETREAT_LEFT_X,
  height: RETREAT_TOP_Y - RETREAT_BOTTOM_Y,
} as const;
const RETREAT_PLATE_CORNER_LOCAL = [
  new Vector3(RETREAT_LEFT_X, RETREAT_BOTTOM_Y, CARD_HALF_D),
  new Vector3(RETREAT_RIGHT_X, RETREAT_BOTTOM_Y, CARD_HALF_D),
  new Vector3(RETREAT_RIGHT_X, RETREAT_TOP_Y, CARD_HALF_D),
  new Vector3(RETREAT_LEFT_X, RETREAT_TOP_Y, CARD_HALF_D),
];

const WORLD_CORNER = new Vector3();
const PROJECTED_NDC = new Vector3();

function projectWorldToViewport(
  world: Vector3,
  camera: PerspectiveCamera,
  canvasRect: DOMRect,
): AbilityFocusPoint {
  PROJECTED_NDC.copy(world).project(camera);
  return {
    x: canvasRect.left + (PROJECTED_NDC.x * 0.5 + 0.5) * canvasRect.width,
    y: canvasRect.top + (-PROJECTED_NDC.y * 0.5 + 0.5) * canvasRect.height,
  };
}

/** Expand a convex screen polygon outward from its centroid (px). */
export function expandScreenPolygon(
  points: readonly AbilityFocusPoint[],
  padPx: number,
): AbilityFocusPoint[] {
  return expandScreenPolygonWithCornerPad(points, padPx);
}

/** Radial screen-space padding; top artwork corners can use a smaller pad. */
function expandScreenPolygonWithCornerPad(
  points: readonly AbilityFocusPoint[],
  padPx: number,
  cornerPadPx: readonly number[] | number = padPx,
): AbilityFocusPoint[] {
  if (points.length === 0 || padPx <= 0) {
    return [...points];
  }
  const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
  return points.map((p, index) => {
    const pad =
      typeof cornerPadPx === 'number'
        ? cornerPadPx
        : cornerPadPx[index] ?? padPx;
    if (pad <= 0) {
      return { ...p };
    }
    const dx = p.x - cx;
    const dy = p.y - cy;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x + (dx / len) * pad, y: p.y + (dy / len) * pad };
  });
}

/** Side/bottom padding only — top corners stay tight so the hole is not too tall. */
function expandAbilityFocusPolygon(
  points: readonly AbilityFocusPoint[],
  padPx: number,
): AbilityFocusPoint[] {
  const cornerPadPx = points.map((_, index) =>
    ABILITY_FOCUS_TOP_CORNER_INDICES.has(index) ? 0 : padPx,
  );
  return expandScreenPolygonWithCornerPad(points, padPx, cornerPadPx);
}

function projectFaceCornersToAnchor(
  cardMesh: Mesh,
  camera: PerspectiveCamera,
  canvasRect: DOMRect,
  corners: readonly Vector3[],
  padPx: number,
  expand: (points: AbilityFocusPoint[], pad: number) => AbilityFocusPoint[],
): AbilityFocusAnchor | null {
  cardMesh.updateWorldMatrix(true, false);

  const polygon: AbilityFocusPoint[] = [];
  for (const local of corners) {
    WORLD_CORNER.copy(local);
    cardMesh.localToWorld(WORLD_CORNER);
    polygon.push(projectWorldToViewport(WORLD_CORNER, camera, canvasRect));
  }

  if (polygon.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))) {
    return null;
  }

  return {
    polygon: padPx > 0 ? expand(polygon, padPx) : polygon,
  };
}

/**
 * Project the card mesh front face (+Z before mesh rotation) to a screen-space quad.
 * {@link Mesh} must be the board card body ({@link Board3dCard.getMesh}).
 */
export function projectCardFaceToScreenAnchor(
  cardMesh: Mesh,
  camera: PerspectiveCamera,
  canvasRect: DOMRect,
  padPx = 0,
): AbilityFocusAnchor | null {
  return projectFaceCornersToAnchor(
    cardMesh,
    camera,
    canvasRect,
    FACE_CORNER_LOCAL,
    padPx,
    expandAbilityFocusPolygon,
  );
}

/**
 * Project the ability/attack text region (slightly wider than the card; above retreat).
 */
export function projectCardLowerFaceToScreenAnchor(
  cardMesh: Mesh,
  camera: PerspectiveCamera,
  canvasRect: DOMRect,
  padPx = 0,
): AbilityFocusAnchor | null {
  return projectFaceCornersToAnchor(
    cardMesh,
    camera,
    canvasRect,
    TEXT_PLATE_CORNER_LOCAL,
    padPx,
    (points, pad) => expandScreenPolygon(points, pad),
  );
}

/**
 * Project the compact retreat-cost chip (bottom-right stats area).
 */
export function projectCardRetreatPlateToScreenAnchor(
  cardMesh: Mesh,
  camera: PerspectiveCamera,
  canvasRect: DOMRect,
  padPx = 0,
): AbilityFocusAnchor | null {
  return projectFaceCornersToAnchor(
    cardMesh,
    camera,
    canvasRect,
    RETREAT_PLATE_CORNER_LOCAL,
    padPx,
    (points, pad) => expandScreenPolygon(points, pad),
  );
}
