import { Card, ChooseCardsPrompt, GameError, GameMessage, Player, PokemonCard, State, StateUtils, StoreLike } from '../../../game';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardToHandEffect, TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function buildPokemonDiscardBlocked(discard: { cards: Card[] }): number[] {
  const blocked: number[] = [];
  discard.cards.forEach((c, index) => {
    if (!(c instanceof PokemonCard)) {
      blocked.push(index);
    }
  });
  return blocked;
}

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const discardEffect = new DiscardToHandEffect(player, effect.trainerCard);
  store.reduceEffect(state, discardEffect);
  if (discardEffect.preventDefault) {
    return state;
  }

  const opponentHasPokemon = opponent.discard.cards.some((c) => c instanceof PokemonCard);
  const playerHasPokemon = player.discard.cards.some((c) => c instanceof PokemonCard);

  if (!opponentHasPokemon && !playerHasPokemon) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (opponentHasPokemon) {
    let cards: Card[] = [];
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        opponent,
        GameMessage.CHOOSE_CARD_TO_HAND,
        opponent.discard,
        { superType: SuperType.POKEMON },
        {
          min: 1,
          max: 1,
          allowCancel: false,
          blocked: buildPokemonDiscardBlocked(opponent.discard),
        },
      ),
      (selected) => {
        cards = selected || [];
        next();
      },
    );

    if (cards.length > 0) {
      MOVE_CARDS(store, state, opponent.discard, opponent.hand, {
        cards,
        sourceCard: effect.trainerCard,
      });
    }
  }

  if (playerHasPokemon) {
    let cards: Card[] = [];
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.POKEMON },
        {
          min: 1,
          max: 1,
          allowCancel: false,
          blocked: buildPokemonDiscardBlocked(player.discard),
        },
      ),
      (selected) => {
        cards = selected || [];
        next();
      },
    );

    if (cards.length > 0) {
      MOVE_CARDS(store, state, player.discard, player.hand, {
        cards,
        sourceCard: effect.trainerCard,
      });
    }
  }

  return state;
}

export class BuddyBuddyRescue extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '135';
  public name: string = 'Buddy-Buddy Rescue';
  public fullName: string = 'Buddy-Buddy Rescue BKT';
  public text: string =
    'Each player puts a Pokémon from his or her discard pile into his or her hand. (Your opponent chooses first.)';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    return (
      player.discard.cards.some((c) => c instanceof PokemonCard) ||
      opponent.discard.cards.some((c) => c instanceof PokemonCard)
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
