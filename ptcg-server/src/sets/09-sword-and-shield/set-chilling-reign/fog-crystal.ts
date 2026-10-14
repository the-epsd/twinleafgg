import { Card } from '../../../game/store/card/card';
import { GameMessage } from '../../../game/game-message';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import {
  CardType,
  EnergyType,
  Stage,
  SuperType,
  TrainerType,
} from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { StateUtils } from '../../../game/store/state-utils';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { Player, PokemonCard, pokemonHasCardType } from '../../../game';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
  self: Card,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  let pokemons = 0;
  let trainers = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (
      c.superType === SuperType.ENERGY &&
      c.energyType === EnergyType.BASIC &&
      c.name === 'Psychic Energy'
    ) {
      trainers += 1;
    } else if (
      c instanceof PokemonCard &&
      pokemonHasCardType(c, CardType.PSYCHIC) &&
      c.stage === Stage.BASIC
    ) {
      pokemons += 1;
    } else {
      blocked.push(index);
    }
  });

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });

  const maxPokemons = Math.min(pokemons, 1);
  const maxTrainers = Math.min(trainers, 1);
  const count = maxPokemons || maxTrainers;

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      {},
      { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxTrainers },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: self });

  if (cards.length > 0) {
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
  }

  return SHUFFLE_DECK(store, state, player);
}

export class FogCrystal extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '140';
  public name: string = 'Fog Crystal';
  public fullName: string = 'Fog Crystal CRE';
  public text: string =
    'Search your deck for a [P] Energy card or a Basic [P] Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    return state;
  }
}
