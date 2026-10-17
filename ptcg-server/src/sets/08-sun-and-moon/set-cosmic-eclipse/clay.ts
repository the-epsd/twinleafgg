import { GameError, GameLog, GameMessage, Player } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardToHandEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { CardList } from '../../../game/store/state/card-list';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

export class Clay extends TrainerCard {
  protected _trainerType = TrainerType.SUPPORTER;
  public set = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '188';
  public name = 'Clay';
  public fullName = 'Clay CEC';
  public text =
    'Discard the top 7 cards of your deck. If any of those cards are Item cards, put them into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 7, sourceCard: this });

      // Filter for item cards
      const itemCards = deckTop.cards.filter(
        (c) => c instanceof TrainerCard && c.trainerType === TrainerType.ITEM,
      );

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        // If prevented, just discard the card and return
        return state;
      }

      // Move all cards to discard
      MOVE_CARDS(store, state, deckTop, player.discard, {
        count: deckTop.cards.length,
        sourceCard: this,
      });

      itemCards.forEach((card) => {
        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, {
          name: player.name,
          card: card.name,
        });
      });

      // Move item cards to hand
      MOVE_CARDS(store, state, player.discard, player.hand, { cards: itemCards, sourceCard: this });
    }

    return state;
  }
}
