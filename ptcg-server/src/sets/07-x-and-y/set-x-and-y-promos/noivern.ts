import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';

export class Noivern extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Noibat';
  public cardType: CardType = N;
  public hp: number = 110;
  public weakness = [{ type: Y }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Second Bite',
      cost: [C, C, C],
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 10 more damage for each damage counter on your opponent\'s Active Pokémon.'
    },
    {
      name: 'Sonic Bazooka',
      cost: [P, D, C],
      damage: 60,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 30 more damage and your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'TK6N';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Noivern';
  public fullName: string = 'Noivern TK6N';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Second Bite
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const damageCounters = Math.floor(opponent.active.damage / 10);
      effect.damage += damageCounters * 10;
    }

    // Sonic Bazooka
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 30;
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
      });
    }

    return state;
  }
}
