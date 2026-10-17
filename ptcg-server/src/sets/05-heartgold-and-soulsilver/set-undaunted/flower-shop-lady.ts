import {
  Card,
  ChooseCardsPrompt,
  EnergyCard,
  GameError,
  GameMessage,
  Player,
  PokemonCard,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { EnergyType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function countFlowerShopTargets(player: Player): { count: number; maxPokemons: number; maxEnergies: number } {
  let pokemons = 0;
  let energies = 0;
  player.discard.cards.forEach((c) => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
      energies += 1;
    } else if (c instanceof PokemonCard) {
      pokemons += 1;
    }
  });
  const maxPokemons = Math.min(pokemons, 3);
  const maxEnergies = Math.min(energies, 3);
  return { count: maxPokemons + maxEnergies, maxPokemons, maxEnergies };
}

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: FlowerShopLady,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const { count, maxPokemons, maxEnergies } = countFlowerShopTargets(player);

  if (count === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });
  effect.preventDefault = true;

  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
      return;
    }
    if (c instanceof PokemonCard) {
      return;
    }
    blocked.push(index);
  });

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.discard,
      {},
      { min: count, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: self });

  if (cards.length > 0) {
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
  }

  return SHUFFLE_DECK(store, state, player);
}

export class FlowerShopLady extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UD';
  public name: string = 'Flower Shop Lady';
  public fullName: string = 'Flower Shop Lady UD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public text: string =
    'Search your discard pile for 3 Pokemon and 3 basic Energy cards. ' +
    'Show them to your opponent and shuffle them into your deck.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return countFlowerShopTargets(player).count > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
