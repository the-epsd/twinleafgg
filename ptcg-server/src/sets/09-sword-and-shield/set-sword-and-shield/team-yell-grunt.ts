import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import {
  TrainerCard,
  StoreLike,
  State,
  StateUtils,
  GameError,
  GameMessage,
  Card,
  CardTarget,
  PokemonCardList,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  Player,
  PlayerType,
  SlotType,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: TeamYellGrunt,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  // Check that opponent has at least one Pokemon with energy
  let hasPokemonWithEnergy = false;
  const blocked: CardTarget[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.energies.cards.length > 0) {
      hasPokemonWithEnergy = true;
    } else {
      blocked.push(target);
    }
  });

  if (!hasPokemonWithEnergy) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard], sourceCard: self });
  effect.preventDefault = true;

  // Player chooses which of opponent's Pokemon to take energy from
  let targets: PokemonCardList[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      PlayerType.TOP_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: false, blocked },
    ),
    (results) => {
      targets = results || [];
      next();
    },
  );

  if (targets.length === 0) {
    MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [self], sourceCard: self });
    return state;
  }

  const target = targets[0];
  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      target.energies,
      {},
      { min: 1, max: 1, allowCancel: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, target, opponent.hand, { cards: cards, sourceCard: self });
  MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [self], sourceCard: self });
  return state;
}

export class TeamYellGrunt extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'D';
  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '184';
  public name: string = 'Team Yell Grunt';
  public fullName: string = 'Team Yell Grunt SSH';
  public text: string =
    "Put an Energy attached to 1 of your opponent's Pokémon into their hand. You may play only 1 Supporter card during your turn.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const opponent = StateUtils.getOpponent(state, player);
    let hasPokemonWithEnergy = false;
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
      if (cardList.energies.cards.length > 0) {
        hasPokemonWithEnergy = true;
      }
    });
    if (!hasPokemonWithEnergy) {
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
