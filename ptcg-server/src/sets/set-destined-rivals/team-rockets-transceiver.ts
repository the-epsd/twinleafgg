import { Card } from '../../game/store/card/card';
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
import { GameError } from '../../game/game-error';
import { GameMessage, GameLog } from '../../game/game-message';
import { CLEAN_UP_SUPPORTER, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect, self: Card): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  effect.preventDefault = true;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Create a blocked array for non-Team Rocket Supporter cards
  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (!(card instanceof TrainerCard) ||
      card.trainerType !== TrainerType.SUPPORTER ||
      !card.tags.includes(CardTag.TEAM_ROCKET)) {
      blocked.push(index);
    }
  });

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

  MOVE_CARDS(store, state, player.deck, player.hand, { cards: cards, sourceCard: self });

  cards.forEach((card) => {
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

export class TeamRocketsTransceiver extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.TEAM_ROCKET];

  public regulationMark = 'I';

  public set: string = 'DRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '178';

  public name: string = 'Team Rocket\'s Transceiver';

  public fullName: string = 'Team Rocket\'s Transceiver DRI';

  public text: string =
    'Search your deck for 1 Supporter with "Team Rocket" in its name, reveal it, and put it into your hand. Then shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    return state;
  }
}