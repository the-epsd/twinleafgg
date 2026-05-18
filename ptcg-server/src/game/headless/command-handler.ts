import {
  activeTarget,
  createHeadlessGame,
  HeadlessDeckGameConfig,
  HeadlessGameSession,
  HeadlessScenarioConfig
} from './index';

export interface HeadlessCommandRequest {
  id?: string | number;
  type: string;
  payload?: any;
}

export class HeadlessCommandRunner {
  private session: HeadlessGameSession | undefined;

  public handle(request: HeadlessCommandRequest): any {
    const payload = request.payload ?? {};

    switch (request.type) {
      case 'newGame':
        this.session = createHeadlessGame(payload as HeadlessDeckGameConfig);
        return this.session.snapshot();

      case 'setupScenario':
        this.session = createHeadlessGame(payload as HeadlessScenarioConfig);
        return this.session.snapshot();

      case 'state':
        return this.requireSession().snapshot();

      case 'playCard': {
        const game = this.requireSession();
        const playerIndex = this.getPlayerIndex(payload);
        const handIndex = this.findHandIndex(game, playerIndex, payload);
        game.playCard(playerIndex, handIndex, payload.target ?? activeTarget());
        return game.snapshot();
      }

      case 'attack': {
        const game = this.requireSession();
        if (typeof payload.attack !== 'string') {
          throw new Error('attack requires payload.attack');
        }
        game.attack(this.getPlayerIndex(payload), payload.attack);
        return game.snapshot();
      }

      case 'useAbility': {
        const game = this.requireSession();
        if (typeof payload.ability !== 'string') {
          throw new Error('useAbility requires payload.ability');
        }
        game.useAbility(this.getPlayerIndex(payload), payload.ability, payload.target ?? activeTarget());
        return game.snapshot();
      }

      case 'useStadium': {
        const game = this.requireSession();
        game.useStadium(this.getPlayerIndex(payload));
        return game.snapshot();
      }

      case 'concede': {
        const game = this.requireSession();
        game.concede(this.getPlayerIndex(payload));
        return game.snapshot();
      }

      case 'passTurn': {
        const game = this.requireSession();
        const playerIndex = payload.player === undefined && payload.playerIndex === undefined
          ? undefined
          : this.getPlayerIndex(payload);
        game.passTurn(playerIndex);
        return game.snapshot();
      }

      case 'retreat': {
        const game = this.requireSession();
        if (typeof payload.to !== 'number') {
          throw new Error('retreat requires payload.to');
        }
        game.retreat(this.getPlayerIndex(payload), payload.to);
        return game.snapshot();
      }

      case 'resolvePrompt': {
        const game = this.requireSession();
        if (typeof payload.id !== 'number') {
          throw new Error('resolvePrompt requires payload.id');
        }
        game.resolvePrompt(payload.id, payload.result);
        return game.snapshot();
      }

      default:
        throw new Error(`Unknown command: ${request.type}`);
    }
  }

  private requireSession(): HeadlessGameSession {
    if (!this.session) {
      throw new Error('No active headless game. Send newGame or setupScenario first.');
    }
    return this.session;
  }

  private getPlayerIndex(payload: any, fallback?: number): number {
    if (typeof payload?.player === 'number') {
      return payload.player;
    }
    if (typeof payload?.playerIndex === 'number') {
      return payload.playerIndex;
    }
    if (fallback !== undefined) {
      return fallback;
    }
    return 0;
  }

  private findHandIndex(game: HeadlessGameSession, playerIndex: number, payload: any): number {
    if (typeof payload?.handIndex === 'number') {
      return payload.handIndex;
    }
    if (typeof payload?.card === 'string') {
      const player = game.state.players[playerIndex];
      const index = player.hand.cards.findIndex(card => card.fullName === payload.card || card.name === payload.card);
      if (index !== -1) {
        return index;
      }
      throw new Error(`Card not found in hand: ${payload.card}`);
    }
    throw new Error('playCard requires payload.handIndex or payload.card');
  }
}
