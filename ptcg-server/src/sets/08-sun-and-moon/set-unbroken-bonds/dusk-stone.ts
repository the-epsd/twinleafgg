import { Card } from '../../../game/store/card/card';
import { CardTarget, PlayerType, SlotType } from '../../../game/store/actions/play-card-action';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, Stage, SuperType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Player } from '../../../game/store/state/player';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardManager } from '../../../game/cards/card-manager';
import { PokemonCardList } from '../../../game/store/state/pokemon-card-list';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { SHUFFLE_DECK, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

const VALID_EVOLUTIONS = [
  'Mismagius',
  'Honchkrow',
  'Chandelure',
  'Aegislash',
  'Mismagius-GX',
  'Honchkrow-GX',
  'Chandelure-GX',
  'Aegislash-GX',
];

// Names of the valid evolution cards that evolve from one of the player's Pokémon in play
function getEvolutionNames(state: State, player: Player): string[] {
  // Look through all known cards to find out if Pokemon can evolve
  const cm = CardManager.getInstance();
  const evolutions = cm.getAllCards().filter((c) => {
    return c instanceof PokemonCard && c.stage !== Stage.BASIC && VALID_EVOLUTIONS.includes(c.name);
  }) as PokemonCard[];

  const evolutionNames: string[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
    if (list.pokemonPlayedTurn - 1 >= state.turn) {
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

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

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
      { min: 0, max: 1, allowCancel: true, blocked },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  // Canceled by user, he didn't found the card in the deck
  if (cards.length === 0) {
    SHUFFLE_DECK(store, state, player);
    return state;
  }

  const evolution = cards[0] as PokemonCard;

  const blocked2: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    if (card.name !== evolution.evolvesFrom) {
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

  // canceled by user or invalid target
  if (targets.length === 0 || targets[0].getPokemonCard() === undefined) {
    SHUFFLE_DECK(store, state, player);
    return state;
  }

  // Evolve Pokemon
  MOVE_CARDS(store, state, player.deck, targets[0], { cards: [evolution], sourceCard: effect.trainerCard });
  targets[0].clearEffects();
  targets[0].pokemonPlayedTurn = state.turn;

  SHUFFLE_DECK(store, state, player);
  return state;
}

export class DuskStone extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '167';
  public name: string = 'Dusk Stone';
  public fullName: string = 'Dusk Stone UNB';
  public text: string =
    'Search your deck for a Mismagius, Honchkrow, Chandelure, or Aegislash, including Pokémon-GX, that evolves from 1 of your Pokémon in play, and put it onto that Pokémon to evolve it. Then, shuffle your deck. You can use this card during your first turn or on a Pokémon that was put into play this turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    // There must be a Pokémon in play that can evolve
    if (getEvolutionNames(state, player).length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
