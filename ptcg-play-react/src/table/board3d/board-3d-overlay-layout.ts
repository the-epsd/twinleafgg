/** Card dimensions in overlay-anchor space (BoxGeometry 2.5 × 3.5 × 0.02, art on +Z). */
export const CARD_WIDTH = 2.5;
export const CARD_HEIGHT = 3.5;
export const CARD_HALF_WIDTH = CARD_WIDTH / 2;
export const CARD_HALF_HEIGHT = CARD_HEIGHT / 2;
export const CARD_HALF_DEPTH = 0.01;

/** Shared depth for right-edge overlays (damage + status markers). */
export const OVERLAY_FACE_Z = 0.15;

/** Center X on the card right edge — disc hangs outward like Angular translate(50%). */
export const OVERLAY_RIGHT_X = CARD_HALF_WIDTH;

/** Damage counter rest pose (top-right corner). */
export const DAMAGE_COUNTER_SIZE = 0.96;
export const DAMAGE_COUNTER_HALF_SIZE = DAMAGE_COUNTER_SIZE / 2;
export const DAMAGE_COUNTER_REST_X = OVERLAY_RIGHT_X;
export const DAMAGE_COUNTER_REST_Y = CARD_HALF_HEIGHT;
export const DAMAGE_COUNTER_REST_Z = OVERLAY_FACE_Z;

/** Status marker size (25% of card height — matches Angular). */
export const MARKER_SIZE = CARD_HEIGHT * 0.25;
export const MARKER_HALF_SIZE = MARKER_SIZE / 2;

/** Vertical spacing between marker centers (15% of card height). */
export const MARKER_STACK_STEP = CARD_HEIGHT * 0.15;

/** First marker center: 20% from top of card art (matches Angular base top). */
export const MARKER_TOP_FRACTION = 0.2;

/** Per-marker Z lift so stacked markers don't z-fight at the same depth. */
const MARKER_Z_STEP = 0.012;

/**
 * DOM order for marker stacking (matches Angular board-card HTML).
 * Each marker type keeps its own slot even when earlier types are absent.
 */
export const MARKER_STACK_ORDER: readonly string[] = [
  'poison-marker',
  'paralyzed-marker',
  'confused-marker',
  'asleep-marker',
  'burned-marker',
  'imprison-marker',
  'shockwave-marker',
];

/** Active markers in DOM order. */
export function resolveMarkerStack(activeFiles: readonly string[]): string[] {
  const active = new Set(activeFiles);
  return MARKER_STACK_ORDER.filter((file) => active.has(file));
}

/**
 * Stack slot = count of other active markers before this one in DOM order.
 * Matches Angular sibling stacking when absent markers are not rendered.
 */
export function markerStackIndexForFile(
  markerFile: string,
  activeFiles: ReadonlySet<string>,
): number {
  let index = 0;
  for (const file of MARKER_STACK_ORDER) {
    if (file === markerFile) {
      return index;
    }
    if (activeFiles.has(file)) {
      index += 1;
    }
  }
  return 0;
}

export function markerOverlayPosition(stackIndex: number): { x: number; y: number; z: number } {
  const yFromTop = CARD_HEIGHT * MARKER_TOP_FRACTION + stackIndex * MARKER_STACK_STEP;
  let y = CARD_HALF_HEIGHT - yFromTop;
  const minCenterY = -CARD_HALF_HEIGHT + MARKER_HALF_SIZE;
  y = Math.max(y, minCenterY);

  return {
    x: OVERLAY_RIGHT_X,
    y,
    z: OVERLAY_FACE_Z + stackIndex * MARKER_Z_STEP,
  };
}
