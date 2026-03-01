import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Jigglypuff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Sing',
      cost: [C],
      damage: 0,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Double Slap',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '78';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jigglypuff';
  public fullName: string = 'Jigglypuff NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sing
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Double Slap
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = heads * 20;
      });
    }

    return state;
  }
}
