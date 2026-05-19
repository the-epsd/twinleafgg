/** Grid overlay Y — below cards so grid appears underneath */
export const BOARD_3D_GRID_Y = 0.1;
/** Twinleaf emblem: below tool overlays (~0.07–0.08) so center Active tools aren't occluded */
export const BOARD_3D_CENTER_EMBLEM_Y = 0.068;
/** Diameter in world units — ~fit between active rows with margin */
export const BOARD_3D_CENTER_EMBLEM_SIZE = 7;
/** Match bench / slot outline ribbon thickness */
export const BOARD_3D_BENCH_OUTLINE_THICKNESS = 0.02;
/** Grid overlay + non-bench slot ribbons (white). */
export const BOARD_3D_BENCH_OUTLINE_COLOR = 0xffffff;
/** Bench row slot ribbons only ({@link Board3dController} imperative outlines). */
export const BOARD_3D_BENCH_SLOT_OUTLINE_COLOR = 0x2563eb;
/** Bench slot frame ribbons — must be > 0 or meshes stay fully transparent. */
export const BOARD_3D_BENCH_SLOT_OUTLINE_OPACITY = 0.32;
/** Idle visibility for bench slot / bench-general drop planes — must be > 0 or bench reads as empty. */
export const BOARD_3D_BENCH_DROP_ZONE_IDLE_OPACITY = 0.14;
/** Idle visibility for the large bench-general drop plane behind the row. */
export const BOARD_3D_BENCH_GENERAL_DROP_ZONE_IDLE_OPACITY = 0.09;

/** Imperative deck bulk meshes: exclude from raycast lists ({@link Board3dInteractionService.updateInteractiveObjects}). */
export const BOARD3D_DECK_BULK_VISUAL_UD = 'deckBulkVisualOnly' as const;

/** Pokémon card slot footprint in world units (matches rendered card aspect). */
export const BOARD3D_CARD_SLOT_BASE_WIDTH = 2.8;
export const BOARD3D_CARD_SLOT_BASE_HEIGHT = 3.8;

/**
 * Drop-zone hit targets vs card footprint (~35% larger — middle of requested 30–40%).
 * Used by {@link Board3dDropZone} defaults, bench/general/board zones, and slot outlines.
 */
export const BOARD3D_DROP_ZONE_TARGET_SCALE = 1.35;

/** Snap radius when resolving drags to small zones (active, bench slot, supporter, stadium). */
export const BOARD3D_DROP_ZONE_SNAP_DISTANCE = 3.5 * BOARD3D_DROP_ZONE_TARGET_SCALE;

/**
 * Stadium drop plane vs other slot-sized targets (same base × {@link BOARD3D_DROP_ZONE_TARGET_SCALE}).
 * Extra multiplier because stadium is shared and often aimed from both sides.
 */
export const BOARD3D_STADIUM_DROP_ZONE_EXTRA_SCALE = 1.55;
