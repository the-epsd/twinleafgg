import { setupGame, padDeck } from './test-helpers';
import { playTrainerCard, getEnergyCount } from './card-test-helpers';

describe('Electric Generator (PAF 79)', () => {

  it('should attach Lightning Energy from top of deck to benched Lightning Pokemon', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts (SIT 67)' },
        bench: [{ card: 'Eelektrik (NVI 40)' }],
        hand: ['Electric Generator (PAF 79)'],
        deck: [
          'Lightning Energy (SVE 4)',
          'Lightning Energy (SVE 4)',
          'Water Energy (SVE 3)',
          'Water Energy (SVE 3)',
          'Water Energy (SVE 3)',
          ...padDeck(5),
        ],
      },
      player2: {
        active: { card: 'Ralts (SIT 67)' },
        deck: padDeck(10),
      }
    });

    const benchEnergyBefore = getEnergyCount(game.state, 0, 0);

    playTrainerCard(game.store, game.state, 0, 'Electric Generator (PAF 79)');

    // Should have attached Lightning Energy to the benched Eelektrik
    expect(getEnergyCount(game.state, 0, 0)).toBeGreaterThan(benchEnergyBefore);
  });

  it('should not be playable without Lightning Pokemon on bench', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts (SIT 67)' },
        bench: [{ card: 'Ralts (SIT 67)' }],
        hand: ['Electric Generator (PAF 79)'],
        deck: [
          'Lightning Energy (SVE 4)',
          'Lightning Energy (SVE 4)',
          ...padDeck(8),
        ],
      },
      player2: {
        active: { card: 'Ralts (SIT 67)' },
        deck: padDeck(10),
      }
    });

    // Should throw because there's no Lightning Pokemon on bench
    expect(() => {
      playTrainerCard(game.store, game.state, 0, 'Electric Generator (PAF 79)');
    }).toThrow();
  });
});
