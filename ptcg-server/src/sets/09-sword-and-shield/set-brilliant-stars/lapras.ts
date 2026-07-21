import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';

export class Lapras extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Raging Freeze',
    cost: [W, W, C],
    damage: 110,
    text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Lapras';
  public fullName: string = 'Lapras BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Raging Freeze
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(player, { byAttackDamage: true })) {
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
        store.reduceEffect(state, specialConditionEffect);
      }
      return state;
    }

    return state;
  }
}