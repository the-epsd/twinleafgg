import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SuperType, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, Player, Card, GameError, GameMessage, CardList, ChooseCardsPrompt, PokemonCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: ElectromagneticRadar,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  cards = player.hand.cards.filter((c) => c !== self);
  if (cards.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard], sourceCard: self });

  // prepare card list without this card
  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter((c) => c !== self);

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      handTemp,
      {},
      { min: 2, max: 2, allowCancel: false },
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

  MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: self });

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (
      !(
        card.hasTag(CardTag.POKEMON_GX) ||
        card.hasTag(CardTag.POKEMON_EX) ||
        card.hasTag(CardTag.TAG_TEAM)
      )
    ) {
      blocked.push(index);
    }
  });

  SEARCH_DECK_FOR_CARDS_TO_HAND(
    store,
    state,
    player,
    self,
    { superType: SuperType.POKEMON, cardType: [CardType.LIGHTNING] } as Partial<PokemonCard>,
    { min: 0, max: 2, allowCancel: false, blocked },
  );

  return state;
}

export class ElectromagneticRadar extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '169';
  public name: string = 'Electromagnetic Radar';
  public fullName: string = 'Electromagnetic Radar UNB';
  public text: string =
    'You can play this card only if you discard 2 other cards from your hand. ' +
    'Search your deck for up to 2 in any combination of [L] Pokémon-GX and [L] Pokémon-EX, ' +
    'reveal them, and put them into your hand. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.hand.cards.filter((c) => c !== this).length < 2) {
      return false;
    }
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
