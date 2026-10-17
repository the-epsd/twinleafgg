import { CardType, EnergyType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import {
  GameMessage,
  State,
  StoreLike,
  TrainerCard,
  Card,
  CardList,
  ChooseCardsPrompt,
  EnergyCard,
  GameError,
  PokemonCard,
  Player,
  StateUtils,
  pokemonHasCardType,
} from '../../../game';
import {
  MOVE_CARDS,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Candice,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const deckTop = new CardList();
  MOVE_CARDS(store, state, player.deck, deckTop, { count: 7, sourceCard: self });

  let pokemons = 0;
  let energies = 0;
  const blocked: number[] = [];
  deckTop.cards.forEach((c, index) => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Water Energy') {
      energies += 1;
    } else if (c instanceof PokemonCard && pokemonHasCardType(c, CardType.WATER)) {
      pokemons += 1;
    } else {
      blocked.push(index);
    }
  });

  const maxPokemons = Math.min(pokemons, 7);
  const maxEnergies = Math.min(energies, 7);
  const count = 7;

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      deckTop,
      {},
      { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, deckTop, player.hand, { cards: cards, sourceCard: self });
  MOVE_CARDS(store, state, deckTop, player.deck, { sourceCard: self });

  SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);

  return SHUFFLE_DECK(store, state, player);
}

export class Candice extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'F';
  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '152';
  public name: string = 'Candice';
  public fullName: string = 'Candice SIT';
  public text: string =
    'Look at the top 7 cards of your deck. You may reveal any number of [W] Pokémon and [W] Energy cards you find there and put them into your hand. Shuffle the other cards back into your deck.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
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
