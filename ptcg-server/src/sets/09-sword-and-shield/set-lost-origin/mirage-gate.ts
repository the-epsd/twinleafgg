import { EnergyType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  Player,
  StoreLike,
  State,
  GameError,
  GameMessage,
  SlotType,
} from '../../../game';
import {
  ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class MirageGate extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '163';
  public name: string = 'Mirage Gate';
  public fullName: string = 'Mirage Gate LOR';
  public text: string = `You can use this card only if you have 7 or more cards in the Lost Zone. 

Search your deck for up to 2 basic Energy cards of different types and attach them to your Pokémon in any way you like. Then, shuffle your deck.`;

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.lostzone.cards.length <= 6) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      if (player.lostzone.cards.length <= 6) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON(store, state, player, 2, 2, {
        destinationSlots: [SlotType.BENCH, SlotType.ACTIVE],
        energyFilter: { energyType: EnergyType.BASIC },
        differentTypes: true,
        allowCancel: false,
        min: 0,
      });
    }

    return state;
  }
}
