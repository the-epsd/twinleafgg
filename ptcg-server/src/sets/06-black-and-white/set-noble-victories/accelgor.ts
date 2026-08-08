import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, AFTER_ATTACK } from '../../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import {
  DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON,
  SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK
} from '../../../game/store/prefabs/attack-effects';

export class Accelgor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shelmet';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [{
    name: 'Acid Spray',
    cost: [G],
    damage: 20,
    text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
  }, {
    name: 'Deck and Cover',
    cost: [C, C],
    damage: 50,
    text: 'The Defending Pokémon is now Paralyzed and Poisoned. Shuffle this Pokémon and all cards attached to it into your deck.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Accelgor';
  public fullName: string = 'Accelgor NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Acid Spray
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    // Deck and Cover
    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Apply special conditions
      const addSpecialCondition = new AddSpecialConditionsEffect(effect, [
        SpecialCondition.PARALYZED,
        SpecialCondition.POISONED
      ]);
      store.reduceEffect(state, addSpecialCondition);
    }

    // Shuffle this Pokémon and all attached cards into deck (after attack)
    if (AFTER_ATTACK(effect, 1, this)) {
      return SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
    }

    return state;
  }
}
