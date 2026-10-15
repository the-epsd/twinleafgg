import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mankey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Light Punch',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Rage',
    cost: [C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'Does 10 damage plus 10 more damage for each damage counter on Mankey.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Mankey';
  public fullName: string = 'Mankey GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage += effect.player.active.damage;
    }

    return state;
  }
}
