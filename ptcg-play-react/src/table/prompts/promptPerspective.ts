import type { CardTarget } from 'ptcg-server';
import { PlayerType } from 'ptcg-server';

/** Minimal prompt fields needed to resolve answerer vs board perspective. */
export type PromptPerspectiveFields = {
  playerId: number;
  perspectivePlayerId?: number;
};

/** Effect-owner id for board CardTargets (BOTTOM = this player). Defaults to answerer. */
export function getPromptPerspectivePlayerId(prompt: PromptPerspectiveFields): number {
  return prompt.perspectivePlayerId ?? prompt.playerId;
}

/**
 * True when the local client answers prompts for another player's board perspective
 * (e.g. Hypno Hand Control). Visual seats must be swapped vs prompt CardTargets.
 */
export function promptNeedsPerspectiveSwap(
  prompt: PromptPerspectiveFields,
  clientId: number,
): boolean {
  return getPromptPerspectivePlayerId(prompt) !== clientId;
}

export function swapPromptPlayerType(playerType: PlayerType): PlayerType {
  if (playerType === PlayerType.BOTTOM_PLAYER) {
    return PlayerType.TOP_PLAYER;
  }
  if (playerType === PlayerType.TOP_PLAYER) {
    return PlayerType.BOTTOM_PLAYER;
  }
  return playerType;
}

export function remapCardTargetSeat(target: CardTarget): CardTarget {
  return { ...target, player: swapPromptPlayerType(target.player) };
}

export function remapCardTargetsSeat(targets: CardTarget[]): CardTarget[] {
  return targets.map(remapCardTargetSeat);
}
