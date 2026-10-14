import { GameError, GameMessage, Player, State, StoreLike, TrainerCard } from '../../../game';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class OrderPad extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '131';
  public name: string = 'Order Pad';
  public fullName: string = 'Order Pad UPR';
  public text: string =
    'Flip a coin. If heads, search your deck for an Item card, reveal it, and put it into your hand. Shuffle your deck afterward.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result) {
          const filter: Partial<TrainerCard> = {
            superType: SuperType.TRAINER,
            trainerType: TrainerType.ITEM,
          };
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, filter, {
            min: 0,
            max: 1,
            allowCancel: false,
          });
        }
      });
    }

    return state;
  }
}
