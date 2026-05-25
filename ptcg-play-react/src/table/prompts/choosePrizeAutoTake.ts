import type { ChoosePrizePrompt, Player } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';

function opponentHasNoPokemonInPlay(opponent: Player | undefined): boolean {
  if (!opponent) {
    return false;
  }
  if (opponent.active.cards.length > 0) {
    return false;
  }
  return !opponent.bench.some((bench) => bench.cards.length > 0);
}

function prizeTargetPlayer(
  state: LocalGameState['state'],
  prompt: ChoosePrizePrompt,
): Player | undefined {
  const taker = state.players.find((p) => p.id === prompt.playerId);
  if (!taker) {
    return undefined;
  }
  if (prompt.options.useOpponentPrizes) {
    return state.players.find((p) => p.id !== prompt.playerId);
  }
  return taker;
}

/** True when KO prizes should be taken without manual selection. */
export function shouldAutoTakeChoosePrize(
  localGame: LocalGameState,
  prompt: ChoosePrizePrompt,
): boolean {
  const state = localGame.state;
  const taker = state.players.find((p) => p.id === prompt.playerId);
  if (!taker) {
    return false;
  }

  const target = prizeTargetPlayer(state, prompt);
  if (!target) {
    return false;
  }

  const prizeLeft = target.prizes.filter((p) => p.cards.length > 0).length;
  const count = prompt.options.count;
  if (count <= 0 || prizeLeft <= 0) {
    return false;
  }

  if (count >= prizeLeft) {
    return true;
  }

  const takerIndex = state.players.findIndex((p) => p.id === prompt.playerId);
  const opponent = state.players[takerIndex === 0 ? 1 : 0];
  return opponentHasNoPokemonInPlay(opponent);
}

/** Non-empty prize indices for auto-resolving a Choose prize prompt (same order as the bot). */
export function autoTakeChoosePrizeIndices(
  localGame: LocalGameState,
  prompt: ChoosePrizePrompt,
): number[] {
  const target = prizeTargetPlayer(localGame.state, prompt);
  if (!target) {
    return [];
  }
  const available = target.prizes.filter((p) => p.cards.length > 0).length;
  const takeCount = Math.min(prompt.options.count, available);
  return Array.from({ length: takeCount }, (_, i) => i);
}
