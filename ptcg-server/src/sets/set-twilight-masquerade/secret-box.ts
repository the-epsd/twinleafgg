import { Card } from '../../game/store/card/card';
import { GameLog, GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { CardList, GameError } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: SecretBox, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const handCards = player.hand.cards.filter(c => c !== effect.trainerCard);
  if (handCards.length < 3) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // Count tools and items separately
  let tools = 0;
  let items = 0;
  let stadiums = 0;
  let supporters = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (c instanceof TrainerCard && c.trainerType === TrainerType.TOOL) {
      tools += 1;
    } else if (c instanceof TrainerCard && c.trainerType === TrainerType.ITEM) {
      items += 1;
    } else if (c instanceof TrainerCard && c.trainerType === TrainerType.STADIUM) {
      stadiums += 1;
    } else if (c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER) {
      supporters += 1;
    } else {
      blocked.push(index);
    }
  });

  // Limit max for each type to 1
  const maxTools = Math.min(tools, 1);
  const maxItems = Math.min(items, 1);
  const maxStadiums = Math.min(stadiums, 1);
  const maxSupporters = Math.min(supporters, 1);

  // Total max is sum of max for each 
  const count = maxTools + maxItems + maxStadiums + maxSupporters;

  // prepare card list without Junk Arm
  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter(c => c !== self);

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    handTemp,
    {},
    { min: 3, max: 3, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.hand.moveCardsTo(cards, player.discard);

  // Pass max counts to prompt options
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 0, max: count, allowCancel: false, blocked, maxTools, maxItems, maxStadiums, maxSupporters }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length === 0) {
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }

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

export class SecretBox extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.ACE_SPEC];

  public regulationMark = 'H';

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '163';

  public name: string = 'Secret Box';

  public fullName: string = 'Secret Box TWM';

  public text: string =
    'You can use this card only if you discard 3 other cards from your hand.' +
    '' +
    'Search your deck for an Item card, a Pokémon Tool card, a Supporter card, and a Stadium card, reveal them, and put them into your hand.Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
