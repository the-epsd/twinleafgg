import type { CardTarget } from 'ptcg-server';

export interface Board3dGameActions {
  playCardAction(gameId: number, handIndex: number, target: CardTarget): Promise<void>;
  retreatAction(gameId: number, benchIndex: number): Promise<void>;
  trainerAbility(gameId: number, ability: string, target: CardTarget): Promise<void>;
  energyAbility(gameId: number, ability: string, target: CardTarget): Promise<void>;
  ability(gameId: number, ability: string, target: CardTarget): Promise<void>;
  stadium(gameId: number): Promise<void>;
  attack(gameId: number, attack: string): Promise<void>;
  retreatStart(gameId: number): Promise<void>;
  resolvePrompt(gameId: number, promptId: number, result: unknown): Promise<void>;
}
