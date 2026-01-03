import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PreventRetreatEffect } from '../../game/store/effects/effect-of-attack-effects';

export class LarrysBraviary extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Larry\'s Rufflet';
  public tags = [CardTag.LARRYS];
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: '',
    cost: [C, C],
    damage: 50,
    text: 'During your opponent\'s next turn, the Defending Pokemon can\'t retreat.'
  },
  {
    name: 'Brave Bird',
    cost: [C, C, C],
    damage: 120,
    text: 'This Pokemon also does 30 damage to itself.'
  }];

  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Larry\'s Braviary';
  public fullName: string = 'Larry\'s Braviary M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const preventRetreat = new PreventRetreatEffect(effect);
      preventRetreat.markerSource = this;
      preventRetreat.applyEffect();
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
}