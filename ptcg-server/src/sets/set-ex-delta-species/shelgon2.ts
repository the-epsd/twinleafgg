import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Shelgon2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bagon';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: C }];
  public resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Exoskeleton',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done to Shelgon by attacks is reduced by 10 (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Heat Blast',
      cost: [R, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'DS';
  public name: string = 'Shelgon';
  public fullName: string = 'Shelgon DS 54';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.target.getPokemonCard() === this) {
      if (IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }
      effect.damage -= 10;
    }

    return state;
  }

}
