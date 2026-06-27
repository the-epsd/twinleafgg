import type { PerspectiveCamera } from 'three';
import { Vector3, type Mesh } from 'three';
import type { AbilityFocusAnchor, AbilityFocusPoint } from '../BoardInteractionService';

/** Matches {@link getBoard3dCardBoxGeometry} (2.5 × 3.5 × 0.02). */
const CARD_HALF_W = 1.25;
const CARD_HALF_H = 1.75;
const CARD_HALF_D = 0.01;

const FACE_CORNER_LOCAL = [
  new Vector3(-CARD_HALF_W, -CARD_HALF_H, CARD_HALF_D),
  new Vector3(CARD_HALF_W, -CARD_HALF_H, CARD_HALF_D),
  new Vector3(CARD_HALF_W, CARD_HALF_H, CARD_HALF_D),
  new Vector3(-CARD_HALF_W, CARD_HALF_H, CARD_HALF_D),
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
  if (points.length === 0 || padPx <= 0) {
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
  cardMesh.updateWorldMatrix(true, false);

  const polygon: AbilityFocusPoint[] = [];
  for (const local of FACE_CORNER_LOCAL) {
    WORLD_CORNER.copy(local);
    cardMesh.localToWorld(WORLD_CORNER);
    polygon.push(projectWorldToViewport(WORLD_CORNER, camera, canvasRect));
  }

  if (polygon.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))) {
    return null;
  }

  return {
    polygon: padPx > 0 ? expandScreenPolygon(polygon, padPx) : polygon,
  };
}
