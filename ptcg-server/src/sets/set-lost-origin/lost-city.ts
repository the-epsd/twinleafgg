import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { PokemonCardList } from '../..';

export class LostCity extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'F';

  public set: string = 'LOR';

  public set2: string = 'lostorigin';

  public setNumber: string = '161';

  public name: string = 'Lost City';

  public fullName: string = 'Lost City LOR';

  public text: string =
    'Whenever a Pokémon (either yours or your opponent\'s) is Knocked Out, put that Pokémon in the Lost Zone instead of the discard pile. (Discard all attached cards.)';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
      if (effect instanceof KnockOutEffect) {
        const knockedOutPokemonCard = effect.target.getPokemonCard();
        const cardList = StateUtils.findCardList(state, this);
        const owner = StateUtils.findOwner(state, cardList);
        if (knockedOutPokemonCard) {
          if (knockedOutPokemonCard instanceof PokemonCardList) {
            knockedOutPokemonCard.cards.forEach(card => {
              cardList.moveCardTo(card, owner.lostzone);
            });

            return state;
          }
          return state;
        }
        return state;
      }
      return state;
    }
    return state;
  }
}