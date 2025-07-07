import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';

export class Phanpy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Flail',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the number of damage counters on Phanpy.'
  }];

  public set: string = 'HS';
  public name: string = 'Phanpy';
  public fullName: string = 'Phanpy HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = effect.player.active.damage;
    }
    return state;
  }

}