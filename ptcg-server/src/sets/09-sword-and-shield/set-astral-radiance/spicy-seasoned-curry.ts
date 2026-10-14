import { Player, SpecialCondition, State, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class SpicySeasonedCurry extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'E';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '151';
  public name: string = 'Spicy Seasoned Curry';
  public fullName: string = 'Spicy Seasoned Curry ASR';
  public text: string = 'Your Active Pokémon is now Burned. Heal 40 damage from it.';

  public canPlay(_store: StoreLike, _state: State, _player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const playerActive = player.active;

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      playerActive.specialConditions.push(SpecialCondition.BURNED);
      store.reduceEffect(state, new HealEffect(player, playerActive, 40));
      MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [this], sourceCard: this });
    }
    return state;
  }
}
