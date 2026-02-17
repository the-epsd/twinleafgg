import { setupGame, padDeck } from './test-helpers';
import { playTrainerCard, getEnergyCount } from './card-test-helpers';

describe('Electric Generator PAF', () => {

  it('should attach Lightning Energy from top of deck to benched Lightning Pokemon', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        bench: [{ card: 'Eelektrik NVI' }],
        hand: ['Electric Generator PAF'],
        deck: [
          'Lightning Energy SVE',
          'Lightning Energy SVE',
          'Water Energy SVE',
          'Water Energy SVE',
          'Water Energy SVE',
          ...padDeck(5),
        ],
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10),
      }
    });

    const benchEnergyBefore = getEnergyCount(game.state, 0, 0);

    playTrainerCard(game.store, game.state, 0, 'Electric Generator PAF');

    // Should have attached Lightning Energy to the benched Eelektrik
    expect(getEnergyCount(game.state, 0, 0)).toBeGreaterThan(benchEnergyBefore);
  });

  it('should not be playable without Lightning Pokemon on bench', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        bench: [{ card: 'Ralts SIT' }],
        hand: ['Electric Generator PAF'],
        deck: [
          'Lightning Energy SVE',
          'Lightning Energy SVE',
          ...padDeck(8),
        ],
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10),
      }
    });

    // Should throw because there's no Lightning Pokemon on bench
    expect(() => {
      playTrainerCard(game.store, game.state, 0, 'Electric Generator PAF');
    }).toThrow();
  });
});
