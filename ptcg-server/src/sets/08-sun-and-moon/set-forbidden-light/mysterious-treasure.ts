import {
  Card,
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  PokemonCard,
  State,
  StoreLike,
  TrainerCard,
  pokemonHasCardType,
} from '../../../game';
import { CardType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: MysteriousTreasure,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  if (!self.canPlay(store, state, player)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (
      card instanceof PokemonCard &&
      !pokemonHasCardType(card, CardType.DRAGON) &&
      !pokemonHasCardType(card, CardType.PSYCHIC)
    ) {
      blocked.push(index);
    }
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
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: self });

  SEARCH_DECK_FOR_CARDS_TO_HAND(
    store,
    state,
    player,
    self,
    { superType: SuperType.POKEMON },
    { min: 0, max: 1, allowCancel: false, blocked },
  );
  return state;
}

export class MysteriousTreasure extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '113';
  public name: string = 'Mysterious Treasure';
  public fullName: string = 'Mysterious Treasure FLI';
  public text: string =
    'Discard a card from your hand. If you do, search your deck for a [P] or [N] Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.hand.cards.filter((c) => c !== this).length < 1) {
      return false;
    }
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
