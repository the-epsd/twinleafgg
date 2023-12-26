import { SpecialCondition, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';  
import { HealEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class SpicySeasonedCurry extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public regulationMark = 'F';

  public name: string = 'Spicy Seasoned Curry';

  public fullName: string = 'Spicy Seasoned Curry ASR';

  public text: string = 
    'Your Active Pokémon is now Burned. Heal 40 damage from it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const playerActive = player.active;
      playerActive.specialConditions.push(SpecialCondition.BURNED);
      store.reduceEffect(state, new HealEffect(player, playerActive, 40));
    }
    return state;
  }
}