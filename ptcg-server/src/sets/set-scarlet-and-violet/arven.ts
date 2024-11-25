import { Card } from '../../game/store/card/card';
import { GameLog, GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameError } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Arven, effect: TrainerEffect): IterableIterator<State> {
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

  // Count tools and items separately
  let tools = 0; 
  let items = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (c instanceof TrainerCard && c.trainerType === TrainerType.TOOL) {
      tools += 1; 
    } else if (c instanceof TrainerCard && c.trainerType === TrainerType.ITEM) {
      items += 1;
    } else {
      blocked.push(index);
    }
  });

  // Limit max for each type to 1
  const maxTools = Math.min(tools, 1);
  const maxItems = Math.min(items, 1);

  // Total max is sum of max for each 
  const count = maxTools + maxItems; 

  // Pass max counts to prompt options
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_ONE_ITEM_AND_ONE_TOOL_TO_HAND,
    player.deck,
    { },
    { min: 0, max: count, allowCancel: false, blocked, maxTools, maxItems }
  ), selected => {
    cards = selected || [];
    next();
  });
  
  player.deck.moveCardsTo(cards, player.hand);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  

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

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Arven extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '166';

  public name: string = 'Arven';

  public fullName: string = 'Arven SVI';

  public text: string =
    'Search your deck for an Item card and a Pokémon Tool card, reveal them, and put them into your hand. Then, shuffle your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
