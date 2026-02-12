import { setupGame, padDeck } from './test-helpers';
import { createDamageEffect } from './card-test-helpers';

describe('Manaphy BRS — Wave Veil', () => {

  it('should prevent bench damage when Manaphy is in play', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        bench: [
          { card: 'Ralts SIT' },
          { card: 'Manaphy BRS' }
        ],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts SIT', energy: ['Water Energy SVE'] },
        deck: padDeck(10),
      }
    });

    // Simulate player 2 attacking player 1's bench[0]
    const effect = createDamageEffect(game, 1, { benchIndex: 0 });
    game.store.reduceEffect(game.state, effect);

    // Bench damage should be prevented by Manaphy's Wave Veil
    expect(effect.preventDefault).toBe(true);
  });

  it('should NOT prevent damage to active Pokemon', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        bench: [{ card: 'Manaphy BRS' }],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts SIT', energy: ['Water Energy SVE'] },
        deck: padDeck(10),
      }
    });

    // Create damage effect targeting active (the default)
    const effect = createDamageEffect(game, 1);
    game.store.reduceEffect(game.state, effect);

    // Active damage should NOT be prevented
    expect(effect.preventDefault).toBe(false);
  });

  it('should allow bench damage when Manaphy is not in play', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts SIT' },
        bench: [{ card: 'Ralts SIT' }],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts SIT', energy: ['Water Energy SVE'] },
        deck: padDeck(10),
      }
    });

    const effect = createDamageEffect(game, 1, { benchIndex: 0 });
    game.store.reduceEffect(game.state, effect);

    // Without Manaphy, bench damage goes through
    expect(effect.preventDefault).toBe(false);
  });
});
