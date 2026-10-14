import { Card, ChooseCardsPrompt, GameMessage, Player, State, StoreLike, TrainerCard } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  BLOCK_IF_DECK_EMPTY,
  DRAW_CARDS_UNTIL_CARDS_IN_HAND,
  MOVE_CARDS,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Sightseer extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '189';
  public name: string = 'Sightseer';
  public fullName: string = 'Sightseer LOT';
  public text: string =
    'You may discard any number of cards from your hand. Then, draw cards until you have 5 cards in your hand. ' +
    "If you can't draw any cards in this way, you can't play this card.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      BLOCK_IF_DECK_EMPTY(player);

      // Move Sightseer out of the hand so it isn't counted or discarded
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      state = store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          {},
          {
            min: Math.max(0, player.hand.cards.length - 4),
            max: player.hand.cards.length,
            allowCancel: false,
          },
        ),
        (selected) => {
          const cards: Card[] = selected || [];
          if (cards.length > 0) {
            MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
          }
          DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 5);
        },
      );
    }

    return state;
  }
}
