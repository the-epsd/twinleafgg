import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';

import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Reshiram extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Flame',
    cost: [R],
    damage: 30,
    text: '',
  },
  {
    name: 'Burning Flare',
    cost: [R, R, R, R],
    damage: 240,
    text: 'This Pokemon does 60 damage to itself.',
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Reshiram';
  public fullName: string = 'Reshiram M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Deal 60 damage to this Pokemon
      const damageEffect = new DealDamageEffect(effect, 60);
      damageEffect.target = player.active;
      return store.reduceEffect(state, damageEffect);
    }

    return state;
  }
}
