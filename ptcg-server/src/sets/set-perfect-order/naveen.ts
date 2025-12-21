import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CLEAN_UP_SUPPORTER, DRAW_CARDS_UNTIL_CARDS_IN_HAND, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { CardList } from '../../game/store/state/card-list';
import { ChooseCardsPrompt } from '../../game';

export class Naveen extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Naveen';
  public fullName: string = 'Naveen M3';
  public text: string = 'Discard any number of cards from your hand. Then, draw cards until you have 5 cards in your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const handTemp = new CardList();
      handTemp.cards = player.hand.cards.filter(c => c !== this);

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        handTemp,
        {},
        { min: 0, max: player.hand.cards.length, allowCancel: false }
      ), selected => {
        selected = selected || [];
        MOVE_CARDS(store, state, player.hand, player.discard, { cards: selected });
        DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 5);
        CLEAN_UP_SUPPORTER(effect, player);
      });
      return state;
    }
    return state;
  }
}