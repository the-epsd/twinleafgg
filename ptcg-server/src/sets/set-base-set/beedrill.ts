import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { StateUtils } from '../../game';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Beedrill extends PokemonCard {
  public set = 'BS';
  public name = 'Beedrill';
  public fullName = 'Beedrill BS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';

  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType[] = [G];
  public hp: number = 80;
  public evolvesFrom = 'Kakuna';
  public weakness = [{
    type: R
  }];
  public resistance = [{
    type: F,
    value: -30
  }];

  public attacks: Attack[] = [
    {
      name: 'Twineedle',
      cost: [C, C, C],
      damage: 30,
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Poison Sting',
      cost: [G, G, G],
      damage: 40,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => !!r).length;
        effect.damage = 30 * heads;
      });

    }

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    return state;

  }

}