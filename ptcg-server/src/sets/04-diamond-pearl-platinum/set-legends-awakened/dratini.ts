import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIPS_FOR_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Dratini extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 40;
  public cardType: CardType[] = [C];
  public weakness = [{ type: C, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Slap',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Slam',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Dratini';
  public fullName: string = 'Dratini LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slam
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIPS_FOR_ATTACK(player.active, 'Slam', 2);
    }

    return state;
  }
}
