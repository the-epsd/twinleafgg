import { Card, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, GameError, GameMessage, Player, PlayerType, PokemonCard, PokemonCardList, SlotType, State, StoreLike } from '../../../game';
import { CardManager } from '../../../game/cards/card-manager';
import { Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

// Names of cards that evolve from 1 of the player's Pokémon (excluding Pokémon put into play this turn)
function getEvolutionNames(state: State, player: Player): string[] {
  const cm = CardManager.getInstance();
  const evolutions = cm.getAllCards().filter((c) => {
    return c instanceof PokemonCard && c.stage !== Stage.BASIC;
  }) as PokemonCard[];

  const evolutionNames: string[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    if (list.pokemonPlayedTurn >= state.turn) {
      return;
    }
    const valid = evolutions.filter((e) => e.evolvesFrom === card.name);
    valid.forEach((c) => {
      if (!evolutionNames.includes(c.name)) {
        evolutionNames.push(c.name);
      }
    });
  });
  return evolutionNames;
}

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  if (state.turn <= 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Build possible evolution card names
  const evolutionNames = getEvolutionNames(state, player);

  // There is nothing that can evolve
  if (evolutionNames.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Blocking pokemon cards, that cannot be valid evolutions
  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (card instanceof PokemonCard && !evolutionNames.includes(card.name)) {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_EVOLVE,
      player.deck,
      { superType: SuperType.POKEMON },
      { min: 0, max: 1, allowCancel: false, blocked },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length === 0) {
    return state; // canceled by user
  }

  const evolution = cards[0] as PokemonCard;

  const blocked2: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    if (card.name !== evolution.evolvesFrom || list.pokemonPlayedTurn === state.turn) {
      blocked2.push(target);
    }
  });

  let targets: PokemonCardList[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: false, blocked: blocked2 },
    ),
    (selection) => {
      targets = selection || [];
      next();
    },
  );

  if (targets.length === 0) {
    return SHUFFLE_DECK(store, state, player); // canceled by user
  }
  const pokemonCard = targets[0].getPokemonCard();
  if (pokemonCard === undefined) {
    return state; // invalid target?
  }

  // Evolve Pokemon
  MOVE_CARDS(store, state, player.deck, targets[0], { cards: [evolution], sourceCard: effect.trainerCard });
  targets[0].clearEffects();
  targets[0].pokemonPlayedTurn = state.turn;

  return SHUFFLE_DECK(store, state, player);
}

export class Evosoda extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '116';
  public name: string = 'Evosoda';
  public fullName: string = 'Evosoda XY';
  public text: string = "Search your deck for a card that evolves from 1 of your Pokémon and put it onto that Pokémon. (This counts as evolving that Pokémon.) Shuffle your deck afterward. You can't use this card during your first turn or on a Pokémon that was put into play this turn.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (state.turn <= 2) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    return getEvolutionNames(state, player).length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
