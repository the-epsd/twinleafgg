import { GameError, Player, PokemonCard } from '../../../game';
import { GameMessage } from '../../../game/game-message';
import { Card } from '../../../game/store/card/card';
import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardToHandEffect, TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { CLEAN_UP_SUPPORTER, WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { StateUtils } from '../../../game/store/state-utils';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Klara,
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
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      {},
      { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.discard, player.hand, { cards, sourceCard: self });

  if (cards.length > 0) {
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
  }

  CLEAN_UP_SUPPORTER(store, effect, player);
  return state;
}

export class Klara extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '145';
  public name: string = 'Klara';
  public fullName: string = 'Klara CRE';
  public text: string = `Choose 1 or both:

• Put up to 2 Pokémon from your discard pile into your hand.
• Put up to 2 basic Energy cards from your discard pile into your hand.`;

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

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
      const player = effect.player;

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        // If prevented, just discard the card and return
        return state;
      }

      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
