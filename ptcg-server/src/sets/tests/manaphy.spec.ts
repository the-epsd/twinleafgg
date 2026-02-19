import { setupGame, padDeck } from './test-helpers';
import { createDamageEffect, createActiveDamageEffect } from './card-test-helpers';

describe('Manaphy (BRS 41) — Wave Veil', () => {

  it('should prevent bench damage when Manaphy is in play', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts (SIT 67)' },
        bench: [
          { card: 'Ralts (SIT 67)' },
          { card: 'Manaphy (BRS 41)' }
        ],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts (SIT 67)', energy: ['Water Energy (SVE 3)'] },
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
        active: { card: 'Ralts (SIT 67)' },
        bench: [{ card: 'Manaphy (BRS 41)' }],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts (SIT 67)', energy: ['Water Energy (SVE 3)'] },
        deck: padDeck(10),
      }
    });

    // Create damage effect targeting active (the default)
    const effect = createActiveDamageEffect(game, 1);
    game.store.reduceEffect(game.state, effect);

    // Active damage should NOT be prevented
    expect(effect.preventDefault).toBe(false);
  });

  it('should allow bench damage when Manaphy is not in play', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Ralts (SIT 67)' },
        bench: [{ card: 'Ralts (SIT 67)' }],
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts (SIT 67)', energy: ['Water Energy (SVE 3)'] },
        deck: padDeck(10),
      }
    });

    const effect = createDamageEffect(game, 1, { benchIndex: 0 });
    game.store.reduceEffect(game.state, effect);

    // Without Manaphy, bench damage goes through
    expect(effect.preventDefault).toBe(false);
  });
});
