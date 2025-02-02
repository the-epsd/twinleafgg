import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { CardList } from '../../game/store/state/card-list';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Maintenance, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  cards = player.hand.cards.filter(c => c !== self);
  if (cards.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // prepare card list without Junk Arm
  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter(c => c !== self);

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    handTemp,
    {},
    { min: 2, max: 2, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  player.hand.moveCardsTo(cards, player.deck);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), (order: any[]) => {
    player.deck.applyOrder(order);

    player.deck.moveTo(player.hand, 1);

    player.supporter.moveCardTo(self, player.discard);
  });
}

export class Maintenance extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '83';

  public name: string = 'Maintenance';

  public fullName: string = 'Maintenance BS';

  public text: string =
    'Shuffle 2 of the other cards from your hand into your deck in order to draw a card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
