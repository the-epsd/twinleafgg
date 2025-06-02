import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Machop extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Knuckle Punch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Karate Chop',
    cost: [F, C],
    damage: 30,
    damageCalculation: '-',
    text: 'Does 30 damage minus 10 damage for each damage counter on Machop.'
  }];

  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Machop';
  public fullName: string = 'Machop HL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const damage = Math.max(30 - player.active.damage, 0);
      effect.damage = damage;
    }

    return state;
  }
}
