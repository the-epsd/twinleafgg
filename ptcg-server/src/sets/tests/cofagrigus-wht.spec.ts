import { setupGame, padDeck } from './test-helpers';
import { getDamage, hasSpecialCondition, useAttack } from './card-test-helpers';
import { SpecialCondition } from '../../game/store/card/card-types';
import { CardManager } from '../../game/cards/card-manager';
import { setSV11 } from '../set-black-bolt-white-flare';

describe('Cofagrigus WHT', () => {
  beforeAll(() => {
    try {
      CardManager.getInstance().defineSet(setSV11);
    } catch (error: any) {
      if (!error.message?.startsWith('Multiple cards with the same name')) {
        throw error;
      }
    }
  });

  it('should move all damage counters from one of your Benched Pokemon to an opponent Pokemon', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Cofagrigus WHT', energy: ['Psychic Energy SVE', 'Water Energy SVE'] },
        bench: [{ card: 'Ralts SIT', damage: 50 }],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Cofagrigus WHT' },
        deck: padDeck(10),
      }
    });

    useAttack(game.store, game.state, 0, 'Extended Damagriiigus');

    expect(getDamage(game.state, 0, 0)).toBe(0);
    expect(getDamage(game.state, 1, 'active')).toBe(50);
  });

  it('should confuse the opponent Active Pokemon with Perplex', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: {
          card: 'Cofagrigus WHT',
          energy: ['Psychic Energy SVE', 'Water Energy SVE', 'Water Energy SVE']
        },
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Cofagrigus WHT' },
        deck: padDeck(10),
      }
    });

    useAttack(game.store, game.state, 0, 'Perplex');

    expect(hasSpecialCondition(game.state, 1, 'active', SpecialCondition.CONFUSED)).toBe(true);
  });
});
