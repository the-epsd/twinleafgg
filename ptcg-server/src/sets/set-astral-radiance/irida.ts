import { Card } from '../../game/store/card/card';
import { GameLog, GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType, isCoreFormat } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { GameError } from '../../game';
import { CLEAN_UP_SUPPORTER, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Irida, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // Determine format
  const format = (store as any).handler.format;

  // Count pokemons and items/tools separately
  let pokemons = 0;
  let itemsOrTools = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (c instanceof PokemonCard && c.cardType === CardType.WATER) {
      pokemons += 1;
    } else if (c instanceof TrainerCard && (c.trainerType === TrainerType.ITEM || (!isCoreFormat(format) && c.trainerType === TrainerType.TOOL))) {
      itemsOrTools += 1;
    } else {
      blocked.push(index);
    }
  });

  // Limit max for each type to 1
  const maxPokemons = Math.min(pokemons, 1);
  const maxItemsOrTools = Math.min(itemsOrTools, 1);

  // Total max is sum of max for each 
  const count = maxPokemons + maxItemsOrTools;

  // Pass max counts to prompt options
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxItems: maxItemsOrTools }
  ), selected => {
    cards = selected || [];
    next();
  });

  MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: self });
  CLEAN_UP_SUPPORTER(effect, player);


  cards.forEach((card, index) => {
    store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }
  CLEAN_UP_SUPPORTER(effect, player);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Irida extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '147';

  public name: string = 'Irida';

  public fullName: string = 'Irida ASR';

  public text: string =
    'Search your deck for a W Pokemon and an Item ' +
    'card, reveal them, and put them into your hand. ' +
    'Then, shuffle your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
