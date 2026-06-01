import type { CardTarget, EngineResponse } from './types';

export type GameCommandApi = {
  playCard(playerIndex: number, handIndex: number, target: CardTarget): Promise<EngineResponse>;
  attack(playerIndex: number, attack: string): Promise<EngineResponse>;
  useAbility(playerIndex: number, ability: string, target: CardTarget): Promise<EngineResponse>;
  useStadium(playerIndex: number): Promise<EngineResponse>;
  concede(playerIndex: number): Promise<EngineResponse>;
  retreat(playerIndex: number, to: number): Promise<EngineResponse>;
  passTurn(playerIndex: number): Promise<EngineResponse>;
  resolvePrompt(id: number, result: unknown): Promise<EngineResponse>;
};
