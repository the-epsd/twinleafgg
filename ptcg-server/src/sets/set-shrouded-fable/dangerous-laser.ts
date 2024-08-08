import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class DangerousLaser extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.ACE_SPEC];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public regulationMark = 'H';

  public name: string = 'Dangerous Laser';

  public fullName: string = 'Dangerous Laser SFA';

  public text: string =
    'Your opponent\'s Active Pokémon is now Burned and Confused.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const active = opponent.active;
      active.addSpecialCondition(SpecialCondition.BURNED);
      active.addSpecialCondition(SpecialCondition.CONFUSED);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }
    return state;
  }
}