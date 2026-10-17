import { GameError, Player } from '../../../game';
import { GameMessage } from '../../../game/game-message';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { SupporterEffect } from '../../../game/store/effects/play-card-effects';
import {
  GUST_OPPONENT_BENCHED_POKEMON,
  SWITCH_ACTIVE_WITH_BENCHED,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { StateUtils } from '../../../game/store/state-utils';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

export class Guzma extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '115';
  public name: string = 'Guzma';
  public fullName: string = 'Guzma BUS';
  public text: string =
    "Switch 1 of your opponent's Benched Pokémon with their Active Pokémon. If you do, switch your Active Pokémon with 1 of your Benched Pokémon.";

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

      // Nothing to do when the opponent has an empty bench
      const opponentHasBench = opponent.bench.some((b) => b.cards.length > 0);
      if (!opponentHasBench) {
        return state;
      }

      try {
        const supporterEffect = new SupporterEffect(player, effect.trainerCard);
        store.reduceEffect(state, supporterEffect);
      } catch {
        return state;
      }

      // Gust the opponent's Benched Pokémon, then switch your own Active Pokémon
      return GUST_OPPONENT_BENCHED_POKEMON(store, state, player, {
        onSwitched: () => {
          SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
        },
      });
    }

    return state;
  }
}
