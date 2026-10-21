import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { GameError, GameMessage, Player, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Lebanne extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'M-P';
  public setNumber: string = '171';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lebanne';
  public fullName: string = 'Lebanne M-P';
  public text: string = 'Flip a coin. If heads, heal 150 damage from your Active Pokémon. If tails, heal 30 damage instead.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return player.active.damage > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.active.damage === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      COIN_FLIP_PROMPT(store, state, player, (result) => {
        const amount = result ? 150 : 30;
        const healEffect = new HealEffect(player, player.active, amount);
        store.reduceEffect(state, healEffect);
      });
    }

    return state;
  }
}
