import type { Prompt } from 'ptcg-server';
import type { LocalGameState } from './types/localGameState';

export function activeGamePrompt(
  game: LocalGameState | null | undefined,
  clientId: number,
): Prompt<any> | undefined {
  if (!game?.state?.prompts?.length || !clientId) {
    return undefined;
  }
  return game.state.prompts.find((p) => p.playerId === clientId && p.result === undefined);
}

export function hasUnresolvedGamePrompts(
  game: LocalGameState | null | undefined,
): boolean {
  return !!game?.state?.prompts?.some((p) => p.result === undefined);
}
