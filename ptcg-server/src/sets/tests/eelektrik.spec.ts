import { setupGame, padDeck } from './test-helpers';
import { useAbility, getEnergyCount } from './card-test-helpers';

describe('Eelektrik (NVI 40) — Dynamotor', () => {

  it('should attach Lightning Energy from discard to bench', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts (SIT 67)' },
        bench: [
          { card: 'Eelektrik (NVI 40)' },
          { card: 'Ralts (SIT 67)' }
        ],
        discard: ['Lightning Energy (SVE 4)'],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts (SIT 67)' },
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
        active: { card: 'Ralts (SIT 67)' },
        bench: [
          { card: 'Eelektrik (NVI 40)' },
          { card: 'Ralts (SIT 67)' }
        ],
        discard: ['Lightning Energy (SVE 4)', 'Lightning Energy (SVE 4)'],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts (SIT 67)' },
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
