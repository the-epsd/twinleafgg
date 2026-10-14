import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SpecialCondition, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import {
  COIN_FLIP_PROMPT,
  MOVE_CARDS,
} from '../../../game/store/prefabs/prefabs';
import { TRAINER_TARGET_BLOCKED } from '../../../game/store/prefabs/trainer-target';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
  trainerCard: HypnotoxicLaser,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const active = opponent.active;

  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: effect.trainerCard,
  });

  if (TRAINER_TARGET_BLOCKED(store, state, player, trainerCard, active)) {
    return state;
  }

  active.addSpecialCondition(SpecialCondition.POISONED);

  let coinResult: boolean = false;
  yield COIN_FLIP_PROMPT(store, state, player, (result) => {
    coinResult = result;
    next();
  });

  if (coinResult === false) {
    return state;
  }

  active.addSpecialCondition(SpecialCondition.ASLEEP);
  return state;
}

export class HypnotoxicLaser extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  protected _tags = [CardTag.TEAM_PLASMA];
  public set: string = 'PLS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '123';
  public name: string = 'Hypnotoxic Laser';
  public fullName: string = 'Hypnotoxic Laser PLS';
  public text: string =
    "Your opponent's Active Pokemon is now Poisoned. Flip a coin. If heads, your opponent's Active Pokemon is also Asleep.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    const active = opponent.active;
    const isPoisoned = active.specialConditions.includes(SpecialCondition.POISONED);
    const isAsleep = active.specialConditions.includes(SpecialCondition.ASLEEP);

    if (isPoisoned && isAsleep) {
      return false;
    }

    if (TRAINER_TARGET_BLOCKED(store, state, player, this, active)) {
      return false;
    }

    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const active = opponent.active;
      const isPoisoned = active.specialConditions.includes(SpecialCondition.POISONED);
      const isAsleep = active.specialConditions.includes(SpecialCondition.ASLEEP);

      if (isPoisoned && isAsleep) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const generator = playCard(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    return state;
  }
}
