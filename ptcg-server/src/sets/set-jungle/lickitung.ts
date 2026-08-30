import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Lickitung extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Tongue Wrap',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }, {
    name: 'Supersonic',
    cost: [C, C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'JU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Lickitung';
  public fullName: string = 'Lickitung JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = COIN_FLIP_PROMPT(store, state, player, results => {
        if (results) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      state = COIN_FLIP_PROMPT(store, state, player, results => {
        if (results) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
      return state;
    }

    return state;
  }
}