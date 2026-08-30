import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Tentacruel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tentacool';
  public cardType: CardType[] = [W];
  public hp: number = 60;
  public weakness = [{ type: L }];

  public attacks = [{
    name: 'Supersonic',
    cost: [W],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }, {
    name: 'Jellyfish Sting',
    cost: [W, W],
    damage: 10,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Tentacruel';
  public fullName: string = 'Tentacruel FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, flipResult => {
          if (flipResult) {
            const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
          }
        });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}