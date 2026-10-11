import type { PerspectiveCamera } from 'three';
import { Vector3, type Mesh } from 'three';
import type { AbilityFocusAnchor, AbilityFocusPoint } from '../BoardInteractionService';
import {
  BOARD3D_CARD_CORNER_RADIUS,
  BOARD3D_CARD_HEIGHT,
  BOARD3D_CARD_WIDTH,
} from './board3dCardShared';

/** Matches {@link getBoard3dCardGeometry} footprint (2.5 × 3.5 × 0.02). */
const CARD_HALF_W = BOARD3D_CARD_WIDTH / 2;
const CARD_HALF_H = BOARD3D_CARD_HEIGHT / 2;
const CARD_HALF_D = 0.01;

/** Samples per rounded corner for the ability spotlight silhouette. */
const ROUNDED_CORNER_SEGMENTS = 8;

/**
 * Card-local front-face outline matching the rounded card mesh
 * ({@link BOARD3D_CARD_CORNER_RADIUS}). Order is CCW starting at bottom-left
 * straight edge (after the BL arc).
 */
const FACE_OUTLINE_LOCAL: readonly Vector3[] = buildRoundedRectOutlineLocal(
  CARD_HALF_W,
  CARD_HALF_H,
  CARD_HALF_D,
  BOARD3D_CARD_CORNER_RADIUS,
  ROUNDED_CORNER_SEGMENTS,
);

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

function buildRoundedRectOutlineLocal(
  halfW: number,
  halfH: number,
  z: number,
  radius: number,
  segments: number,
): Vector3[] {
  const r = Math.min(radius, halfW, halfH);
  const points: Vector3[] = [];

  const pushArc = (cx: number, cy: number, startAngle: number, endAngle: number): void => {
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = startAngle + (endAngle - startAngle) * t;
      points.push(new Vector3(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, z));
    }
  };

  // Bottom edge (left → right), then BR / TR / TL / BL arcs — matches card mesh Shape.
  points.push(new Vector3(-halfW + r, -halfH, z));
  points.push(new Vector3(halfW - r, -halfH, z));
  pushArc(halfW - r, -halfH + r, -Math.PI / 2, 0);
  points.push(new Vector3(halfW, halfH - r, z));
  pushArc(halfW - r, halfH - r, 0, Math.PI / 2);
  points.push(new Vector3(-halfW + r, halfH, z));
  pushArc(-halfW + r, halfH - r, Math.PI / 2, Math.PI);
  points.push(new Vector3(-halfW, -halfH + r, z));
  pushArc(-halfW + r, -halfH + r, Math.PI, Math.PI * 1.5);

  return points;
}

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

/** Project to canvas-local CSS pixels (0,0 = canvas top-left). */
function projectWorldToCanvas(
  world: Vector3,
  camera: PerspectiveCamera,
  canvasRect: DOMRect,
): AbilityFocusPoint {
  PROJECTED_NDC.copy(world).project(camera);
  return {
    x: (PROJECTED_NDC.x * 0.5 + 0.5) * canvasRect.width,
    y: (-PROJECTED_NDC.y * 0.5 + 0.5) * canvasRect.height,
  };
}

/** Expand (or shrink, if padPx < 0) a convex screen polygon from its centroid. */
export function expandScreenPolygon(
  points: readonly AbilityFocusPoint[],
  padPx: number,
): AbilityFocusPoint[] {
  if (points.length === 0 || padPx === 0) {
    return [...points];
  }
  const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
  return points.map((p) => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x + (dx / len) * padPx, y: p.y + (dy / len) * padPx };
  });
}

function projectFaceCornersToAnchor(
  cardMesh: Mesh,
  camera: PerspectiveCamera,
  canvasRect: DOMRect,
  corners: readonly Vector3[],
  padPx: number,
  expand: (points: AbilityFocusPoint[], pad: number) => AbilityFocusPoint[],
  toScreen: (
    world: Vector3,
    camera: PerspectiveCamera,
    canvasRect: DOMRect,
  ) => AbilityFocusPoint = projectWorldToViewport,
  canvasLocal = false,
): AbilityFocusAnchor | null {
  cardMesh.updateWorldMatrix(true, false);
  camera.updateMatrixWorld(true);

  const polygon: AbilityFocusPoint[] = [];
  for (const local of corners) {
    WORLD_CORNER.copy(local);
    cardMesh.localToWorld(WORLD_CORNER);
    polygon.push(toScreen(WORLD_CORNER, camera, canvasRect));
  }

  if (polygon.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))) {
    return null;
  }

  const padded = padPx !== 0 ? expand(polygon, padPx) : polygon;
  return {
    polygon: padded,
    ...(canvasLocal
      ? { canvasSize: { width: canvasRect.width, height: canvasRect.height } }
      : {}),
  };
}

/**
 * Project the full rounded card front face to a canvas-local silhouette for the
 * ability-activation spotlight cutout. World scale (Active 1.5 / Bench 1.0) is
 * included via the mesh matrix — no extra padding.
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
    FACE_OUTLINE_LOCAL,
    padPx,
    (points, pad) => expandScreenPolygon(points, pad),
    projectWorldToCanvas,
    true,
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
