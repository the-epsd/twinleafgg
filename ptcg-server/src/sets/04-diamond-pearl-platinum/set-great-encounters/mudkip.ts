import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mudkip extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Mud Spatter',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Endeavor',
    cost: [C, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip 2 coins. This attack does 30 damage plus 20 more damage for each heads.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = 'Mudkip';
  public fullName: string = 'Mudkip GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Endeavor
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        effect.damage += 20 * results.filter(r => r).length;
      });
    }

    return state;
  }
}
