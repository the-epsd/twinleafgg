import { CardTag, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { CardManager } from '../../../game/cards/card-manager';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, Card, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, PlayerType, PokemonCard, PokemonCardList, SlotType } from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

// Names of non-EX evolution cards that evolve from any of the player's Pokemon
function getEvolutionNames(player: Player): string[] {
  const cm = CardManager.getInstance();
  const evolutions = cm.getAllCards().filter((c) => {
    return c instanceof PokemonCard && c.stage !== Stage.BASIC && !c.hasTag(CardTag.POKEMON_EX);
  }) as PokemonCard[];

  const evolutionNames: string[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
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
  const evolutionNames = getEvolutionNames(player);

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
      { min: 1, max: 1, allowCancel: true, blocked },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  // Canceled by user, he didn't found the card in the deck
  if (cards.length === 0) {
    return state;
  }

  const evolution = cards[0] as PokemonCard;

  const blocked2: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    if (card.name !== evolution.evolvesFrom && !card.hasTag(CardTag.POKEMON_EX)) {
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
    return state; // canceled by user
  }
  const pokemonCard = targets[0].getPokemonCard();
  if (pokemonCard === undefined) {
    return state; // invalid target?
  }

  // Evolve Pokemon
  MOVE_CARDS(store, state, player.deck, targets[0], {
    cards: [evolution],
    sourceCard: effect.trainerCard,
  });
  targets[0].clearEffects();
  targets[0].pokemonPlayedTurn = state.turn;

  return SHUFFLE_DECK(store, state, player);
}

export class Wally extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'ROS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Wally';
  public fullName: string = 'Wally ROS';
  public text: string =
    'Search your deck for a card that evolves from 1 of your Pokémon (excluding Pokémon-EX) and put it onto that Pokémon. (This counts as evolving that Pokémon.) Shuffle your deck afterward. You can use this card during your first turn or on a Pokémon that was put into play this turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    // There is nothing that can evolve
    if (getEvolutionNames(player).length === 0) {
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

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
