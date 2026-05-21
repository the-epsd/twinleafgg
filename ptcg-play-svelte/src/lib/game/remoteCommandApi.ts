import type { GameCommandApi } from './gameApi';
import type { CardTarget, EngineResponse } from './types';

type RemoteActionEmitter = {
  emitGameAction(event: string, data: Record<string, unknown>): Promise<EngineResponse>;
};

export class RemoteCommandApi implements GameCommandApi {
  constructor(private readonly session: RemoteActionEmitter) {}

  playCard(_playerIndex: number, handIndex: number, target: CardTarget): Promise<EngineResponse> {
    return this.session.emitGameAction('game:action:playCard', { handIndex, target });
  }

  attack(_playerIndex: number, attack: string): Promise<EngineResponse> {
    return this.session.emitGameAction('game:action:attack', { attack });
  }

  useAbility(_playerIndex: number, ability: string, target: CardTarget): Promise<EngineResponse> {
    return this.session.emitGameAction('game:action:ability', { ability, target });
  }

  concede(_playerIndex: number): Promise<EngineResponse> {
    return this.session.emitGameAction('game:concede', {});
  }

  retreat(_playerIndex: number, to: number): Promise<EngineResponse> {
    return this.session.emitGameAction('game:action:retreat', { to });
  }

  passTurn(_playerIndex: number): Promise<EngineResponse> {
    return this.session.emitGameAction('game:action:passTurn', {});
  }

  resolvePrompt(id: number, result: unknown): Promise<EngineResponse> {
    return this.session.emitGameAction('game:action:resolvePrompt', { id, result });
  }
}
