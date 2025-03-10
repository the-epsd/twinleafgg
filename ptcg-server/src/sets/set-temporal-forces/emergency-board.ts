import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import {ToolEffect} from '../../game/store/effects/play-card-effects';


export class EmergencyBoard extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '159';

  public name: string = 'Rescue Board';

  public fullName: string = 'Rescue Board TEF';

  public text: string = 'The Retreat Cost of the Pokémon this card is attached to is [C] less. If that Pokémon\'s remaining HP is 30 or less, it has no Retreat Cost.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.tools.includes(this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      // Try to reduce ToolEffect, to check if something is blocking the tool from working
      try {
        const stub = new ToolEffect(effect.player, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (pokemonCard) {
        const remainingHp = pokemonCard.hp - player.active.damage;
        if (remainingHp <= 30) {
          effect.cost = [];
        } else {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }
      return state;
    }
    return state;
  }
}