import { Card, ChooseCardsPrompt, GameError, GameLog, GameMessage, PokemonCard } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class RocketsMission extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Rocket\'s Mission';
  public fullName: string = 'Rocket\'s Mission TRR';

  public text: string =
    'Discard a card from your hand. Then, draw 3 cards. If you discarded a Pokémon that has Dark or Rocket\'s in its name, draw 4 cards instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      let cards: Card[] = [];
      cards = player.hand.cards.filter(c => c !== effect.trainerCard);

      const hasCardInHand = player.hand.cards.some(c => {
        return c instanceof Card;
      });
      if (!hasCardInHand) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      if (cards.length == 1) {
        player.hand.moveCardsTo(player.hand.cards, player.discard);
      }

      if (cards.length > 1) {
        state = store.prompt(state, new ChooseCardsPrompt(
          effect.player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          {},
          { allowCancel: false, min: 1, max: 1 }
        ), cards => {
          cards = cards || [];
          if (cards.length === 0) {
            return;
          }
          let cardsToDraw = 3;

          if (cards[0] instanceof PokemonCard && (cards[0].tags.includes(CardTag.ROCKETS) || cards[0].tags.includes(CardTag.DARK))) {
            cardsToDraw = 4;
          }

          player.hand.moveCardsTo(cards, player.discard);
          cards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
          });

          DRAW_CARDS(player, cardsToDraw);
        });
      }

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      return state;
    }

    return state;
  }
}
