import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  StoreLike,
  State,
  GameError,
  GameMessage,
  Player,
} from '../../../game';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Bianca extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Bianca';
  public fullName: string = 'Bianca EPO';
  public text: string = 'Draw cards until you have 6 cards in your hand.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const cardsInHand = player.hand.cards.filter((c) => c !== this).length;
    const cardsToDraw = Math.max(0, 6 - cardsInHand);
    if (cardsToDraw === 0 || player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const cardsInHand = player.hand.cards.filter((c) => c !== this).length;
      const cardsToDraw = Math.max(0, 6 - cardsInHand);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (cardsToDraw === 0 || player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
    }

    return state;
  }
}
