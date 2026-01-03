import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game';

export class Pignite extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Tepig';
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: '',
    cost: [R, R, C],
    damage: 70,
    text: 'Your opponent\'s Active Pokemon is now Burned.'
  }];

  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Pignite';
  public fullName: string = 'Pignite M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      specialConditionEffect.target = opponent.active;
      return store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}