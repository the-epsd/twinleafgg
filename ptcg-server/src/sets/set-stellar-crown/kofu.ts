import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { Card, CardList, OrderCardsPrompt } from '../../game';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  if (player.hand.cards.length <= 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const deckBottom = new CardList();

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    player.hand,
    {},
    { allowCancel: false, min: 2, max: 2 }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.hand.moveCardsTo(cards, deckBottom);

  return store.prompt(state, new OrderCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARDS_ORDER,
    deckBottom,
    { allowCancel: false },
  ), order => {
    if (order === null) {
      return state;
    }

    deckBottom.applyOrder(order);
    deckBottom.moveTo(player.deck);

    player.deck.moveTo(player.hand, Math.min(4, player.deck.cards.length));

    player.supporter.moveCardTo(effect.trainerCard, player.discard);

  });
}

export class Kofu extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '138';

  public set: string = 'SCR';

  public name: string = 'Kofu';

  public fullName: string = 'Kofu SCR';

  public text: string =
    'Put 2 cards from your hand on the bottom of your deck in any order. If you put 2 cards on the bottom of your deck in this way, draw 4 cards. (If you can\'t put 2 cards from your hand on the bottom of your deck, you can\'t use this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}