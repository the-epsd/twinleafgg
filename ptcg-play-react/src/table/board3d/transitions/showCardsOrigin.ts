/** Minimal ShowCardsPrompt fields needed to pick a 3D flight owner. */
export type ShowCardsOriginPrompt = {
  playerId: number;
  message?: unknown;
  sourcePlayerId?: number;
};

/**
 * Who physically owns the revealed cards (whose deck/hand the flight should use).
 * {@link ShowCardsOriginPrompt.playerId} is the viewer, not necessarily the owner.
 */
export function sourcePlayerIdForShowCardsPrompt(
  prompt: ShowCardsOriginPrompt,
  seats: { bottomId?: number; topId?: number },
): number | undefined {
  if (prompt.sourcePlayerId != null) {
    return prompt.sourcePlayerId;
  }
  const msg = String(prompt.message ?? '');
  if (msg.includes('CARDS_SHOWED_BY_THE_OPPONENT')) {
    if (prompt.playerId === seats.bottomId) {
      return seats.topId;
    }
    if (prompt.playerId === seats.topId) {
      return seats.bottomId;
    }
    return seats.topId;
  }
  if (msg.includes('CARDS_SHOWED_BY_EFFECT') || msg.includes('PLAYER_CARDS_REVEALED')) {
    return prompt.playerId;
  }
  return undefined;
}
