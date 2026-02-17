import { setupGame, padDeck } from './test-helpers';
import { useAbility, getEnergyCount } from './card-test-helpers';

describe('Eelektrik NVI — Dynamotor', () => {

  it('should attach Lightning Energy from discard to bench', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        bench: [
          { card: 'Eelektrik NVI' },
          { card: 'Ralts SIT' }
        ],
        discard: ['Lightning Energy SVE'],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10),
      }
    });

    const benchEnergyBefore = getEnergyCount(game.state, 0, 0);

    useAbility(game.store, game.state, 0, 'Dynamotor');

    // Lightning Energy should have been attached to a bench Pokemon
    expect(getEnergyCount(game.state, 0, 0)).toBeGreaterThan(benchEnergyBefore);
  });

  it('should throw error when used twice in the same turn', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        bench: [
          { card: 'Eelektrik NVI' },
          { card: 'Ralts SIT' }
        ],
        discard: ['Lightning Energy SVE', 'Lightning Energy SVE'],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10),
      }
    });

    // First use should succeed
    useAbility(game.store, game.state, 0, 'Dynamotor');

    // Second use should throw (once per turn)
    expect(() => {
      useAbility(game.store, game.state, 0, 'Dynamotor');
    }).toThrow();
  });
});
