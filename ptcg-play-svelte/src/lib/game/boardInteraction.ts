import type { CardTarget, GameView, PokemonSlotView, PromptView } from './types';
import { PlayerType, SlotType } from './types';
import { sameTarget } from './targets';

export type PromptIconName =
  | 'coin'
  | 'energy'
  | 'prize'
  | 'cards'
  | 'attack'
  | 'damage'
  | 'shuffle'
  | 'hourglass'
  | 'check';

export type BoardPromptMeta = {
  current: number;
  max: number;
  secondary?: string;
};

export type BoardInteractionStrategy = {
  key: string;
  isEligible: (target: CardTarget) => boolean;
  isSelected: (target: CardTarget) => boolean;
  deltaFor: (target: CardTarget) => number;
  activate: (target: CardTarget) => void;
  reset: () => void;
  confirm: () => void;
  cancel?: () => void;
  readonly title: string;
  readonly hint: string;
  readonly iconName: PromptIconName;
  readonly meta: BoardPromptMeta;
  readonly canReset: boolean;
  readonly canConfirm: boolean;
  readonly allowCancel: boolean;
};

export function includesTarget(targets: CardTarget[], target: CardTarget): boolean {
  return targets.some((item) => sameTarget(item, target));
}

export function playerIndexForTarget(prompt: PromptView, target: CardTarget): number {
  if (target.player === PlayerType.BOTTOM_PLAYER) {
    return prompt.playerIndex;
  }
  if (target.player === PlayerType.TOP_PLAYER) {
    return prompt.playerIndex === 0 ? 1 : 0;
  }
  return prompt.playerIndex;
}

export function slotForTarget(
  game: GameView,
  prompt: PromptView,
  target: CardTarget,
): PokemonSlotView | undefined {
  const player = game.players[playerIndexForTarget(prompt, target)];
  if (!player) {
    return undefined;
  }
  if (target.slot === SlotType.ACTIVE) {
    return player.active;
  }
  if (target.slot === SlotType.BENCH) {
    return player.bench.find((slot) => slot.index === target.index);
  }
  return undefined;
}
