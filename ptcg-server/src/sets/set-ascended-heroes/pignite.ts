import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, SpecialCondition } from "../../game";
import { AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

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
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Pignite';
  public fullName: string = 'Pignite MC';

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