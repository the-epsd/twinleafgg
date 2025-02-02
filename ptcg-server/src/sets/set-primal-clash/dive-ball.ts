import { ShowCardsPrompt, StateUtils } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON, cardType: CardType.WATER },
    { min: 0, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, player.hand);
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });

}
export class DiveBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'PRC';

  public name: string = 'Dive Ball';

  public fullName: string = 'Dive Ball PRC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '125';

  public text: string =
    'Search your deck for a [W] Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
