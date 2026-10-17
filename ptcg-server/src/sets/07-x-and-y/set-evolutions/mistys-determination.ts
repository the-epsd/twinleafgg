import { Card, CardList, GameError, GameMessage, Player, State, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import {
  MOVE_CARDS,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { CLEAN_UP_SUPPORTER, WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: MistysDetermination,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;

  effect.preventDefault = true;
  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      player.hand,
      {},
      { min: 1, max: 1, allowCancel: false },
    ),
    (selected: Card[]) => {
      if (selected && selected.length > 0) {
        MOVE_CARDS(store, state, player.hand, player.discard, {
          cards: selected,
          sourceCard: self,
        });
      }
      next();
    },
  );

  const topCount = Math.min(8, player.deck.cards.length);
  if (topCount > 0) {
    const deckTop = new CardList();
    MOVE_CARDS(store, state, player.deck, deckTop, { count: topCount, sourceCard: self });

    SHOW_CARDS_TO_PLAYER(store, state, player, deckTop.cards);

    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        {},
        { min: 1, max: 1, allowCancel: false },
      ),
      (selected: Card[]) => {
        if (selected && selected.length > 0) {
          MOVE_CARDS(store, state, deckTop, player.hand, { cards: selected, sourceCard: self });
        }
        MOVE_CARDS(store, state, deckTop, player.deck, { sourceCard: self });
        next();
      },
    );
  }

  SHUFFLE_DECK(store, state, player);
  CLEAN_UP_SUPPORTER(store, effect, player);
  return state;
}

export class MistysDetermination extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'EVO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = "Misty's Determination";
  public fullName: string = "Misty's Determination EVO";
  public text: string =
    'Discard a card from your hand. If you do, look at the top 8 cards of your deck and put 1 of them into your hand. Shuffle the other cards back into your deck. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.hand.cards.filter((c) => c !== this).length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.hand.cards.filter((c) => c !== this).length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
