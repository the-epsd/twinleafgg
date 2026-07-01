import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { RetreatStartEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { setupGame, padDeck } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('BLOCK_RETREAT — Umbreon V Mean Look', () => {
  it('should block retreat during opponent next turn via RetreatStartEffect', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Umbreon V EVS', energy: ['Darkness Energy SVE'] },
        bench: [{ card: 'Ralts SIT' }],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts SIT', energy: ['Psychic Energy SVE'] },
        bench: [{ card: 'Ralts SIT' }],
        deck: padDeck(10),
      },
    });

    useAttack(game.store, game.state, 0, 'Mean Look');
    expect(game.state.players[1].active.cannotRetreatNextTurn).toBe(true);

    let blocked = false;
    try {
      game.store.reduceEffect(game.state, new RetreatStartEffect(game.state.players[1]));
    } catch (error) {
      blocked = error instanceof GameError && (error as GameError).message === GameMessage.BLOCKED_BY_EFFECT;
    }
    expect(blocked).toBe(true);

    game.store.reduceEffect(game.state, new EndTurnEffect(game.state.players[1]));
    expect(game.state.players[1].active.cannotRetreatNextTurn).toBe(false);

    let stillBlocked = false;
    try {
      game.store.reduceEffect(game.state, new RetreatStartEffect(game.state.players[1]));
    } catch (error) {
      stillBlocked = error instanceof GameError && (error as GameError).message === GameMessage.BLOCKED_BY_EFFECT;
    }
    expect(stillBlocked).toBe(false);
  });
});
