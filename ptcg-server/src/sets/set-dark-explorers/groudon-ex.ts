import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class GroudonEx extends PokemonCard {

  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = F;

  public hp: number = 180;

  public weakness = [{ type: W }];

  public resistance = [{ type: L, value: -20 }];

  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Tromp',
      cost: [F, C],
      damage: 20,
      text: 'Does 10 damage to each of your opponent\'s Benched Pokémon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Giant Claw',
      cost: [F, F, C],
      damage: 80,
      damageCalculation: '+',
      text: 'If the Defending Pokémon already has 2 or more damage counters on it, ' +
        'this attack does 40 more damage.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Groudon-EX';
  public fullName: string = 'Groudon EX DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Tromp - 20 damage + 10 to each of opponent's Benched Pokémon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      opponent.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          const damageEffect = new PutDamageEffect(effect, 10);
          damageEffect.target = benchSlot;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    // Giant Claw - 80 damage, +40 if Defending Pokémon has 2+ damage counters
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      // 2 damage counters = 20 damage
      if (opponent.active.damage >= 20) {
        effect.damage += 40;
      }
    }

    return state;
  }

}
