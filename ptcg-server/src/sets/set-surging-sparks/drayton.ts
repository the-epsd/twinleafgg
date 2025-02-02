import { Card } from '../../game/store/card/card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList } from '../../game/store/state/card-list';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { PokemonCard } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  // Count tools and items separately
  let trainers = 0;
  let pokemons = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (c instanceof TrainerCard) {
      trainers += 1;
    } else if (c instanceof PokemonCard) {
      pokemons += 1;
    } else {
      blocked.push(index);
    }
  });

  // Limit max for each type to 1
  const maxTrainers = Math.min(trainers, 1);
  const maxPokemons = Math.min(pokemons, 1);

  // Total max is sum of max for each 
  const count = maxTrainers + maxPokemons;

  const deckTop = new CardList();
  player.deck.moveTo(deckTop, 7);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    deckTop,
    {},
    { min: 0, max: count, allowCancel: false, blocked, maxTrainers, maxPokemons }
  ), selected => {
    cards = selected || [];
    next();
  });

  deckTop.moveCardsTo(cards, player.hand);
  deckTop.moveTo(player.deck);

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

export class Drayton extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '174';

  public name: string = 'Drayton';

  public fullName: string = 'Drayton SV7a';

  public text: string =
    'Look at the top 7 cards of your deck. Choose a Pokémon and a Trainer card from those cards, reveal them, and put them into your hand. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
