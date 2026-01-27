import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Lilligant extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Petilil';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bemusing Aroma',
      cost: [G],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed and Poisoned. If tails, the Defending Pokémon is now Confused.'
    },
    {
      name: 'Cut',
      cost: [G, C, C],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Lilligant';
  public fullName: string = 'Lilligant EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const specialConditions = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED, SpecialCondition.POISONED]);
          specialConditions.target = opponent.active;
          store.reduceEffect(state, specialConditions);
        } else {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
      });
    }
    return state;
  }
}
