import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SuperType, EnergyType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { Player } from '../../../game';
import { SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class EnergyRetrieval extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '116';
  public name: string = 'Energy Retrieval';
  public fullName: string = 'Energy Retrieval SUM';
  public text: string = 'Put 2 basic Energy cards from your discard pile into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    // Player needs a Basic Energy in the discard pile
    return player.discard.cards.some(
      (c) => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Player has no Basic Energy in the discard pile
      let basicEnergyCards = 0;
      player.discard.cards.forEach((c) => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
          basicEnergyCards++;
        }
      });
      if (basicEnergyCards === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const min = Math.min(basicEnergyCards, 2);
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min, max: min, allowCancel: true },
      );
    }

    return state;
  }
}
