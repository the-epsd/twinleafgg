import { GamePhase } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { preventDamageEffect } from '../../game/store/effects/effect-of-attack-effects';
import { setupGame, padDeck } from './test-helpers';
import { createDamageEffect, getDamage } from './card-test-helpers';

describe('PREVENT_DAMAGE — PreventDamageEffect vs Mist Energy', () => {
  it('should apply self-protection even when the defending Pokemon has Mist Energy attached', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts SIT', energy: ['Psychic Energy SVE'] },
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts SIT', energy: ['Mist Energy TEF', 'Psychic Energy SVE'] },
        deck: padDeck(10),
      },
    });

    const attacker = game.state.players[0];
    const defender = game.state.players[1];
    const attack = { name: 'Test Attack', cost: [], damage: 0, text: '' };
    const attackEffect = new AttackEffect(attacker, defender, attack);
    attackEffect.source = attacker.active;

    const sourceCard = attacker.active.getPokemonCard();
    if (!sourceCard) {
      throw new Error('Expected an attacking Pokemon');
    }

    const preventEffect = preventDamageEffect(attackEffect, sourceCard);
    game.store.reduceEffect(game.state, preventEffect);

    expect(attacker.active.preventDamageNextTurnPending).not.toBeNull();
    expect(attacker.active.preventDamageNextTurn).toBeNull();
  });

  it('should block damage from a Basic Pokemon during the opponent next turn', () => {
    const game = setupGame({
      turn: 2,
      player1: {
        active: { card: 'Ralts SIT', energy: ['Psychic Energy SVE'] },
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts SIT', energy: ['Mist Energy TEF', 'Psychic Energy SVE'] },
        deck: padDeck(10),
      },
    });

    const attacker = game.state.players[0];
    const defender = game.state.players[1];
    const attack = { name: 'Test Attack', cost: [], damage: 0, text: '' };
    const attackEffect = new AttackEffect(attacker, defender, attack);
    attackEffect.source = attacker.active;

    const sourceCard = attacker.active.getPokemonCard();
    if (!sourceCard) {
      throw new Error('Expected an attacking Pokemon');
    }

    game.store.reduceEffect(game.state, preventDamageEffect(attackEffect, sourceCard));
    game.store.reduceEffect(game.state, new EndTurnEffect(attacker));

    expect(attacker.active.preventDamageNextTurn).not.toBeNull();

    game.state.phase = GamePhase.ATTACK;
    const damageEffect = createDamageEffect(game, 1, { damage: 200 });
    game.store.reduceEffect(game.state, damageEffect);

    expect(getDamage(game.state, 0)).toBe(0);

    game.store.reduceEffect(game.state, new EndTurnEffect(defender));
    expect(attacker.active.preventDamageNextTurn).toBeNull();
  });
});
