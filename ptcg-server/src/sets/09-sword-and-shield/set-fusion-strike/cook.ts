import { TrainerCard, TrainerType, StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Cook extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '228';
  public name: string = 'Cook';
  public fullName: string = 'Cook FST';
  public text = 'Heal 70 damage from your Active Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const healEffect = new HealEffect(effect.player, effect.player.active, 70);
      return store.reduceEffect(state, healEffect);
    }
    return state;
  }
}
