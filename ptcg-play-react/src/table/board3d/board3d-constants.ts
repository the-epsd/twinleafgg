/** Grid overlay Y — below cards so grid appears underneath */
export const BOARD_3D_GRID_Y = 0.1;
/** Twinleaf emblem: slightly above grid, under typical card lift */
export const BOARD_3D_CENTER_EMBLEM_Y = 0.101;
/** Diameter in world units — ~fit between active rows with margin */
export const BOARD_3D_CENTER_EMBLEM_SIZE = 7;
/** Match bench / slot outline ribbon thickness */
export const BOARD_3D_BENCH_OUTLINE_THICKNESS = 0.02;
export const BOARD_3D_BENCH_OUTLINE_COLOR = 0xffffff;

/** Imperative deck bulk meshes: exclude from raycast lists ({@link Board3dInteractionService.updateInteractiveObjects}). */
export const BOARD3D_DECK_BULK_VISUAL_UD = 'deckBulkVisualOnly' as const;
