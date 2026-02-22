import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, StateUtils, SpecialCondition } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ErikasGloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.ERIKAS];
  public evolvesFrom: string = 'Erika\'s Oddish';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Poison Spray',
    cost: [G, C],
    damage: 50,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Erika\'s Gloom';
  public fullName: string = 'Erika\'s Gloom MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialConditionEffect.target = opponent.active;
      return store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}