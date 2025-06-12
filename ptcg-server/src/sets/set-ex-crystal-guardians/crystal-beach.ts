import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class CrystalBeach extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public trainerType = TrainerType.STADIUM;
  public set = 'CG';
  public name = 'Crystal Beach';
  public fullName = 'Crystal Beach CG';

  public text = 'Each Special Energy card that provides 2 or more Energy (both yours and your opponent\'s) now provides only 1 [C] Energy. This isn\'t affected by any Poké-Powers or Poké-Bodies.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (StateUtils.getStadiumCard(state) === this) {

      if (effect instanceof UseStadiumEffect) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }

      // Energies that provide 2 or more provide [C]
      if (effect instanceof CheckProvidedEnergyEffect) {
        effect.energyMap.forEach((value) => {
          if (value.provides.length >= 2) {
            value.provides = [CardType.COLORLESS];
          }
        });
      }
    }

    return state;
  }
}
