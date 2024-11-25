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

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasPokemon = player.hand.cards.some(c => c.superType === SuperType.POKEMON);

  if (!hasPokemon) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.hand,
    { superType: SuperType.POKEMON },
    { min: 1, max: 2, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length === 0) {
    return;
  }
  // Put Pokemon from hand into the deck
  player.hand.moveCardsTo(cards, player.deck);

  yield store.prompt(state, new ShowCardsPrompt(
    opponent.id,
    GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
    cards
  ), () => next());

  const minMax = cards.length;

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: minMax, max: minMax, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);


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

export class Perrin extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'TWM';

  public name: string = 'Perrin';

  public fullName: string = 'Perrin TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '160';

  public text: string =
    'Reveal up to 2 Pokémon from your hand and shuffle them into your deck. Then, search your deck for up to that many Pokémon, reveal them, and put them into your hand. Then shuffle your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
