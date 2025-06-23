import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, Stage, TrainerType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';
import { Card } from '../../game/store/card/card';


function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const blocked: number[] = [];
  let hasMegaEx = false;
  player.deck.cards.forEach((card, index) => {
    if (card instanceof PokemonCard && card.stage === Stage.MEGA && card.tags.includes(CardTag.POKEMON_ex)) {
      hasMegaEx = true;
    } else {
      blocked.push(index);
    }
  });

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 0, max: 1, allowCancel: false, blocked }
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

  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class MegaSignal extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'M1S';
  public regulationMark = 'I';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Signal';
  public fullName: string = 'Mega Signal M1S';
  public text: string = 'Search your deck for 1 Mega Evolution Pokémon ex, reveal it, and put it into your hand. Then shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
} 