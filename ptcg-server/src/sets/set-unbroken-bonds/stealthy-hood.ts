import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';

export class StealthyHood extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public name: string = 'Stealthy Hood';
  public fullName: string = 'Stealthy Hood UNB';
  public set: string = 'UNB';
  public setNumber: string = '186';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // If this is an ability effect from the opponent
    if (effect instanceof EffectOfAbilityEffect && effect.target && effect.target.cards.includes(this)) {
      effect.target = undefined;
    }
    return state;
  }
}