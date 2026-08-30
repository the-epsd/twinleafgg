
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';

import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Chinchou extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Thunder Wave',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }, {
    name: 'Lightning Ball',
    cost: [L, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'LOT';
  public name: string = 'Chinchou';
  public fullName: string = 'Chinchou LOT';
  public setNumber: string = '73';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
          return state;
        }
      });
    }

    return state;
  }

}