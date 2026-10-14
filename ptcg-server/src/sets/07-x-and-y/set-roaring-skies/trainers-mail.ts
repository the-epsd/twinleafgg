import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player } from '../../../game';
import { LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TrainersMail extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'ROS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = "Trainers' Mail";
  public fullName: string = "Trainers' Mail ROS";
  public text: string =
    'Look at the top 4 cards of your deck. You may reveal a Trainer card ' +
    "you find there (except for Trainers' Mail) and put it into your hand. " +
    'Shuffle the other cards back into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND(store, state, player, 4, 1, {
        filter: { superType: SuperType.TRAINER },
        predicate: (card) => card.name !== "Trainers' Mail",
        revealChosenCards: true,
        sourceCard: this,
      });
    }

    return state;
  }
}
