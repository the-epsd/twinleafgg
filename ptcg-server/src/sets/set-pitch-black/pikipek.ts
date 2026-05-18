import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Pikipek extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Double Stab',
    cost: [C],
    damage: 0,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 10 damage for each heads.'
  },];

  public set: string = 'M5';
  public setNumber: string = '64';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pikipek';
  public fullName: string = 'Pikipek M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage += 10 * heads;
      });
    }
    return state;
  }
}
