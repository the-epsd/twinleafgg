import { Card } from '../../game/store/card/card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
    { min: 1, max: 2, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);

    const endTurnEffect = new EndTurnEffect(player);
    store.reduceEffect(state, endTurnEffect);
    return state;

  });
}

export class OrderBox extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'H';
  
  public set: string = 'SV5K';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '61';
  
  public name: string = 'Order Box';
  
  public fullName: string = 'Order Box SV5K';

  public text: string =
    'After you use this card, your turn ends.' +
    '' +
    'Search your deck for up to 2 Item cards, reveal them, and put them into your hand. Then shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
