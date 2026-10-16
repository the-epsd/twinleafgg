import { PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIPS_FOR_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Kangaskhan extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Bite',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Comet Punch',
    cost: [C, C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Kangaskhan';
  public fullName: string = 'Kangaskhan MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Comet Punch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIPS_FOR_ATTACK(player.active, 'Comet Punch', 4);
    }

    return state;
  }
}
