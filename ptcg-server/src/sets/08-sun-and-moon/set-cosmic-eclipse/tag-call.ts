import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { Card } from '../../../game/store/card/card';
import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { StateUtils } from '../../../game/store/state-utils';
import { Player } from '../../../game/store/state/player';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: TagCall,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (!card.hasTag(CardTag.TAG_TEAM)) {
      blocked.push(index);
    }
  });

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      {},
      { min: 0, max: 2, allowCancel: false, blocked },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: self });
  SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);

  return SHUFFLE_DECK(store, state, player);
}

export class TagCall extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '206';
  public name: string = 'Tag Call';
  public fullName: string = 'Tag Call CEC';
  public text: string =
    'Search your deck for up to 2 TAG TEAM cards, reveal them, and put them into your hand. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
