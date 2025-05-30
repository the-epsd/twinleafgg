import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SpecialEnergyEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class TempleofSinnoh extends TrainerCard {

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '155';

  public trainerType = TrainerType.STADIUM;

  public set = 'ASR';

  public name = 'Temple of Sinnoh';

  public fullName = 'Temple of Sinnoh ASR';

  public text = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide [C] Energy and have no other effect.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (StateUtils.getStadiumCard(state) === this) {

      if (effect instanceof UseStadiumEffect) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }

      const stadiumCardList = StateUtils.findCardList(state, this);
      const stadiumOwner = StateUtils.findOwner(state, stadiumCardList);

      // Negate special energy effect when it is attached to a Pokemon
      if (effect instanceof SpecialEnergyEffect) {
        const targetCard = new TrainerTargetEffect(stadiumOwner, this, effect.attachedTo);
        store.reduceEffect(state, targetCard);
        if (targetCard.target) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }
      }

      // Special energies provide [C]
      if (effect instanceof CheckProvidedEnergyEffect) {
        const targetCard = new TrainerTargetEffect(stadiumOwner, this, effect.source);
        store.reduceEffect(state, targetCard);
        if (targetCard.target) {
          effect.specialEnergiesProvideColorless = true;
        }
      }
    }

    return state;
  }
}
