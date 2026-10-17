import { TrainerType, EnergyType, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import {
  Card,
  GameMessage,
  TrainerCard,
  StoreLike,
  State,
  StateUtils,
  ChooseCardsPrompt,
  GameError,
  Player,
  PokemonCard,
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
  self: OrdinaryRod,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const pokemonAndEnergyInDiscardPile = player.discard.cards.filter(
    (c) =>
      c instanceof PokemonCard ||
      (c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC),
  ).length;

  if (pokemonAndEnergyInDiscardPile === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let pokemons = 0;
  let energies = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    if (c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC) {
      energies += 1;
    } else if (c instanceof PokemonCard) {
      pokemons += 1;
    } else {
      blocked.push(index);
    }
  });

  const maxPokemons = Math.min(pokemons, 2);
  const maxEnergies = Math.min(energies, 2);
  const count = maxPokemons + maxEnergies;

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.discard,
      {},
      { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.discard, player.deck, { cards: cards, sourceCard: self });

  SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);

  return SHUFFLE_DECK(store, state, player);
}

export class OrdinaryRod extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'D';
  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '171';
  public name: string = 'Ordinary Rod';
  public fullName: string = 'Ordinary Rod SSH';
  public text: string = `Choose 1 or both:

  • Shuffle up to 2 Pokémon from your discard pile into your deck.
  • Shuffle up to 2 basic Energy cards from your discard pile into your deck.`;

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const pokemonAndEnergyInDiscardPile = player.discard.cards.filter(
      (c) =>
        c instanceof PokemonCard ||
        (c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC),
    ).length;

    if (pokemonAndEnergyInDiscardPile === 0) {
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
