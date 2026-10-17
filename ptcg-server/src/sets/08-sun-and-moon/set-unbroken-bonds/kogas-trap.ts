import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Player, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { TRAINER_TARGET_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';

export class KogasTrap extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '177';
  public name: string = "Koga's Trap";
  public fullName: string = "Koga's Trap UNB";
  public text: string = "Your opponent's Active Pokémon is now Confused and Poisoned.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // "Played this card" synergy still applies even if the Active blocks the status.
      player.playedKogasTrap = true;

      if (!TRAINER_TARGET_BLOCKED(store, state, player, this, opponent.active)) {
        opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
        opponent.active.addSpecialCondition(SpecialCondition.POISONED);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.playedKogasTrap = false;
    }

    return state;
  }
}
