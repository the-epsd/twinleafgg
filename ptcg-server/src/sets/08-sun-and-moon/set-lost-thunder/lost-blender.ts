import {
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LostBlender extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '181';
  public name: string = 'Lost Blender';
  public fullName: string = 'Lost Blender LOT';
  public text: string = 'Put 2 cards from your hand in the Lost Zone. If you do, draw a card.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    // Need 2 other cards in hand to put in the Lost Zone
    return player.hand.cards.filter((c) => c !== this).length >= 2;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          {},
          { min: 2, max: 2, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];

          // Operation canceled by the user
          if (cards.length === 0) {
            return state;
          }

          MOVE_CARDS(store, state, player.hand, player.lostzone, {
            cards,
            sourceCard: this,
          });
          DRAW_CARDS(store, state, player, 1);
        },
      );
    }

    return state;
  }
}
