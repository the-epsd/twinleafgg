import { GameError, GameMessage, Player, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { PlayerType, SlotType } from '../../../game/store/actions/play-card-action';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_POKEMON_OFF_BOARD } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';

function pickUpBenchedPokemon(
  next: Function,
  store: StoreLike,
  state: State,
  player: Player,
  sourceCard: TrainerCard,
): State {
  return store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH],
      { allowCancel: false },
    ),
    (selection) => {
      const cardList = selection[0];
      MOVE_POKEMON_OFF_BOARD(store, state, cardList, {
        pokemonDestination: player.hand,
        sourceCard,
      });
      next();
    },
  );
}

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const playerHasBench = player.bench.some((b) => b.cards.length > 0);
  const opponentHasBench = opponent.bench.some((b) => b.cards.length > 0);

  if (!playerHasBench && !opponentHasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (playerHasBench) {
    yield pickUpBenchedPokemon(next, store, state, player, effect.trainerCard);
  }

  if (opponentHasBench) {
    yield pickUpBenchedPokemon(next, store, state, opponent, effect.trainerCard);
  }

  return state;
}

function hasBenchedPokemon(store: StoreLike, state: State, player: Player): boolean {
  const opponent = StateUtils.getOpponent(state, player);
  return (
    player.bench.some((b) => b.cards.length > 0) ||
    opponent.bench.some((b) => b.cards.length > 0)
  );
}

export class Seeker extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Seeker';
  public fullName: string = 'Seeker TRM';
  public text: string =
    'Each player returns 1 of his or her Benched Pokemon and all cards ' +
    'attached to it to his or her hand. (You return your Pokemon first.)';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return hasBenchedPokemon(store, state, player);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (!hasBenchedPokemon(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
