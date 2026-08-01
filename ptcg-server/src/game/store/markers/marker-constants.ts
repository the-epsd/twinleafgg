/**
 * Centralized marker constants for the PTCG game.
 *
 * Card-specific markers should only be added here when the card implementation
 * actually consumes the shared constant.
 */
export class MarkerConstants {
  public static readonly DAMAGE_DEALT_MARKER = 'DAMAGE_DEALT_MARKER';
  public static readonly KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
  public static readonly CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';

  public static readonly U_TURN_BOARD_MARKER = 'U_TURN_BOARD_MARKER';
  public static readonly RECYCLE_ENERGY_MARKER = 'RECYCLE_ENERGY_MARKER';
  public static readonly ENERGY_GROUNDING_MARKER = 'ENERGY_GROUNDING_MARKER';
  public static readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

}
